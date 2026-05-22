'use client'
import { useRef, useState } from 'react'
import KovaHeading from '@/components/kova/KovaHeading'
import KovaText from '@/components/kova/KovaText'
import KovaAlert from '@/components/kova/KovaAlert'

const MAX_SIZE = 5 * 1024 * 1024

export default function StepUpload({ onSuccess }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [uploaded, setUploaded] = useState(false)

  async function handleFile(file) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Fichier non valide - choisissez une image.')
      return
    }
    if (file.size > MAX_SIZE) {
      setError('Image trop lourde - maximum 5 Mo.')
      return
    }
    setError('')
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      const { url } = await res.json()
      setUploaded(true)
      setTimeout(() => onSuccess(url), 700)
    } catch {
      setError("Erreur lors de l'upload. Réessayez.")
    } finally {
      setUploading(false)
    }
  }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <div>
      <KovaHeading level="h2">Votre pièce en photo</KovaHeading>
      <KovaText muted style={{ marginBottom: 24 }}>
        Choisissez une photo qui montre bien l&apos;espace à transformer.
      </KovaText>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !uploading && !uploaded && inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? 'var(--cuivre)' : 'var(--gris-clair)'}`,
          borderRadius: 14,
          padding: '56px 24px',
          textAlign: 'center',
          cursor: uploading || uploaded ? 'default' : 'pointer',
          background: dragging ? 'rgba(184,97,42,.05)' : 'transparent',
          transition: 'border-color 0.2s, background 0.2s',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files[0])}
        />
        {uploading ? (
          <KovaText muted>Upload en cours…</KovaText>
        ) : (
          <>
            <KovaText>Glissez une photo ici</KovaText>
            <KovaText size="sm" muted>
              ou cliquez pour sélectionner - JPG, PNG, WebP · max 5 Mo
            </KovaText>
          </>
        )}
      </div>

      {uploaded && (
        <div style={{ marginTop: 12 }}>
          <KovaAlert type="success" message="Photo chargée - passage à l'étape suivante…" />
        </div>
      )}

      {error && (
        <div style={{ marginTop: 12 }}>
          <KovaAlert type="error" message={error} onDismiss={() => setError('')} />
        </div>
      )}
    </div>
  )
}
