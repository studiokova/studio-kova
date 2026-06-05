import React from 'react'
import { Document, Page, Text, View, Image, Font, StyleSheet } from '@react-pdf/renderer'
import path from 'path'

const FONT_DIR = path.join(process.cwd(), 'public', 'fonts')

Font.register({
  family: 'DMSans',
  fonts: [
    { src: path.join(FONT_DIR, 'DMSans-clean.ttf'), fontWeight: 400 },
    { src: path.join(FONT_DIR, 'DMSans-Italic-clean.ttf'), fontWeight: 400, fontStyle: 'italic' },
    { src: path.join(FONT_DIR, 'DMSans-clean.ttf'), fontWeight: 500 },
    { src: path.join(FONT_DIR, 'DMSans-clean.ttf'), fontWeight: 700 },
  ],
})

Font.register({
  family: 'Playfair',
  fonts: [
    { src: path.join(FONT_DIR, 'PlayfairDisplay-clean.ttf'), fontWeight: 400 },
    { src: path.join(FONT_DIR, 'PlayfairDisplay-Italic-clean.ttf'), fontWeight: 400, fontStyle: 'italic' },
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
  casUsageLabel: {
    fontFamily: 'DMSans',
    fontSize: 9,
    color: C.CUIVRE,
    letterSpacing: 0.3,
    marginTop: 4,
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
  directionDesc: {
    fontSize: 10,
    color: C.SAUGE_FONCE,
    lineHeight: 1.6,
    marginBottom: 16,
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
  enviesBox: {
    backgroundColor: C.BLANC,
    borderWidth: 0.5,
    borderColor: C.SAUGE_FONCE,
    borderRadius: 8,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 12,
    paddingRight: 12,
    marginTop: 10,
  },
  enviesTitle: {
    fontFamily: 'Playfair',
    fontSize: 11,
    color: C.SAUGE_FONCE,
    marginBottom: 8,
  },
  enviesRow: {
    flexDirection: 'row',
  },
  enviesLabel: {
    fontFamily: 'DMSans',
    fontWeight: 700,
    fontSize: 9,
    color: C.CUIVRE,
    width: 120,
  },
  enviesValue: {
    fontFamily: 'DMSans',
    fontSize: 9,
    color: C.GRIS,
    flex: 1,
    lineHeight: 1.5,
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

const CAS_USAGE_LABELS: Record<string, string> = {
  surfaces: 'Votre projet : refaire les surfaces',
  deco: 'Votre projet : refaire la déco',
  tout: 'Votre projet : tout repenser',
}

const CAS_USAGE_SHORT: Record<string, string> = {
  surfaces: 'Refaire les surfaces',
  deco: 'Refaire la déco',
  tout: 'Tout repenser',
}

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

function chunkPhotos(urls: string[]): string[][] {
  const n = urls.length
  if (n === 0) return []
  const MAX_PER_ROW = 4
  const numRows = Math.ceil(n / MAX_PER_ROW)
  const cols = Math.ceil(n / numRows)
  const rows: string[][] = []
  for (let i = 0; i < n; i += cols) {
    rows.push(urls.slice(i, i + cols))
  }
  return rows
}

function d(text: string): string {
  return text
    .replace(/([,;:.!?])\s*—\s*/g, '$1 ')
    .replace(/ — /g, ', ')
    .replace(/—/g, ', ')
    .replace(/–/g, ' - ')
    .replace(/-/g, ' - ')
    .replace(/ {2,}/g, ' ')
}

interface PaletteColor { hex: string; nom: string; usage?: string; statut?: 'a_appliquer' | 'existant'; ral?: string }
interface Action { action: string; pourquoi: string; cout_estime: string }
interface Direction { intitule: string; description: string; palette: PaletteColor[]; actions: Action[] }

function PaletteBlock({ palette }: { palette: PaletteColor[] }) {
  const items = (palette ?? []).slice(0, 5)
  if (items.length === 0) return null
  return (
    <View style={s.paletteRow}>
      {items.map((c, i) => {
        const existant = c.statut === 'existant'
        return (
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
            {existant && (
              <Text style={{ fontSize: 7, color: C.GRIS, fontStyle: 'italic', textAlign: 'center' }}>
                {d('conservé')}
              </Text>
            )}
            {!existant && c.ral && (
              <Text style={{ fontSize: 7, color: C.GRIS, textAlign: 'center' }}>
                {`RAL le plus proche : ${c.ral}`}
              </Text>
            )}
          </View>
        )
      })}
    </View>
  )
}

function ActionsBlock({ actions }: { actions: Action[] }) {
  const items = (actions ?? []).slice(0, 4)
  if (items.length === 0) return null
  return (
    <>
      {items.map((p, i) => (
        <View
          key={i}
          style={[s.priorityRow, i < items.length - 1 ? s.priorityRowBorder : {}]}
        >
          <Text style={s.priorityNum}>{String(i + 1).padStart(2, '0')}</Text>
          <View style={s.priorityContent}>
            <Text style={s.priorityAction}>{d(p.action)}</Text>
            <Text style={s.priorityPourquoi}>{d(p.pourquoi)}</Text>
            <Text style={s.priorityBudget}>Budget : {d(p.cout_estime)}</Text>
          </View>
        </View>
      ))}
    </>
  )
}

export interface AiResult {
  diagnostic: string
  cas_usage?: string
  directions: Direction[]
  matieres: string[]
  a_eviter?: string[]
  phrase_cle: string
}

interface EnviesBlockProps {
  roomContext?: Record<string, unknown>
  styleContext?: Record<string, unknown>
}

function EnviesBlock({ roomContext, styleContext }: EnviesBlockProps) {
  const casUsage = roomContext?.cas_usage as string | undefined
  const items = [
    { label: 'Votre projet', value: casUsage ? CAS_USAGE_SHORT[casUsage] : undefined },
    { label: 'Ce que vous gardez', value: roomContext?.garder },
    { label: 'Vos contraintes', value: roomContext?.contraintes },
    { label: 'Votre demande', value: styleContext?.demande_precise },
    { label: 'Couleur que vous aimez', value: styleContext?.couleur_aimee },
    { label: 'Couleur à éviter', value: styleContext?.couleur_evitee },
  ].filter((item): item is { label: string; value: string } =>
    typeof item.value === 'string' && item.value.trim() !== ''
  )

  if (items.length === 0) return null

  return (
    <View style={s.enviesBox}>
      <Text style={s.enviesTitle}>Vos envies pour cette pièce</Text>
      {items.map((item, i) => (
        <View key={i} style={[s.enviesRow, i < items.length - 1 ? { marginBottom: 5 } : {}]}>
          <Text style={s.enviesLabel}>{item.label}</Text>
          <Text style={s.enviesValue}>{d(item.value)}</Text>
        </View>
      ))}
    </View>
  )
}

export interface KovaPdfDocumentProps {
  aiResult: AiResult
  logoBase64: string
  photoUrls: string[]
  roomContext?: Record<string, unknown>
  styleContext?: Record<string, unknown>
}

export function KovaPdfDocument({ aiResult, logoBase64, photoUrls, roomContext, styleContext }: KovaPdfDocumentProps) {
  const directions = aiResult.directions ?? []
  const matieres = aiResult.matieres ?? []
  const aEviter = aiResult.a_eviter ?? []
  const casUsageLabel = aiResult.cas_usage ? CAS_USAGE_LABELS[aiResult.cas_usage] : undefined

  return (
    <Document>
      {/* PAGE 1 — COMMUNE : titre, cas d'usage, photos, diagnostic */}
      <Page size="A4" style={s.page}>
        <PageHeader logoBase64={logoBase64} />

        <View style={s.titleBlock}>
          <Text style={s.titlePiece}>{d(String(roomContext?.type_piece ?? ''))}</Text>
          <Text style={s.titleSub}>
            {'Analyse personnalisée · Budget '}
            {d(String(roomContext?.budget ?? ''))}
          </Text>
          {casUsageLabel && (
            <Text style={s.casUsageLabel}>{casUsageLabel}</Text>
          )}
        </View>

        {photoUrls.length > 0 && (
          <View style={{ paddingLeft: 40, paddingRight: 40, paddingBottom: 14 }}>
            {chunkPhotos(photoUrls).map((row, ri) => (
              <View key={ri} style={{ flexDirection: 'row', marginBottom: 8 }}>
                {row.map((url, ci) => (
                  <Image
                    key={ci}
                    src={url}
                    style={{ width: 110, height: 110, objectFit: 'cover', borderRadius: 6, marginRight: ci < row.length - 1 ? 8 : 0 }}
                  />
                ))}
              </View>
            ))}
          </View>
        )}

        <View style={s.content}>
          <Text style={s.sectionLabel}>Diagnostic</Text>
          <Text style={s.diagnostic}>{d(aiResult.diagnostic)}</Text>
          <EnviesBlock roomContext={roomContext} styleContext={styleContext} />
        </View>

        <PageFooter />
      </Page>

      {/* PAGES 2-4 — UNE PAGE PAR DIRECTION (Neutre, Médian, Coloré) */}
      {directions.map((dir, idx) => (
        <Page key={idx} size="A4" style={s.page}>
          <PageHeader logoBase64={logoBase64} />

          <View style={s.titleBlock}>
            <Text style={s.titlePiece}>{d(dir.intitule)}</Text>
            <View style={s.titleSeparator} />
          </View>

          <View style={s.content}>
            <Text style={s.directionDesc}>{d(dir.description)}</Text>

            <Text style={s.sectionLabel}>Palette de couleurs</Text>
            <PaletteBlock palette={dir.palette} />

            <Text style={s.sectionLabelSpaced}>Actions prioritaires</Text>
            <ActionsBlock actions={dir.actions} />
          </View>

          <PageFooter />
        </Page>
      ))}

      {/* PAGE 5 — COMMUNE : matières, à éviter, phrase clé */}
      <Page size="A4" style={s.page}>
        <PageHeader logoBase64={logoBase64} />

        <View style={s.contentPage2}>
          <Text style={s.sectionLabel}>Matières recommandées</Text>
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
