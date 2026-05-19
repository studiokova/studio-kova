'use client'
import { useState } from 'react'
import KovaHeading from '@/components/kova/KovaHeading'
import KovaText from '@/components/kova/KovaText'
import KovaInput from '@/components/kova/KovaInput'
import KovaButton from '@/components/kova/KovaButton'
import KovaAlert from '@/components/kova/KovaAlert'

export default function StepEmail({ email, onEmailChange, onProfileLoaded, onNext }) {
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState('')

  async function checkProfile() {
    if (!email) return
    setError('')
    setChecking(true)
    try {
      const res = await fetch(`/api/profile?email=${encodeURIComponent(email)}`)
      const { profile } = await res.json()
      onProfileLoaded(profile)
    } catch {
      setError("Impossible de vérifier votre profil. Continuez, vos préférences seront saisies à l'étape suivante.")
      onProfileLoaded(null)
    } finally {
      setChecking(false)
    }
  }

  return (
    <div>
      <KovaHeading level="h2">Votre email</KovaHeading>
      <KovaText muted style={{ marginBottom: 24 }}>
        Pour recevoir votre analyse PDF sous 48h.
      </KovaText>

      <KovaInput
        label="Email"
        type="email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        onBlur={checkProfile}
        placeholder="vous@exemple.fr"
        disabled={checking}
      />

      {checking && (
        <KovaText size="sm" muted style={{ marginTop: 8 }}>
          Vérification de votre profil…
        </KovaText>
      )}

      {error && (
        <div style={{ marginTop: 12 }}>
          <KovaAlert type="error" message={error} onDismiss={() => setError('')} />
        </div>
      )}

      <div style={{ marginTop: 32 }}>
        <KovaButton
          variant="primary"
          disabled={!email || checking}
          onClick={onNext}
          fullWidth
        >
          Continuer →
        </KovaButton>
      </div>
    </div>
  )
}
