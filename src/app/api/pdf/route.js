import React from 'react'
import fs from 'fs'
import path from 'path'
import { renderToBuffer } from '@react-pdf/renderer'
import { put } from '@vercel/blob'
import { supabaseAdmin } from '@/lib/supabase'
import { KovaPdfDocument } from './KovaPdfDocument'
import { ralMatch } from '@/lib/ralMatch'

const logoPath = path.join(process.cwd(), 'public/logos/logo-transparent-blanc.png')
const logoBase64 = `data:image/png;base64,${fs.readFileSync(logoPath).toString('base64')}`

function enrichWithRal(aiResult) {
  if (!aiResult?.directions) return aiResult
  return {
    ...aiResult,
    directions: aiResult.directions.map(dir => ({
      ...dir,
      palette: (dir.palette ?? []).map(color => {
        if (color.statut !== 'a_appliquer') return color
        const match = ralMatch(color.hex)
        return match ? { ...color, ral: match.code } : color
      }),
    })),
  }
}

function parsePhotoUrls(raw) {
  if (!raw) return []
  if (raw.startsWith('[')) {
    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : [raw]
    } catch {}
  }
  return [raw]
}

export async function POST(request) {
  let body
  try { body = await request.json() } catch { return Response.json({ error: 'Corps invalide' }, { status: 400 }) }

  const { analysisId } = body
  if (!analysisId) return Response.json({ error: 'analysisId requis' }, { status: 400 })

  const { data: analysis, error } = await supabaseAdmin
    .from('room_analyses')
    .select('ai_result, photo_url, room_context, style_context, style_profile_snap')
    .eq('id', analysisId)
    .single()

  if (error || !analysis?.ai_result) {
    return Response.json({ error: 'Analyse introuvable ou résultat manquant' }, { status: 404 })
  }

  // Parse room_context si stocké en string JSON dans Supabase
  const rc = typeof analysis.room_context === 'string'
    ? JSON.parse(analysis.room_context)
    : analysis.room_context

  const sc = typeof analysis.style_context === 'string'
    ? JSON.parse(analysis.style_context)
    : analysis.style_context

  // Vérifie que chaque photo est accessible avant de la passer au composant
  const rawUrls = parsePhotoUrls(analysis.photo_url)
  const photoUrls = (
    await Promise.all(
      rawUrls.map(async (url) => {
        try {
          const test = await fetch(url, { method: 'HEAD' })
          return test.ok ? url : null
        } catch { return null }
      })
    )
  ).filter(Boolean)

  try {
    const pdfBuffer = await renderToBuffer(
      React.createElement(KovaPdfDocument, {
        aiResult: enrichWithRal(analysis.ai_result),
        logoBase64,
        photoUrls,
        roomContext: rc,
        styleContext: sc,
      })
    )
    const blob = await put(`analyses/${analysisId}.pdf`, pdfBuffer, {
      access: 'public', contentType: 'application/pdf', addRandomSuffix: true,
    })
    await supabaseAdmin
      .from('room_analyses')
      .update({ pdf_url: blob.url, delivered_at: new Date().toISOString() })
      .eq('id', analysisId)
    return Response.json({ pdfUrl: blob.url })
  } catch (err) {
    console.error('[pdf]', err?.message)
    return Response.json({ error: err.message }, { status: 500 })
  }
}
