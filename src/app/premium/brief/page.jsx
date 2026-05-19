'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import KovaStepShell from '@/components/kova/KovaStepShell'
import KovaAlert from '@/components/kova/KovaAlert'
import KovaFooter from '@/components/kova/KovaFooter'
import { track } from '@/lib/plausible'
import { OFFERS } from '@/lib/config'
import { useConsent } from '@/app/components/ConsentContext'
import { getStoredUtms } from '@/lib/utmTracking'

const ROOM_TYPES = ['Salon', 'Chambre', 'Bureau', 'Salle à manger', 'Entrée', 'Cuisine', 'Salle de bain', 'Chambre enfant', 'Autre']
const BUDGETS = ['Moins de 500€', '500–1000€', '1000–2000€', '2000–3500€', 'Plus de 3500€']
const AMBIANCES = ['Cosy', 'Lumineux', 'Apaisant', 'Élégant', 'Vivant', 'Minimaliste', 'Chaleureux', 'Bohème']

const CSS = `
  .pb-wrap { max-width: 560px; margin: 0 auto; padding: 24px 24px 120px; }
  .pb-title { font-family: "Playfair Display", serif; font-style: italic; font-size: 28px; color: #2E4A3A; margin-top: 24px; margin-bottom: 8px; line-height: 1.2; }
  .pb-sub { font-size: 14px; color: #888780; line-height: 1.6; margin-bottom: 28px; }
  .pb-badge { display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 500; color: #2E4A3A; background: rgba(61,107,82,0.1); border: 1px solid rgba(61,107,82,0.2); margin-bottom: 8px; font-family: "DM Sans", sans-serif; }
  .pb-label { font-size: 13px; font-weight: 500; color: #2E4A3A; margin-bottom: 8px; display: block; }
  .pb-hint { font-size: 12px; color: #888780; margin-top: 6px; }
  .pb-input { width: 100%; padding: 14px; border: 1.5px solid #D3D1C7; border-radius: 10px; font-family: "DM Sans", sans-serif; font-size: 15px; color: #2E4A3A; background: white; outline: none; box-sizing: border-box; transition: border-color 0.18s; }
  .pb-input:focus { border-color: #3D6B52; }
  .pb-input::placeholder { color: #888780; }
  .pb-textarea { width: 100%; padding: 14px; border: 1.5px solid #D3D1C7; border-radius: 10px; font-family: "DM Sans", sans-serif; font-size: 15px; color: #2E4A3A; background: white; outline: none; box-sizing: border-box; transition: border-color 0.18s; resize: none; min-height: 88px; }
  .pb-textarea:focus { border-color: #3D6B52; }
  .pb-textarea::placeholder { color: #888780; }
  .pb-field { margin-bottom: 24px; }
  .pb-section { font-size: 14px; font-weight: 500; color: #2E4A3A; margin: 0 0 10px; }
  .pb-chips { display: flex; flex-wrap: wrap; gap: 8px; }
  .pb-chip { padding: 9px 16px; border: 1.5px solid #D3D1C7; border-radius: 999px; font-size: 14px; color: #2E4A3A; cursor: pointer; background: white; font-family: "DM Sans", sans-serif; transition: border-color 0.18s, background 0.18s; }
  .pb-chip:hover { border-color: #3D6B52; }
  .pb-chip.sel { border-color: #3D6B52; background: rgba(61,107,82,0.08); font-weight: 500; }
  .pb-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .pb-card { padding: 18px 16px; border: 1.5px solid #D3D1C7; border-radius: 12px; cursor: pointer; background: white; text-align: left; font-family: "DM Sans", sans-serif; transition: border-color 0.18s, background 0.18s; width: 100%; }
  .pb-card:hover { border-color: #3D6B52; }
  .pb-card.sel { border: 2px solid #3D6B52; background: rgba(61,107,82,0.07); }
  .pb-card-title { font-size: 14px; font-weight: 500; color: #2E4A3A; margin-bottom: 4px; }
  .pb-card-desc { font-size: 12px; color: #888780; line-height: 1.4; }
  .pb-previews { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; }
  .pb-thumb { position: relative; width: 88px; height: 88px; border-radius: 10px; overflow: hidden; border: 1.5px solid #D3D1C7; }
  .pb-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .pb-thumb-del { position: absolute; top: 4px; right: 4px; width: 20px; height: 20px; border-radius: 50%; background: rgba(0,0,0,0.55); border: none; color: white; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; line-height: 1; padding: 0; }
  .pb-upload-zone { border: 2px dashed #B8612A; border-radius: 14px; padding: 28px 20px; text-align: center; cursor: pointer; background: #F5EFE4; transition: border-color 0.18s, background 0.18s; }
  .pb-upload-zone:hover { background: #fdf9f5; }
  .pb-upload-text { font-size: 14px; color: #2E4A3A; font-weight: 500; }
  .pb-upload-hint { font-size: 12px; color: #888780; margin-top: 4px; }
  .pb-foot { position: fixed; bottom: 0; left: 0; right: 0; background: #F5EFE4; border-top: 1px solid #D3D1C7; z-index: 50; }
  .pb-foot-inner { max-width: 560px; margin: 0 auto; padding: 16px 24px 24px; }
  .pb-prev-link { display: block; background: none; border: none; color: #888780; font-size: 14px; font-family: "DM Sans", sans-serif; cursor: pointer; padding: 0; margin-bottom: 12px; text-align: left; }
  .pb-prev-link:hover { color: #2E4A3A; }
  .pb-cta { display: block; width: 100%; padding: 17px 24px; background: #B8612A; color: white; border: none; border-radius: 999px; font-family: "DM Sans", sans-serif; font-size: 16px; font-weight: 500; cursor: pointer; text-align: center; transition: opacity 0.18s, transform 0.15s; box-shadow: 0 4px 20px rgba(184,97,42,0.25); }
  .pb-cta:disabled { background: #D3D1C7; color: #888780; cursor: not-allowed; box-shadow: none; }
  .pb-cta:not(:disabled):hover { opacity: 0.9; transform: translateY(-1px); }
  .pb-error { font-size: 13px; color: #c0392b; margin-top: 8px; }
  @media (max-width: 480px) { .pb-cards { grid-template-columns: 1fr; } }
`

