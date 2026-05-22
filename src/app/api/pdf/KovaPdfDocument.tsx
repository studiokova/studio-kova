import React from 'react'
import { Document, Page, Text, View, Image, Font, StyleSheet } from '@react-pdf/renderer'
import path from 'path'

const FONT_DIR = path.join(process.cwd(), 'public', 'fonts')

Font.register({
  family: 'DMSans',
  fonts: [
    { src: path.join(FONT_DIR, 'DMSans.ttf'), fontWeight: 400 },
    { src: path.join(FONT_DIR, 'DMSans-Italic.ttf'), fontWeight: 400, fontStyle: 'italic' },
    { src: path.join(FONT_DIR, 'DMSans.ttf'), fontWeight: 500 },
    { src: path.join(FONT_DIR, 'DMSans.ttf'), fontWeight: 700 },
  ],
})

Font.register({
  family: 'Playfair',
  fonts: [
    { src: path.join(FONT_DIR, 'PlayfairDisplay.ttf'), fontWeight: 400 },
    { src: path.join(FONT_DIR, 'PlayfairDisplay-Italic.ttf'), fontWeight: 400, fontStyle: 'italic' },
  ],
})

Font.registerHyphenationCallback((word) => [word])

const C = {
  CRAIE: '#F5EFE4',
  CUIVRE: '#B8612A',
  SAUGE_FONCE: '#2E4A3A',
  OCRE: '#E8C97A',
  GRIS: '#888780',
  GRIS_CLAIR: '#D3D1C7',
  BLANC: '#FFFFFF',
} as const

