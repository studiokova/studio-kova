import React from 'react'
import fs from 'fs'
import path from 'path'
import { renderToBuffer } from '@react-pdf/renderer'
import { put } from '@vercel/blob'
import { supabaseAdmin } from '@/lib/supabase'
import { KovaPdfDocument } from './KovaPdfDocument'

const logoPath = path.join(process.cwd(), 'public/images/logo-transparent-blanc.png')
const logoBase64 = `data:image/png;base64,${fs.readFileSync(logoPath).toString('base64')}`

function parsePhotoUrl(raw) {
  if (!raw) return null
  if (raw.startsWith('[')) {
    try { return JSON.parse(raw)[0] ?? null } catch {}
  }
  return raw
}

export async function POST(request) {
  let body
  try { body = await request.json() } catch { return Response.json({ error: 'Corps invalide' }, { status: 400 }) }

  const { analysisId } = body
  if (!analysisId) return Response.json({ error: 'analysisId requis' }, { status: 400 })

  const { data: analysis, error } = await supabaseAdmin
    .from('room_analyses')
    .select('ai_result, photo_url, room_context, style_profile_snap')
    .eq('id', analysisId)
    .single()

  if (error || !analysis?.ai_result) {
    return Response.json({ error: 'Analyse introuvable ou résultat manquant' }, { status: 404 })
  }

  // Parse room_context si stocké en string JSON dans Supabase
  const rc = typeof analysis.room_context === 'string'
    ? JSON.parse(analysis.room_context)
    : analysis.room_context

  // Vérifie que la photo est accessible avant de la passer au composant
  let photoUrl = parsePhotoUrl(analysis.photo_url)
  if (photoUrl) {
    try {
      const test = await fetch(photoUrl, { method: 'HEAD' })
      if (!test.ok) photoUrl = null
    } catch { photoUrl = null }
  }

  try {
    const pdfBuffer = await renderToBuffer(
      React.createElement(KovaPdfDocument, {
        aiResult: analysis.ai_result,
        logoBase64,
        photoUrl,
        roomContext: rc,
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
