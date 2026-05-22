'use client'
import { useState } from 'react'
import KovaHeading from '@/components/kova/KovaHeading'
import KovaText from '@/components/kova/KovaText'
import KovaInput from '@/components/kova/KovaInput'
import KovaTextarea from '@/components/kova/KovaTextarea'
import KovaButton from '@/components/kova/KovaButton'
import KovaAlert from '@/components/kova/KovaAlert'
import Chips from './Chips'

const TYPES     = ['Salon', 'Chambre', 'Bureau', 'Salle à manger', 'Entrée', 'Autre']
const APPROCHES = ["Améliorer l'existant", 'Repartir de zéro']
const BUDGETS   = ['Moins de 300€', '300–800€', '800–1 500€', 'Plus de 1 500€']
const AMBIANCES = ['Cosy', 'Lumineux', 'Zen', 'Élégant', 'Vivant', 'Minimaliste']

const gap = { marginBottom: 24 }

export default function StepQuestions({ styleProfile, onSubmit }) {
  const [typePiece, setTypePiece]             = useState('')
  const [approche, setApproche]               = useState('')
  const [garder, setGarder]                   = useState('')
  const [budget, setBudget]                   = useState('')
  const [probleme, setProbleme]               = useState('')
  const [ambiance, setAmbiance]               = useState('')
  const [couleursAimees, setCouleursAimees]   = useState('')
  const [couleursEvitees, setCouleursEvitees] = useState('')
  const [matieres, setMatieres]               = useState('')

  const hasProfile = styleProfile !== null && styleProfile !== undefined

  function handleSubmit() {
    const roomContext = {
      type_piece: typePiece,
      approche: approche === "Améliorer l'existant" ? 'ameliorer' : 'zero',
      garder,
      budget,
      probleme,
      ...(!hasProfile && {
        ambiance_cible: ambiance ? [ambiance] : [],
        couleurs_aimees: couleursAimees,
        couleurs_evitees: couleursEvitees,
        matieres_preferees: matieres,
      }),
    }
    onSubmit(roomContext)
  }

  return (
    <div>
      <KovaHeading level="h2">Votre pièce</KovaHeading>

      {hasProfile && (
        <div style={gap}>
          <KovaAlert
            type="info"
            message={`Votre profil style "${styleProfile.style_name}" a été retrouvé - vos préférences sont déjà prises en compte.`}
          />
        </div>
      )}

      {!hasProfile && styleProfile !== undefined && (
        <div style={gap}>
          <KovaAlert
            type="info"
            message="Vous n'avez pas encore fait le quiz gratuit - répondez à ces quelques questions pour personnaliser votre analyse."
          />
        </div>
      )}

      <div style={gap}>
        <KovaText size="sm" as="span">Type de pièce</KovaText>
        <Chips options={TYPES} value={typePiece} onChange={setTypePiece} />
      </div>

      <div style={gap}>
        <KovaText size="sm" as="span">Approche</KovaText>
        <Chips options={APPROCHES} value={approche} onChange={setApproche} />
      </div>

      <div style={gap}>
        <KovaInput
          label="Ce que vous gardez absolument"
          placeholder="Canapé gris, bibliothèque blanche…"
          value={garder}
          onChange={(e) => setGarder(e.target.value)}
        />
      </div>

      <div style={gap}>
        <KovaText size="sm" as="span">Budget</KovaText>
        <Chips options={BUDGETS} value={budget} onChange={setBudget} />
      </div>

      <div style={gap}>
        <KovaTextarea
          label="Ce qui vous dérange le plus"
          placeholder="Rien ne va ensemble, c'est trop froid…"
          rows={3}
          value={probleme}
          onChange={(e) => setProbleme(e.target.value)}
        />
      </div>

      {!hasProfile && (
        <>
          <div style={gap}>
            <KovaText size="sm" as="span">Ambiance souhaitée</KovaText>
            <Chips options={AMBIANCES} value={ambiance} onChange={setAmbiance} />
          </div>
          <div style={gap}>
            <KovaInput label="Couleurs que vous aimez" placeholder="Vert sauge, terracotta…" value={couleursAimees} onChange={(e) => setCouleursAimees(e.target.value)} />
          </div>
          <div style={gap}>
            <KovaInput label="Couleurs à éviter" placeholder="Gris froid, jaune criard…" value={couleursEvitees} onChange={(e) => setCouleursEvitees(e.target.value)} />
          </div>
          <div style={gap}>
            <KovaInput label="Matières préférées" placeholder="Lin, rotin, bois clair…" value={matieres} onChange={(e) => setMatieres(e.target.value)} />
          </div>
        </>
      )}

      <KovaButton
        variant="primary"
        fullWidth
        disabled={!typePiece || !approche || !budget || !probleme}
        onClick={handleSubmit}
      >
        Lancer mon analyse →
      </KovaButton>
    </div>
  )
}