const s = StyleSheet.create({
  page: {
    backgroundColor: C.CRAIE,
    fontFamily: 'DMSans',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  },
  header: {
    backgroundColor: C.SAUGE_FONCE,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 24,
    paddingRight: 24,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  photo: {
    width: '100%',
    height: 220,
    objectFit: 'cover',
  },
  photoFallback: {
    width: '100%',
    height: 220,
    backgroundColor: C.GRIS_CLAIR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoFallbackText: {
    fontFamily: 'DMSans',
    fontSize: 11,
    color: C.GRIS,
    textAlign: 'center',
  },
  titleBlock: {
    paddingTop: 20,
    paddingRight: 40,
    paddingBottom: 20,
    paddingLeft: 40,
  },
  titlePiece: {
    fontFamily: 'Playfair',
    fontStyle: 'italic',
    fontSize: 24,
    color: C.SAUGE_FONCE,
    marginBottom: 6,
  },
  titleSub: {
    fontFamily: 'DMSans',
    fontSize: 10,
    color: C.GRIS,
    letterSpacing: 0.3,
  },
  titleSeparator: {
    height: 1,
    backgroundColor: C.GRIS_CLAIR,
    marginTop: 16,
  },
  content: {
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 12,
    paddingBottom: 48,
  },
  contentPage2: {
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 24,
    paddingBottom: 32,
  },
  sectionLabel: {
    fontFamily: 'DMSans',
    fontWeight: 700,
    fontSize: 9,
    color: C.CUIVRE,
    letterSpacing: 0.5,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  sectionLabelSpaced: {
    fontFamily: 'DMSans',
    fontWeight: 700,
    fontSize: 9,
    color: C.CUIVRE,
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 12,
    textTransform: 'uppercase',
  },
  diagnostic: {
    fontSize: 10,
    color: C.SAUGE_FONCE,
    lineHeight: 1.6,
    marginBottom: 20,
  },
  paletteRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 0,
  },
  swatchContainer: {
    alignItems: 'center',
    width: 80,
  },
  swatchName: {
    fontSize: 9,
    color: C.SAUGE_FONCE,
    textAlign: 'center',
  },
  swatchHex: {
    fontSize: 8,
    color: C.GRIS,
    textAlign: 'center',
  },
  priorityRow: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingBottom: 8,
  },
  priorityRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: C.GRIS_CLAIR,
  },
  priorityNum: {
    fontFamily: 'Playfair',
    fontStyle: 'italic',
    fontSize: 20,
    color: C.CUIVRE,
    width: 32,
    marginTop: 0,
  },
  priorityContent: { flex: 1 },
  priorityAction: {
    fontWeight: 700,
    fontSize: 10,
    color: C.SAUGE_FONCE,
    marginBottom: 4,
  },
  priorityPourquoi: {
    fontStyle: 'italic',
    fontSize: 9,
    color: C.GRIS,
    lineHeight: 1.6,
    marginBottom: 4,
  },
  priorityBudget: {
    fontSize: 10,
    color: C.CUIVRE,
  },
  matiereRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  matiereBullet: {
    color: C.CUIVRE,
    fontSize: 14,
    marginRight: 10,
    marginTop: -2,
  },
  matiereBulletGris: {
    color: C.GRIS,
    fontSize: 14,
    marginRight: 10,
    marginTop: -2,
  },
  matiereText: {
    fontSize: 9,
    color: C.SAUGE_FONCE,
    lineHeight: 1.6,
    flex: 1,
  },
  matiereTextGris: {
    fontSize: 9,
    color: C.GRIS,
    lineHeight: 1.6,
    flex: 1,
  },
  phraseBox: {
    backgroundColor: C.SAUGE_FONCE,
    borderRadius: 8,
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 14,
    paddingRight: 14,
    marginTop: 16,
    marginBottom: 0,
  },
  phraseText: {
    fontFamily: 'Playfair',
    fontStyle: 'italic',
    fontSize: 13,
    color: C.CRAIE,
    textAlign: 'center',
    lineHeight: 1.8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 40,
    paddingRight: 40,
    backgroundColor: C.CRAIE,
    borderTopWidth: 0.5,
    borderTopColor: C.GRIS_CLAIR,
  },
  footerText: {
    fontFamily: 'DMSans',
    fontSize: 8,
    color: C.GRIS,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
})

interface PageHeaderProps { logoBase64: string }

function PageHeader({ logoBase64 }: PageHeaderProps) {
  return (
    <View style={s.header}>
      <Image style={{ height: 28, width: 'auto' }} src={logoBase64} />
    </View>
  )
}

function PageFooter() {
  return (
    <View style={s.footer}>
      <Text style={s.footerText}>Studio Kova · hello@studiokova.fr</Text>
    </View>
  )
}

function d(text: string): string {
  return text
    .replace(/-/g, ' - ')
    .replace(/–/g, '-')
}

interface PaletteColor { hex: string; nom: string }
interface Priorite { action: string; pourquoi: string; cout_estime: string }

export interface AiResult {
  diagnostic: string
  palette: PaletteColor[]
  priorites: Priorite[]
  matieres: string[]
  a_eviter?: string[]
  phrase_cle: string
}

export interface KovaPdfDocumentProps {
  aiResult: AiResult
  logoBase64: string
  photoUrl: string | null
  roomContext?: Record<string, unknown>
}

export function KovaPdfDocument({ aiResult, logoBase64, photoUrl, roomContext }: KovaPdfDocumentProps) {
  let firstPhotoUrl: string | null = null
  if (photoUrl) {
    if (Array.isArray(photoUrl)) {
      firstPhotoUrl = (photoUrl as string[])[0] ?? null
    } else if (typeof photoUrl === 'string') {
      if (photoUrl.startsWith('[')) {
        try {
          const parsed = JSON.parse(photoUrl)
          firstPhotoUrl = Array.isArray(parsed) ? parsed[0] : parsed
        } catch {
          firstPhotoUrl = photoUrl
        }
      } else {
        firstPhotoUrl = photoUrl
      }
    }
  }

  const palette   = (aiResult.palette   ?? []).slice(0, 5)
  const priorites = (aiResult.priorites ?? []).slice(0, 4)
  const matieres  = aiResult.matieres   ?? []
  const aEviter   = aiResult.a_eviter   ?? []

  return (
    <Document>
      {/* PAGE 1 - PHOTO + TITRE + DIAGNOSTIC + PALETTE */}
      <Page size="A4" style={s.page}>
        <PageHeader logoBase64={logoBase64} />

        {firstPhotoUrl
          ? <Image src={firstPhotoUrl} style={{ width: '100%', height: 220, objectFit: 'cover' }} />
          : <View style={s.photoFallback}><Text style={s.photoFallbackText}>Votre pièce</Text></View>
        }

        <View style={s.titleBlock}>
          <Text style={s.titlePiece}>{d(String(roomContext?.type_piece ?? ''))}</Text>
          <Text style={s.titleSub}>
            {'Analyse personnalisée · Budget '}
            {d(String(roomContext?.budget ?? ''))}
          </Text>
          <View style={s.titleSeparator} />
        </View>

        <View style={s.content}>
          <Text style={s.sectionLabel}>Diagnostic</Text>
          <Text style={s.diagnostic}>{d(aiResult.diagnostic)}</Text>

          <Text style={s.sectionLabel}>Palette de couleurs</Text>
          <View style={s.paletteRow}>
            {palette.map((c, i) => (
              <View key={i} style={s.swatchContainer}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: c.hex.startsWith('#') ? c.hex : `#${c.hex}`,
                    alignSelf: 'center',
                    marginBottom: 8,
                    borderWidth: 0.5,
                    borderColor: C.SAUGE_FONCE,
                    borderStyle: 'solid',
                  }}
                />
                <Text style={s.swatchName}>{d(c.nom)}</Text>
                <Text style={s.swatchHex}>{c.hex}</Text>
              </View>
            ))}
          </View>
        </View>

        <PageFooter />
      </Page>

      {/* PAGE 2 - PRIORITÉS + MATIÈRES + À ÉVITER + PHRASE CLÉ */}
      <Page size="A4" style={s.page}>
        <PageHeader logoBase64={logoBase64} />

        <View wrap={false} style={s.contentPage2}>
          <Text style={s.sectionLabel}>Vos priorités</Text>
          {priorites.map((p, i) => (
            <View
              key={i}
              style={[s.priorityRow, i < priorites.length - 1 ? s.priorityRowBorder : {}]}
            >
              <Text style={s.priorityNum}>{String(i + 1).padStart(2, '0')}</Text>
              <View style={s.priorityContent}>
                <Text style={s.priorityAction}>{d(p.action)}</Text>
                <Text style={s.priorityPourquoi}>{d(p.pourquoi)}</Text>
                <Text style={s.priorityBudget}>Budget : {d(p.cout_estime)}</Text>
              </View>
            </View>
          ))}

          <Text style={s.sectionLabelSpaced}>Matières recommandées</Text>
          {matieres.map((m, i) => (
            <View key={i} style={s.matiereRow}>
              <Text style={s.matiereBullet}>•</Text>
              <Text style={s.matiereText}>{d(m)}</Text>
            </View>
          ))}

          {aEviter.length > 0 && (
            <>
              <Text style={s.sectionLabelSpaced}>À éviter</Text>
              {aEviter.map((item, i) => (
                <View key={i} style={s.matiereRow}>
                  <Text style={s.matiereBulletGris}>•</Text>
                  <Text style={s.matiereTextGris}>{d(item)}</Text>
                </View>
              ))}
            </>
          )}

          <View wrap={false} style={s.phraseBox}>
            <Text style={s.phraseText}>{d(aiResult.phrase_cle)}</Text>
          </View>
        </View>

        <PageFooter />
      </Page>
    </Document>
  )
}