function BriefForm() {
  const searchParams = useSearchParams()

  // Session
  const [loading, setLoading] = useState(true)
  const [sessionError, setSessionError] = useState('')
  const [email, setEmail] = useState('')
  const [roomsCount, setRoomsCount] = useState(1)
  const [sessionId, setSessionId] = useState('')

  // Navigation
  const [step, setStep] = useState(1)
  const [roomIndex, setRoomIndex] = useState(0)

  // Step 1
  const [prenom, setPrenom] = useState('')
  const [telephone, setTelephone] = useState('')
  const [projet, setProjet] = useState('')

  // Step 2
  const [profileLoading, setProfileLoading] = useState(false)
  const [styleProfile, setStyleProfile] = useState(undefined)
  const [styleChoice, setStyleChoice] = useState('')
  const [styleCorrections, setStyleCorrections] = useState('')
  const [ambiances, setAmbiances] = useState([])
  const [couleurs, setCouleurs] = useState('')
  const [inspiUrl, setInspiUrl] = useState('')
  const [inspiFiles, setInspiFiles] = useState([])
  const [inspiPreviews, setInspiPreviews] = useState([])
  const [inspiUrls, setInspiUrls] = useState([])

  // Step 3
  const [doneRooms, setDoneRooms] = useState([])
  const [roomType, setRoomType] = useState('')
  const [roomFiles, setRoomFiles] = useState([])
  const [roomPreviews, setRoomPreviews] = useState([])
  const [roomApproache, setRoomApproache] = useState('')
  const [roomGarder, setRoomGarder] = useState('')
  const [roomProbleme, setRoomProbleme] = useState('')
  const [roomSentiment, setRoomSentiment] = useState('')
  const [roomBudget, setRoomBudget] = useState('')
  const [roomContraintes, setRoomContraintes] = useState('')

  // UI
  const [uploading, setUploading] = useState(false)
  const [uploadErr, setUploadErr] = useState('')
  const [submitErr, setSubmitErr] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const roomFileRef = useRef(null)
  const inspiFileRef = useRef(null)
  const pixelFired = useRef(false)
  const { consent } = useConsent()
  const [pixelData, setPixelData] = useState(null)

  const totalSteps = 2 + roomsCount
  const currentDisplayStep = step < 3 ? step : 2 + roomIndex + 1
  const hasProfile = !!(styleProfile && styleProfile.style_name)

  const step1OK = prenom.trim().length > 0 && projet.trim().length > 0
  const step2OK = hasProfile
    ? (styleChoice === 'yes' || (styleChoice === 'no' && styleCorrections.trim().length > 0))
    : (ambiances.length > 0 && couleurs.trim().length > 0 && (inspiUrl.trim().length > 0 || inspiFiles.length > 0))
  const roomOK = !!roomType && roomFiles.length >= 3 && !!roomApproache && roomProbleme.trim().length > 0 && roomSentiment.trim().length > 0 && !!roomBudget

  useEffect(() => {
    const sid = searchParams.get('session_id')
    if (!sid) {
      setSessionError('Lien invalide. Vérifiez votre email de confirmation.')
      setLoading(false)
      return
    }
    setSessionId(sid)
    fetch(`/api/premium/session?session_id=${encodeURIComponent(sid)}`)
      .then(r => r.json())
      .then(({ email: e, rooms_count: rc, meta_event_id: metaEventId, meta_value: metaValue, error: err }) => {
        if (err) throw new Error(err)
        setEmail(e || '')
        const rooms = Number(rc) || 1
        setRoomsCount(rooms)
        setLoading(false)
        const guardKey = `plausible_premium_purchased_${sid}`
        if (!sessionStorage.getItem(guardKey)) {
          const revenue = OFFERS.surmesure.stripePerPiece + (rooms - 1) * OFFERS.surmesure.stripePerPieceExtra
          track('Premium Purchased', { rooms_count: rooms }, revenue)
          sessionStorage.setItem(guardKey, '1')
        }
        if (metaEventId) {
          setPixelData({ eventId: metaEventId, value: metaValue, rooms })
        }
      })
      .catch(() => {
        setSessionError('Session introuvable. Contactez hello@studiokova.fr si le problème persiste.')
        setLoading(false)
      })
  }, [])

  // Fire Purchase pixel when both pixelData is set AND consent is accepted
  useEffect(() => {
    if (!pixelData || consent !== 'accepted' || pixelFired.current) return
    if (typeof window.fbq !== 'function') return
    pixelFired.current = true
    window.fbq('track', 'Purchase', {
      value: pixelData.value,
      currency: 'EUR',
      content_name: 'Sur-Mesure Studio Kova',
      content_category: 'sur-mesure',
      content_ids: [`surmesure_${pixelData.value}`],
      num_items: pixelData.rooms,
      ...getStoredUtms(),
    }, { eventID: pixelData.eventId })
  }, [pixelData, consent]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (step !== 2 || !email || styleProfile !== undefined) return
    setProfileLoading(true)
    fetch(`/api/profile?email=${encodeURIComponent(email)}`)
      .then(r => r.json())
      .then(({ profile }) => { setStyleProfile(profile || null); setProfileLoading(false) })
      .catch(() => { setStyleProfile(null); setProfileLoading(false) })
  }, [step, email, styleProfile])

  function scrollTop() { window.scrollTo({ top: 0, behavior: 'instant' }) }

  function addRoomFiles(files) {
    const arr = Array.from(files).slice(0, 6 - roomFiles.length)
    if (!arr.length) return
    setRoomFiles(p => [...p, ...arr])
    setRoomPreviews(p => [...p, ...arr.map(f => URL.createObjectURL(f))])
  }

  function removeRoomFile(i) {
    URL.revokeObjectURL(roomPreviews[i])
    setRoomFiles(p => p.filter((_, j) => j !== i))
    setRoomPreviews(p => p.filter((_, j) => j !== i))
  }

  function addInspiFiles(files) {
    const arr = Array.from(files).slice(0, 5 - inspiFiles.length)
    if (!arr.length) return
    setInspiFiles(p => [...p, ...arr])
    setInspiPreviews(p => [...p, ...arr.map(f => URL.createObjectURL(f))])
  }

  function removeInspiFile(i) {
    URL.revokeObjectURL(inspiPreviews[i])
    setInspiFiles(p => p.filter((_, j) => j !== i))
    setInspiPreviews(p => p.filter((_, j) => j !== i))
  }

  function toggleAmbiance(label) {
    setAmbiances(prev =>
      prev.includes(label)
        ? prev.filter(x => x !== label)
        : prev.length >= 3 ? [...prev.slice(1), label] : [...prev, label]
    )
  }

  function goPrev() {
    scrollTop()
    if (step === 2) setStep(1)
    else if (step === 3 && roomIndex === 0) setStep(2)
  }

  async function handleStep2Next() {
    if (!step2OK || uploading) return
    if (inspiFiles.length > 0) {
      setUploading(true)
      setUploadErr('')
      try {
        const fd = new FormData()
        inspiFiles.forEach(f => fd.append('files', f))
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const { urls, error } = await res.json()
        if (error || !urls) throw new Error(error || 'Upload échoué')
        setInspiUrls(urls)
      } catch {
        setUploadErr("Erreur lors de l'envoi des photos. Réessayez.")
        setUploading(false)
        return
      }
      setUploading(false)
    }
    track('Premium Brief Step Completed', { step_name: 'style' })
    scrollTop()
    setStep(3)
  }

  async function handleRoomNext() {
    if (!roomOK || uploading || submitting) return
    setUploading(true)
    setUploadErr('')
    let photoUrls = []
    try {
      const fd = new FormData()
      roomFiles.forEach(f => fd.append('files', f))
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const { urls, error } = await res.json()
      if (error || !urls) throw new Error(error || 'Upload échoué')
      photoUrls = urls
    } catch {
      setUploadErr("Erreur lors de l'envoi des photos. Réessayez.")
      setUploading(false)
      return
    }
    setUploading(false)

    const room = {
      type_piece: roomType, photos: photoUrls, approche: roomApproache,
      garder: roomGarder, probleme: roomProbleme, sentiment: roomSentiment,
      budget: roomBudget, contraintes: roomContraintes || null,
    }
    const allRooms = [...doneRooms, room]
    track('Premium Brief Step Completed', { step_name: `room_${roomIndex + 1}` })

    if (roomIndex + 1 < roomsCount) {
      setDoneRooms(allRooms)
      setRoomIndex(i => i + 1)
      resetRoom()
      scrollTop()
    } else {
      await submitBrief(allRooms)
    }
  }

  function resetRoom() {
    roomPreviews.forEach(u => URL.revokeObjectURL(u))
    setRoomType('')
    setRoomFiles([])
    setRoomPreviews([])
    setRoomApproache('')
    setRoomGarder('')
    setRoomProbleme('')
    setRoomSentiment('')
    setRoomBudget('')
    setRoomContraintes('')
  }

  async function submitBrief(allRooms) {
    setSubmitting(true)
    setSubmitErr('')
    const payload = {
      session_id: sessionId,
      email,
      rooms_count: roomsCount,
      prenom: prenom.trim(),
      telephone: telephone.trim() || null,
      projet_phrase: projet.trim(),
      style_validation: hasProfile ? (styleChoice === 'yes' ? 'confirmed' : 'partial') : 'no_profile',
      style_profile_snap: styleProfile ?? null,
      style_corrections: styleChoice === 'no' ? styleCorrections.trim() : null,
      style_inputs: !hasProfile
        ? { ambiance: ambiances, couleurs: couleurs.trim(), inspirations_url: inspiUrl.trim() || null, inspirations_photos: inspiUrls }
        : null,
      rooms: allRooms,
    }
    try {
      const res = await fetch('/api/premium/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const { error } = await res.json()
      if (error) throw new Error(error)
      track('Premium Brief Submitted', { rooms_count: roomsCount })
      window.location.href = '/premium/merci'
    } catch {
      setSubmitErr("Erreur lors de l'envoi. Réessayez ou contactez hello@studiokova.fr")
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#F5EFE4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: '"DM Sans", sans-serif', color: '#888780', fontSize: 15 }}>Chargement en cours…</p>
      </div>
    )
  }

  if (sessionError) {
    return (
      <div style={{ minHeight: '100vh', background: '#F5EFE4', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 400, textAlign: 'center' }}>
          <KovaAlert type="error" message={sessionError} />
          <p style={{ marginTop: 16, fontFamily: '"DM Sans", sans-serif', color: '#888780', fontSize: 13 }}>
            Une question ?{' '}
            <a href="mailto:hello@studiokova.fr" style={{ color: '#B8612A' }}>hello@studiokova.fr</a>
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{CSS}</style>
      <KovaStepShell offerLabel="JE CONFIE MON INTÉRIEUR" currentStep={currentDisplayStep} totalSteps={totalSteps}>

        {/* ─── ÉTAPE 1 : Vous ─── */}
        {step === 1 && (
          <div className="pb-wrap">
            <h1 className="pb-title">On commence par vous</h1>
            <p className="pb-sub">Trois infos rapides pour vous identifier.</p>

            <div className="pb-field">
              <label className="pb-label">Prénom</label>
              <input
                className="pb-input"
                type="text"
                placeholder="Marie"
                value={prenom}
                onChange={e => setPrenom(e.target.value)}
              />
            </div>

            <div className="pb-field">
              <label className="pb-label">
                Téléphone{' '}
                <span style={{ fontWeight: 400, color: '#888780' }}>(facultatif)</span>
              </label>
              <input
                className="pb-input"
                type="tel"
                placeholder="06 12 34 56 78"
                value={telephone}
                onChange={e => setTelephone(e.target.value)}
              />
            </div>

            <div className="pb-field">
              <label className="pb-label">Votre projet en une phrase</label>
              <textarea
                className="pb-textarea"
                placeholder="Ex : Je veux que mon salon ressemble enfin à quelque chose, sans tout racheter."
                value={projet}
                onChange={e => setProjet(e.target.value)}
              />
              <p className="pb-hint">Si vous deviez résumer ce que vous attendez de moi, ce serait quoi ?</p>
            </div>
          </div>
        )}

        {/* ─── ÉTAPE 2 : Votre style ─── */}
        {step === 2 && (
          <div className="pb-wrap">
            <h1 className="pb-title">Votre style</h1>

            {profileLoading && <p className="pb-sub">Vérification de votre profil…</p>}

            {!profileLoading && hasProfile && (
              <>
                <div style={{ marginBottom: 20 }}>
                  <KovaAlert
                    type="info"
                    message={`J'ai retrouvé votre profil style : ${styleProfile.style_name}. Est-ce que ça vous correspond toujours ?`}
                  />
                </div>

                <div className="pb-cards">
                  <button className={`pb-card${styleChoice === 'yes' ? ' sel' : ''}`} onClick={() => setStyleChoice('yes')}>
                    <div className="pb-card-title">Oui, c'est moi</div>
                    <div className="pb-card-desc">Ce profil me correspond encore</div>
                  </button>
                  <button className={`pb-card${styleChoice === 'no' ? ' sel' : ''}`} onClick={() => setStyleChoice('no')}>
                    <div className="pb-card-title">Pas tout à fait</div>
                    <div className="pb-card-desc">Quelque chose a changé</div>
                  </button>
                </div>

                {styleChoice === 'no' && (
                  <div className="pb-field" style={{ marginTop: 16 }}>
                    <label className="pb-label">Qu'est-ce qui a changé ou qui ne colle pas ?</label>
                    <textarea
                      className="pb-textarea"
                      placeholder="Soyez directe, je préfère."
                      value={styleCorrections}
                      onChange={e => setStyleCorrections(e.target.value)}
                    />
                  </div>
                )}
              </>
            )}

            {!profileLoading && !hasProfile && (
              <>
                <p className="pb-sub">Trois questions rapides pour cadrer votre univers.</p>

                <div className="pb-field">
                  <p className="pb-section">Ambiance recherchée</p>
                  <div className="pb-chips">
                    {AMBIANCES.map(a => (
                      <button
                        key={a}
                        className={`pb-chip${ambiances.includes(a) ? ' sel' : ''}`}
                        onClick={() => toggleAmbiance(a)}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                  <p className="pb-hint">Choisissez 3 mots maximum.</p>
                </div>

                <div className="pb-field">
                  <label className="pb-label">Couleurs que vous aimez, couleurs que vous ne supportez pas</label>
                  <textarea
                    className="pb-textarea"
                    placeholder="Ex : J'adore le bleu nuit et les bois clairs. Je déteste le gris froid et le rose."
                    value={couleurs}
                    onChange={e => setCouleurs(e.target.value)}
                  />
                </div>

                <div className="pb-field">
                  <label className="pb-label">Vos inspirations</label>
                  <p className="pb-hint" style={{ marginTop: 0, marginBottom: 12 }}>Un lien Pinterest, ou 3 photos qui vous font vibrer.</p>

                  <input
                    className="pb-input"
                    type="url"
                    placeholder="https://pinterest.com/..."
                    value={inspiUrl}
                    onChange={e => setInspiUrl(e.target.value)}
                    style={{ marginBottom: 12 }}
                  />

                  {inspiPreviews.length > 0 && (
                    <div className="pb-previews">
                      {inspiPreviews.map((url, i) => (
                        <div key={i} className="pb-thumb">
                          <img src={url} alt={`Inspiration ${i + 1}`} />
                          <button className="pb-thumb-del" onClick={() => removeInspiFile(i)} aria-label="Supprimer">×</button>
                        </div>
                      ))}
                    </div>
                  )}

                  {inspiFiles.length < 5 && (
                    <div
                      className="pb-upload-zone"
                      onClick={() => inspiFileRef.current?.click()}
                      onDragOver={e => e.preventDefault()}
                      onDrop={e => { e.preventDefault(); addInspiFiles(e.dataTransfer.files) }}
                    >
                      <div className="pb-upload-text">
                        {inspiFiles.length > 0 ? 'Ajouter une autre photo' : 'Ajouter des photos'}
                      </div>
                      <div className="pb-upload-hint">JPG, PNG ou WebP · 5 Mo max</div>
                      <input
                        ref={inspiFileRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        style={{ display: 'none' }}
                        onChange={e => e.target.files && addInspiFiles(e.target.files)}
                      />
                    </div>
                  )}
                </div>

                {uploadErr && <p className="pb-error">{uploadErr}</p>}
              </>
            )}
          </div>
        )}

        {/* ─── ÉTAPE 3 : Vos pièces ─── */}
        {step === 3 && (
          <div className="pb-wrap">
            <div className="pb-badge">Pièce {roomIndex + 1} sur {roomsCount}</div>
            <h1 className="pb-title">Parlez-moi de cette pièce</h1>

            <div className="pb-field">
              <p className="pb-section">Type de pièce</p>
              <div className="pb-chips">
                {ROOM_TYPES.map(t => (
                  <button key={t} className={`pb-chip${roomType === t ? ' sel' : ''}`} onClick={() => setRoomType(t)}>{t}</button>
                ))}
              </div>
            </div>

            <div className="pb-field">
              <p className="pb-section">Photos</p>
              <p className="pb-hint" style={{ marginTop: 0, marginBottom: 12 }}>
                Une vue d'ensemble, et une photo de chaque mur si possible. Lumière naturelle, sans personne dans le cadre.
              </p>

              {roomPreviews.length > 0 && (
                <div className="pb-previews">
                  {roomPreviews.map((url, i) => (
                    <div key={i} className="pb-thumb">
                      <img src={url} alt={`Photo ${i + 1}`} />
                      <button className="pb-thumb-del" onClick={() => removeRoomFile(i)} aria-label="Supprimer">×</button>
                    </div>
                  ))}
                </div>
              )}

              {roomFiles.length < 6 && (
                <div
                  className="pb-upload-zone"
                  onClick={() => roomFileRef.current?.click()}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => { e.preventDefault(); addRoomFiles(e.dataTransfer.files) }}
                >
                  <div className="pb-upload-text">
                    {roomFiles.length === 0
                      ? 'Ajouter des photos'
                      : roomFiles.length < 3
                        ? `${roomFiles.length} photo${roomFiles.length > 1 ? 's' : ''} — encore ${3 - roomFiles.length} minimum`
                        : 'Ajouter une autre photo'}
                  </div>
                  <div className="pb-upload-hint">3 à 6 photos · JPG, PNG ou WebP · 5 Mo max</div>
                  <input
                    ref={roomFileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    style={{ display: 'none' }}
                    onChange={e => e.target.files && addRoomFiles(e.target.files)}
                  />
                </div>
              )}
            </div>

            <div className="pb-field">
              <p className="pb-section">Votre approche</p>
              <div className="pb-cards">
                <button className={`pb-card${roomApproache === 'ameliorer' ? ' sel' : ''}`} onClick={() => setRoomApproache('ameliorer')}>
                  <div className="pb-card-title">Améliorer l'existant</div>
                  <div className="pb-card-desc">Je garde mes meubles principaux</div>
                </button>
                <button className={`pb-card${roomApproache === 'repartir' ? ' sel' : ''}`} onClick={() => setRoomApproache('repartir')}>
                  <div className="pb-card-title">Repartir de zéro</div>
                  <div className="pb-card-desc">Je veux tout repenser</div>
                </button>
              </div>
            </div>

            {roomApproache === 'ameliorer' && (
              <div className="pb-field" style={{ marginTop: 16 }}>
                <label className="pb-label">Qu'est-ce que vous gardez ?</label>
                <textarea
                  className="pb-textarea"
                  placeholder="Ex : le canapé gris, la bibliothèque en chêne, les rideaux beiges."
                  value={roomGarder}
                  onChange={e => setRoomGarder(e.target.value)}
                />
              </div>
            )}

            <div className="pb-field">
              <label className="pb-label">Ce qui vous dérange le plus</label>
              <textarea
                className="pb-textarea"
                placeholder="Soyez honnête, c'est ce qui guide tout le reste."
                value={roomProbleme}
                onChange={e => setRoomProbleme(e.target.value)}
              />
            </div>

            <div className="pb-field">
              <label className="pb-label">Comment vous voulez vous sentir dans cette pièce</label>
              <input
                className="pb-input"
                type="text"
                maxLength={100}
                placeholder="Ex : apaisée, comme dans un cocon."
                value={roomSentiment}
                onChange={e => setRoomSentiment(e.target.value)}
              />
            </div>

            <div className="pb-field">
              <p className="pb-section">Budget pour cette pièce</p>
              <div className="pb-chips">
                {BUDGETS.map(b => (
                  <button key={b} className={`pb-chip${roomBudget === b ? ' sel' : ''}`} onClick={() => setRoomBudget(b)}>{b}</button>
                ))}
              </div>
            </div>

            <div className="pb-field">
              <label className="pb-label">
                Contraintes pratiques{' '}
                <span style={{ fontWeight: 400, color: '#888780' }}>(facultatif)</span>
              </label>
              <textarea
                className="pb-textarea"
                placeholder="Ex : locataire donc pas de peinture, prise mal placée, mur porteur à ne pas toucher."
                value={roomContraintes}
                onChange={e => setRoomContraintes(e.target.value)}
              />
            </div>

            {uploadErr && <p className="pb-error">{uploadErr}</p>}
            {submitErr && <p className="pb-error">{submitErr}</p>}
          </div>
        )}

        {/* ─── NAVIGATION FIXE ─── */}
        <div className="pb-foot">
          <div className="pb-foot-inner">
            {(step === 2 || (step === 3 && roomIndex === 0)) && (
              <button className="pb-prev-link" onClick={goPrev}>← Précédent</button>
            )}

            {step === 1 && (
              <button className="pb-cta" disabled={!step1OK} onClick={() => { if (step1OK) { track('Premium Brief Step Completed', { step_name: 'info' }); scrollTop(); setStep(2) } }}>
                Continuer →
              </button>
            )}
            {step === 2 && (
              <button className="pb-cta" disabled={!step2OK || profileLoading || uploading} onClick={handleStep2Next}>
                {uploading ? 'Envoi en cours…' : 'Continuer →'}
              </button>
            )}
            {step === 3 && (
              <button className="pb-cta" disabled={!roomOK || uploading || submitting} onClick={handleRoomNext}>
                {(uploading || submitting) ? 'Envoi en cours…' : roomIndex + 1 < roomsCount ? 'Pièce suivante →' : 'Envoyer mon brief →'}
              </button>
            )}
          </div>
        </div>
      </KovaStepShell>
      <KovaFooter />
    </>
  )
}

export default function PremiumBriefPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#F5EFE4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: '"DM Sans", sans-serif', color: '#888780', fontSize: 15 }}>Chargement en cours…</p>
      </div>
    }>
      <BriefForm />
    </Suspense>
  )
}
