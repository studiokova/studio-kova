'use client'

import { useState, useEffect, useCallback } from 'react'

export default function EnvoyerAnalysePage() {
  const [secret, setSecret] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [toasts, setToasts] = useState([])

  const fetchPending = useCallback(async (s) => {
    return fetch('/api/admin/pending-analyses', { headers: { 'x-admin-secret': s } })
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem('studiokova-admin-secret')
    if (!stored) { setLoading(false); return }
    fetchPending(stored).then(async (res) => {
      if (res.ok) {
        const { analyses: data } = await res.json()
        setSecret(stored)
        setAnalyses(data)
        setAuthenticated(true)
      }
      setLoading(false)
    })
  }, [fetchPending])

  const addToast = (message, type) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000)
  }

  async function handleLogin(e) {
    e.preventDefault()
    const res = await fetchPending(secret)
    if (res.ok) {
      const { analyses: data } = await res.json()
      localStorage.setItem('studiokova-admin-secret', secret)
      setAnalyses(data)
      setAuthenticated(true)
    } else {
      addToast('Mot de passe invalide', 'error')
    }
  }

  async function handleSend(analysis) {
    const res = await fetch('/api/admin/send-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
      body: JSON.stringify({ analysisId: analysis.id }),
    })
    if (res.ok) {
      addToast(`Envoyé à ${analysis.email} ✓`, 'success')
      setAnalyses(prev => prev.filter(a => a.id !== analysis.id))
    } else {
      const data = await res.json().catch(() => ({}))
      addToast(data.error || "Erreur lors de l'envoi", 'error')
    }
  }

  function handleLogout() {
    localStorage.removeItem('studiokova-admin-secret')
    setAuthenticated(false)
    setSecret('')
    setAnalyses([])
  }

  if (loading) return <div style={S.page}><p style={S.muted}>Chargement…</p></div>

  if (!authenticated) {
    return (
      <div style={S.page}>
        <div style={S.loginBox}>
          <h1 style={S.title}>Studio Kova</h1>
          <form onSubmit={handleLogin} style={S.form}>
            <input
              type="password"
              placeholder="Mot de passe admin"
              value={secret}
              onChange={e => setSecret(e.target.value)}
              style={S.input}
              autoFocus
            />
            <button type="submit" style={S.btnCuivre}>Valider</button>
          </form>
          {toasts.map(t => <Toast key={t.id} {...t} />)}
        </div>
      </div>
    )
  }

  return (
    <div style={S.page}>
      <header style={S.header}>
        <div>
          <h1 style={S.title}>Analyses à envoyer</h1>
          <p style={S.muted}>{analyses.length} en attente</p>
        </div>
        <button onClick={handleLogout} style={S.btnGhost}>Se déconnecter</button>
      </header>

      {analyses.length === 0
        ? <p style={{ ...S.muted, textAlign: 'center', marginTop: 48 }}>Aucune analyse en attente.</p>
        : <ul style={S.list}>
            {analyses.map(a => (
              <li key={a.id} style={S.card}>
                <div>
                  <p style={S.email}>{a.email}</p>
                  <p style={S.muted}>
                    {a.type_piece && `${a.type_piece} — `}
                    {new Date(a.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div style={S.actions}>
                  <a href={a.pdf_url} target="_blank" rel="noreferrer" style={S.btnOutline}>Voir le PDF</a>
                  <button onClick={() => handleSend(a)} style={S.btnCuivre}>Envoyer à la cliente</button>
                </div>
              </li>
            ))}
          </ul>
      }

      <div style={S.toastWrap}>
        {toasts.map(t => <Toast key={t.id} {...t} />)}
      </div>
    </div>
  )
}

function Toast({ message, type }) {
  return (
    <div style={{ ...S.toast, background: type === 'success' ? 'var(--sauge-med)' : '#c0392b' }}>
      {message}
    </div>
  )
}

const S = {
  page: { minHeight: '100vh', background: 'var(--craie)', padding: '32px 24px', fontFamily: 'DM Sans, sans-serif', color: 'var(--sauge-fonce)' },
  loginBox: { maxWidth: 400, margin: '80px auto' },
  title: { fontFamily: 'Playfair Display, serif', fontSize: '1.75rem', marginBottom: 24, color: 'var(--sauge-fonce)' },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  input: { padding: '10px 14px', borderRadius: 8, border: '1px solid var(--gris-clair)', fontSize: '1rem', fontFamily: 'DM Sans, sans-serif', outline: 'none' },
  btnCuivre: { padding: '10px 20px', borderRadius: 10, background: 'var(--cuivre)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.95rem', fontFamily: 'DM Sans, sans-serif' },
  btnOutline: { padding: '8px 16px', borderRadius: 10, background: 'transparent', color: 'var(--sauge-fonce)', border: '1.5px solid var(--sauge-fonce)', fontSize: '0.9rem', textDecoration: 'none', display: 'inline-block', fontFamily: 'DM Sans, sans-serif' },
  btnGhost: { padding: '8px 16px', borderRadius: 10, background: 'transparent', color: 'var(--gris)', border: '1px solid var(--gris-clair)', cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'DM Sans, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', maxWidth: 800, margin: '0 auto 32px', flexWrap: 'wrap', gap: 16 },
  list: { listStyle: 'none', padding: 0, margin: '0 auto', maxWidth: 800, display: 'flex', flexDirection: 'column', gap: 16 },
  card: { background: '#fff', borderRadius: 14, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 },
  email: { fontWeight: 600, fontSize: '1rem', margin: 0 },
  muted: { color: 'var(--gris)', fontSize: '0.875rem', margin: '4px 0 0' },
  actions: { display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' },
  toastWrap: { position: 'fixed', bottom: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 8 },
  toast: { padding: '12px 20px', borderRadius: 10, color: '#fff', fontSize: '0.9rem', fontFamily: 'DM Sans, sans-serif' },
}
