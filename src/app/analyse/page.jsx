'use client';
import { useState, useRef, useEffect } from 'react';
import { upload } from '@vercel/blob/client';
import { track, getSource } from '@/lib/plausible';
import KovaStepShell from '@/components/kova/KovaStepShell';
import KovaFooter from '@/components/kova/KovaFooter';
import { OFFERS } from '@/lib/config';
import { getStoredUtms } from '@/lib/utmTracking';

const ROOM_TYPES = ['Salon', 'Chambre', 'Bureau', 'Salle à manger', 'Entrée', 'Autre'];
const MAX_TOTAL_MB = 30;
const MB = 1024 * 1024;
const BUDGETS = ['Moins de 300€', '300–800€', '800–1 500€', 'Plus de 1 500€'];
const MOTIVATIONS = [
  "J'emménage",
  'Je veux redonner vie à cette pièce',
  "J'ai un achat important à faire",
  'Je ne sais pas par où commencer',
];
const AMBIANCES = [
  { label: 'Cosy et enveloppant',  desc: 'lumières douces, matières chaudes, refuge' },
  { label: 'Lumineux et aéré',     desc: 'blanc, bois clair, espace qui respire' },
  { label: 'Élégant et affirmé',   desc: 'couleurs profondes, matériaux nobles' },
  { label: 'Vivant et personnel',  desc: 'couleurs, plantes, objets qui racontent' },
  { label: 'Zen et épuré',         desc: "peu d'objets, palette neutre, calme visuel" },
];
const MATIERES = ['Bois naturel', 'Rotin', 'Lin', 'Velours', 'Laiton', 'Pierre', 'Céramique', 'Cuir'];
const CAS_USAGE_OPTIONS = [
  { value: 'surfaces', label: 'Refaire les surfaces',   desc: 'Peinture, papier peint, mur, moulures. Le mobilier reste.' },
  { value: 'deco',     label: 'Refaire la déco',        desc: 'Textiles, objets, luminaires, agencement. Murs et meubles restent.' },
  { value: 'tout',     label: 'Tout refaire / meubler', desc: 'Surfaces + mobilier.' },
];
const CAS_USAGE_LABELS = {
  surfaces: 'Refaire les surfaces',
  deco:     'Refaire la déco',
  tout:     'Tout refaire / meubler',
};
const PROFILE_PALETTES = {
  'Scandinave chaleureux': ['#E8E0D5', '#A89880', '#6B5D4F'],
  'Naturel affirmé':       ['#C4A882', '#8B6F47', '#E8D5B7'],
  'Japonais minimaliste':  ['#E8E4DC', '#C4B8A0', '#4A4A48'],
  'Contemporain sobre':    ['#E2E2E0', '#9B9B97', '#3D3D3A'],
  'Terracotta vivant':     ['#C4623A', '#E8A87C', '#F5EFE4'],
  'Vintage cuivré':        ['#B8612A', '#E8C97A', '#2E4A3A'],
  'Vert nature':           ['#3D6B52', '#6B9E7A', '#E8D5B7'],
  'Bleu nuit doux':        ['#2C4A6E', '#E8D5B7', '#8BA5C4'],
  'Rétro pop 70s':         ['#D4622A', '#E8C440', '#8B3A2A'],
  'Jungle urbaine':        ['#2E4A3A', '#8B6F47', '#C4623A'],
  'Coloré assumé':         ['#4A7CB5', '#E8C440', '#C4623A'],
  'Maximalist dopamine':   ['#C44B8A', '#4A7CB5', '#E8C440'],
};


const CSS = `
  .an-wrap { max-width: 560px; margin: 0 auto; padding: 24px 24px 120px; }
  .an-title { font-family: "Playfair Display", serif; font-style: italic; font-size: 28px; color: #2E4A3A; margin-top: 24px; margin-bottom: 8px; line-height: 1.2; }
  .an-sub { font-size: 14px; color: #888780; line-height: 1.6; margin-bottom: 28px; }

  .an-previews { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; }
  .an-thumb { position: relative; width: 88px; height: 88px; border-radius: 10px; overflow: hidden; border: 1.5px solid #D3D1C7; }
  .an-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .an-thumb-del { position: absolute; top: 4px; right: 4px; width: 20px; height: 20px; border-radius: 50%; background: rgba(0,0,0,0.55); border: none; color: white; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; line-height: 1; padding: 0; }

  .an-upload-zone { border: 2px dashed #B8612A; border-radius: 14px; padding: 28px 20px; text-align: center; cursor: pointer; background: #F5EFE4; transition: border-color 0.18s, background 0.18s; margin-bottom: 16px; }
  .an-upload-zone:hover { border-color: #B8612A; background: #fdf9f5; }
  .an-upload-zone.full { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
  .an-upload-icon { font-size: 26px; margin-bottom: 8px; }
  .an-upload-text { font-size: 14px; color: #2E4A3A; font-weight: 500; }
  .an-upload-hint { font-size: 12px; color: #888780; margin-top: 4px; }

  .an-info-dark { background: #2E4A3A; border-radius: 12px; padding: 20px; margin-bottom: 28px; font-size: 14px; color: #F5EFE4; line-height: 1.7; }
  .an-info-dark strong { font-weight: 600; }

  .an-label { font-size: 13px; font-weight: 500; color: #2E4A3A; margin-bottom: 8px; display: block; }
  .an-input { width: 100%; padding: 14px; border: 1.5px solid #D3D1C7; border-radius: 10px; font-family: "DM Sans", sans-serif; font-size: 15px; color: #2E4A3A; background: white; outline: none; box-sizing: border-box; transition: border-color 0.18s; }
  .an-input:focus { border-color: #3D6B52; }
  .an-input::placeholder { color: #888780; }
  .an-textarea { width: 100%; padding: 14px; border: 1.5px solid #D3D1C7; border-radius: 10px; font-family: "DM Sans", sans-serif; font-size: 15px; color: #2E4A3A; background: white; outline: none; box-sizing: border-box; transition: border-color 0.18s; resize: none; height: 80px; }
  .an-textarea:focus { border-color: #3D6B52; }
  .an-textarea::placeholder { color: #888780; }

  .an-chips { display: flex; flex-wrap: wrap; gap: 8px; }
  .an-chip { padding: 9px 16px; border: 1.5px solid #D3D1C7; border-radius: 999px; font-size: 14px; color: #2E4A3A; cursor: pointer; background: white; font-family: "DM Sans", sans-serif; transition: border-color 0.18s, background 0.18s; }
  .an-chip:hover { border-color: #3D6B52; }
  .an-chip.sel { border-color: #3D6B52; background: rgba(61,107,82,0.08); font-weight: 500; }

  .an-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .an-card { padding: 18px 16px; border: 1.5px solid #D3D1C7; border-radius: 12px; cursor: pointer; background: white; text-align: left; font-family: "DM Sans", sans-serif; transition: border-color 0.18s, background 0.18s; width: 100%; }
  .an-card:hover { border-color: #3D6B52; }
  .an-card.sel { border: 2px solid #3D6B52; background: rgba(61,107,82,0.07); }
  .an-card-title { font-size: 14px; font-weight: 500; color: #2E4A3A; margin-bottom: 4px; }
  .an-card-desc { font-size: 12px; color: #888780; line-height: 1.4; }

  .an-ambiance-chips { display: flex; flex-direction: column; gap: 10px; }
  .an-ambiance-chip { padding: 14px 16px; border: 1.5px solid #D3D1C7; border-radius: 12px; cursor: pointer; background: white; text-align: left; font-family: "DM Sans", sans-serif; transition: border-color 0.18s, background 0.18s; width: 100%; }
  .an-ambiance-chip:hover { border-color: #3D6B52; }
  .an-ambiance-chip.sel { border: 2px solid #3D6B52; background: rgba(61,107,82,0.07); }
  .an-ambiance-chip-label { font-size: 14px; font-weight: 500; color: #2E4A3A; }
  .an-ambiance-chip-desc { font-size: 12px; color: #888780; margin-top: 2px; }

  .an-swatches { display: flex; gap: 10px; margin-top: 14px; }
  .an-swatch { width: 36px; height: 36px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); }

  .an-section { font-size: 14px; font-weight: 500; color: #2E4A3A; margin: 0 0 10px; }
  .an-hint { font-size: 12px; color: #888780; font-weight: 400; margin-left: 6px; }
  .an-field { margin-bottom: 24px; }

  .an-recap-row { font-size: 14px; color: #2E4A3A; line-height: 1.5; margin: 0; }
  .an-livrables { background: #F5EFE4; border: 1px solid #D3D1C7; border-radius: 12px; padding: 16px; margin-bottom: 20px; }
  .an-livrables-dark { background: #2E4A3A; border: none; }
  .an-livrables-dark .an-section { color: #E8C97A; }
  .an-livrables-dark .an-livrable { color: #F5EFE4; }
  .an-livrables-dark .an-check { color: #E8C97A; }
  .an-livrable { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: #2E4A3A; padding: 5px 0; }
  .an-check { color: #B8612A; font-weight: 600; flex-shrink: 0; }
  .an-delai { font-size: 13px; color: #888780; text-align: center; margin-bottom: 8px; }
  .an-price { font-family: "Playfair Display", serif; font-size: 48px; color: #2E4A3A; text-align: center; margin-bottom: 20px; line-height: 1; }

  .an-foot { position: fixed; bottom: 0; left: 0; right: 0; background: #F5EFE4; border-top: 1px solid #D3D1C7; z-index: 50; }
  .an-foot-inner { max-width: 560px; margin: 0 auto; padding: 16px 24px 24px; }
  .an-prev-link { display: block; background: none; border: none; color: #888780; font-size: 14px; font-family: "DM Sans", sans-serif; cursor: pointer; padding: 0; margin-bottom: 12px; text-align: left; }
  .an-prev-link:hover { color: #2E4A3A; }
  .an-cta { display: block; width: 100%; padding: 17px 24px; background: #B8612A; color: white; border: none; border-radius: 999px; font-family: "DM Sans", sans-serif; font-size: 16px; font-weight: 500; cursor: pointer; text-align: center; transition: opacity 0.18s, transform 0.15s; box-shadow: 0 4px 20px rgba(184,97,42,0.25); }
  .an-cta:disabled { background: #D3D1C7; color: #888780; cursor: not-allowed; box-shadow: none; }
  .an-cta:not(:disabled):hover { opacity: 0.9; transform: translateY(-1px); }

  .an-error { font-size: 13px; color: #c0392b; margin-top: 8px; }

  .an-weight { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .an-weight-track { flex: 1; height: 4px; background: #D3D1C7; border-radius: 2px; overflow: hidden; }
  .an-weight-fill { height: 100%; border-radius: 2px; background: #3D6B52; transition: width 0.25s; }
  .an-weight-fill.warn { background: #E8C97A; }
  .an-weight-fill.over { background: #c0392b; }
  .an-weight-label { font-size: 12px; color: #888780; white-space: nowrap; }
  .an-weight-label.over { color: #c0392b; font-weight: 500; }

  .an-consent { display: flex; flex-direction: column; gap: 12px; margin: 20px 0 8px; }
  .an-consent-row { display: flex; align-items: flex-start; gap: 10px; cursor: pointer; }
  .an-consent-row input[type="checkbox"] { flex-shrink: 0; margin-top: 3px; width: 18px; height: 18px; accent-color: #3D6B52; cursor: pointer; }
  .an-consent-label { font-size: 13px; color: #2E4A3A; line-height: 1.5; }
  .an-consent-label a { color: #B8612A; text-decoration: underline; }

  @media (max-width: 480px) {
    .an-cards { grid-template-columns: 1fr; }
  }
`;

export default function AnalysePage() {
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [email, setEmail] = useState('');
  const [styleProfile, setStyleProfile] = useState(undefined);
  const [roomContext, setRoomContext] = useState({
    type_piece: '', cas_usage: '', garder: '', contraintes: '', probleme: '', budget: '', motivation: '',
  });
  const [styleContext, setStyleContext] = useState({
    ambiance: [], couleur_aimee: '', couleur_evitee: '', matieres: [], demande_precise: '',
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [paying, setPaying] = useState(false);
  const [acceptLegal, setAcceptLegal] = useState(false);
  const fileInputRef = useRef(null);
  const styleModifiedRef = useRef(false);

  useEffect(() => {
    const piece = new URLSearchParams(window.location.search).get('piece') || '';
    track('Analysis Page Viewed', { source: getSource(), ...(piece && { piece }) });
  }, []);

  function goNext() {
    if (step === 1) {
      track('Analysis Room Completed', {
        room_type: roomContext.type_piece,
        budget_range: roomContext.budget,
        cas_usage: roomContext.cas_usage,
      });
    } else if (step === 2) {
      const styleSrc = !hasProfile ? 'manual' : styleModifiedRef.current ? 'quiz_adjusted' : 'quiz_kept';
      track('Analysis Style Completed', { style_source: styleSrc });
    } else if (step === 3) {
      track('Analysis Photos Completed', { photo_count: files.length, has_quiz_profile: hasProfile });
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    setStep(s => s + 1);
  }

  function goPrev() {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setStep(s => s - 1);
  }

  function addFiles(newFiles) {
    const arr = Array.from(newFiles);
    if (!arr.length) return;
    if (files.length === 0) track('Analysis Photo Added', { count: arr.length });
    const newPreviews = arr.map(f => URL.createObjectURL(f));
    setFiles(prev => [...prev, ...arr]);
    setPreviewUrls(prev => [...prev, ...newPreviews]);
  }

  function removeFile(i) {
    URL.revokeObjectURL(previewUrls[i]);
    setFiles(f => f.filter((_, idx) => idx !== i));
    setPreviewUrls(p => p.filter((_, idx) => idx !== i));
  }

  function handleDrop(e) {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  }

  async function checkProfile(emailVal) {
    if (!emailVal.includes('@')) return;
    track('Analysis Email Entered', { has_photos: files.length > 0 });
    try {
      const res = await fetch(`/api/profile?email=${encodeURIComponent(emailVal)}`);
      const data = await res.json();
      setStyleProfile(data.profile || null);
    } catch {
      setStyleProfile(null);
    }
  }

  async function handlePay() {
    setUploading(true);
    setUploadError('');
    setPaying(true);
    try {
      const blobs = await Promise.all(
        files.map(f => upload(f.name, f, { access: 'public', handleUploadUrl: '/api/upload' }))
      );
      const uploadedUrls = blobs.map(b => b.url);
      track('Analysis Photos Uploaded', { photo_count: files.length, has_quiz_profile: hasProfile });
      track('Analysis Checkout Started', undefined, OFFERS.analyse.amount);
      const utms = getStoredUtms();
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, photoUrls: uploadedUrls, roomContext, styleContext, styleProfile, utms }),
      });
      const { url, error } = await res.json();
      if (error) throw new Error(error);
      sessionStorage.setItem('analysis_room_type', roomContext.type_piece);
      window.location.href = url;
    } catch {
      track('Analysis Upload Error', { photo_count: files.length });
      setUploadError("Erreur lors de l'envoi, réessayez.");
      setPaying(false);
    } finally {
      setUploading(false);
    }
  }

  function setRoom(key, val) {
    setRoomContext(prev => ({ ...prev, [key]: val }));
  }

  function toggleAmbiance(label) {
    styleModifiedRef.current = true;
    setStyleContext(prev => {
      const cur = prev.ambiance;
      if (cur.includes(label)) return { ...prev, ambiance: cur.filter(x => x !== label) };
      if (cur.length >= 2) return { ...prev, ambiance: [cur[1], label] };
      return { ...prev, ambiance: [...cur, label] };
    });
  }

  function toggleMatiere(m) {
    styleModifiedRef.current = true;
    setStyleContext(prev => ({
      ...prev,
      matieres: prev.matieres.includes(m) ? prev.matieres.filter(x => x !== m) : [...prev.matieres, m],
    }));
  }

  const totalSizeMb = files.reduce((acc, f) => acc + f.size, 0) / MB;
  const overLimit = totalSizeMb > MAX_TOTAL_MB;
  const fillPct = Math.min(100, (totalSizeMb / MAX_TOTAL_MB) * 100);
  const fillClass = overLimit ? 'over' : fillPct > 80 ? 'warn' : '';

  const step1Ready = !!roomContext.cas_usage && !!roomContext.type_piece && !!roomContext.budget;
  const step2Ready = styleContext.ambiance.length >= 1;
  const step3Ready = files.length >= 1 && email.includes('@') && !overLimit;
  const step4Ready = acceptLegal;
  const hasProfile = !!(styleProfile && styleProfile.style_name);
  const swatches = hasProfile ? (PROFILE_PALETTES[styleProfile.style_name] || []) : [];

  return (
    <>
      <style>{CSS}</style>
      <KovaStepShell
        offerLabel="JE TRANSFORME MA PIÈCE"
        currentStep={step}
        totalSteps={4}
      >
        {/* ─── ÉTAPE 1 : Votre pièce ─── */}
        {step === 1 && (
          <div className="an-wrap">
            <h1 className="an-title">Parlez-moi de cette pièce</h1>
            <p className="an-sub">Ces informations me permettent de cadrer l'analyse.</p>

            <div className="an-field">
              <p className="an-section">Qu'est-ce que vous voulez faire ?</p>
              <div className="an-cards" style={{ gridTemplateColumns: '1fr' }}>
                {CAS_USAGE_OPTIONS.map(({ value, label, desc }) => (
                  <button
                    key={value}
                    className={`an-card${roomContext.cas_usage === value ? ' sel' : ''}`}
                    onClick={() => setRoom('cas_usage', value)}
                  >
                    <div className="an-card-title">{label}</div>
                    <div className="an-card-desc">{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="an-field">
              <p className="an-section">Quelle pièce ?</p>
              <div className="an-chips">
                {ROOM_TYPES.map(t => (
                  <button key={t} className={`an-chip${roomContext.type_piece === t ? ' sel' : ''}`} onClick={() => setRoom('type_piece', t)}>{t}</button>
                ))}
              </div>
            </div>

            <div className="an-field">
              <p className="an-section">Votre budget pour cette pièce</p>
              <div className="an-chips">
                {BUDGETS.map(b => (
                  <button key={b} className={`an-chip${roomContext.budget === b ? ' sel' : ''}`} onClick={() => setRoom('budget', b)}>{b}</button>
                ))}
              </div>
            </div>

            <div className="an-field">
              <p className="an-section">Pourquoi cette analyse maintenant ?</p>
              <div className="an-chips">
                {MOTIVATIONS.map(m => (
                  <button key={m} className={`an-chip${roomContext.motivation === m ? ' sel' : ''}`} onClick={() => setRoom('motivation', m)}>{m}</button>
                ))}
              </div>
            </div>

            <div className="an-field">
              <label className="an-label">Ce qui vous dérange le plus</label>
              <textarea className="an-textarea" placeholder="Ex : c'est sans personnalité, rien ne va ensemble, trop sombre..." value={roomContext.probleme} onChange={e => setRoom('probleme', e.target.value)} />
            </div>

            <div className="an-field">
              <label className="an-label">Ce que vous gardez</label>
              <textarea className="an-textarea" placeholder="Ex : mon canapé gris, ma bibliothèque, le parquet..." value={roomContext.garder} onChange={e => setRoom('garder', e.target.value)} />
            </div>

            <div className="an-field">
              <label className="an-label">Vos contraintes</label>
              <textarea className="an-textarea" placeholder="Ex : locataire, budget serré sur un poste, animaux..." value={roomContext.contraintes} onChange={e => setRoom('contraintes', e.target.value)} />
            </div>
          </div>
        )}

        {/* ─── ÉTAPE 2 : Votre style ─── */}
        {step === 2 && (
          <div className="an-wrap">
            <h1 className="an-title">Votre style pour cette pièce</h1>
            <p className="an-sub">Pas de bonne ou mauvaise réponse. Ce qui compte c'est ce que vous voulez, pas ce qui est tendance.</p>

            <div className="an-field">
              <p className="an-section">L'ambiance que vous voulez créer <span className="an-hint">(max 2)</span></p>
              <div className="an-ambiance-chips">
                {AMBIANCES.map(({ label, desc }) => (
                  <button
                    key={label}
                    className={`an-ambiance-chip${styleContext.ambiance.includes(label) ? ' sel' : ''}`}
                    onClick={() => toggleAmbiance(label)}
                  >
                    <div className="an-ambiance-chip-label">{label}</div>
                    <div className="an-ambiance-chip-desc">{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="an-field">
              <label className="an-label">Une couleur que vous aimez pour cette pièce</label>
              <input type="text" className="an-input" placeholder="Ex : le vert bouteille, le terracotta, le bleu nuit..." value={styleContext.couleur_aimee} onChange={e => { styleModifiedRef.current = true; setStyleContext(prev => ({ ...prev, couleur_aimee: e.target.value })); }} />
            </div>

            <div className="an-field">
              <label className="an-label">Une couleur que vous évitez absolument</label>
              <input type="text" className="an-input" placeholder="Ex : le beige, le gris froid, l'orange..." value={styleContext.couleur_evitee} onChange={e => { styleModifiedRef.current = true; setStyleContext(prev => ({ ...prev, couleur_evitee: e.target.value })); }} />
            </div>

            <div className="an-field">
              <p className="an-section">Les matières que vous aimez</p>
              <div className="an-chips">
                {MATIERES.map(m => (
                  <button key={m} className={`an-chip${styleContext.matieres.includes(m) ? ' sel' : ''}`} onClick={() => toggleMatiere(m)}>{m}</button>
                ))}
              </div>
            </div>

            <div className="an-field">
              <label className="an-label">Une demande précise, si vous en avez une</label>
              <textarea className="an-textarea" placeholder="Ex : je veux que la pièce paraisse plus grande, trouver un coin lecture..." value={styleContext.demande_precise} onChange={e => { styleModifiedRef.current = true; setStyleContext(prev => ({ ...prev, demande_precise: e.target.value })); }} />
            </div>
          </div>
        )}

        {/* ─── ÉTAPE 3 : Photos + Email ─── */}
        {step === 3 && (
          <div className="an-wrap">
            <h1 className="an-title">Montrez-moi votre pièce</h1>
            <p className="an-sub">Ajoutez autant de photos que nécessaire depuis des angles différents. Plus on voit la pièce, plus l'analyse sera précise.</p>

            {previewUrls.length > 0 && (
              <div className="an-previews">
                {previewUrls.map((url, i) => (
                  <div key={i} className="an-thumb">
                    <img src={url} alt={`Photo ${i + 1}`} />
                    <button className="an-thumb-del" onClick={() => removeFile(i)} aria-label="Supprimer">×</button>
                  </div>
                ))}
              </div>
            )}

            <div
              className="an-upload-zone"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={handleDrop}
            >
              <div className="an-upload-icon">📷</div>
              <div className="an-upload-text">
                {files.length > 0 ? 'Ajouter une autre photo' : 'Choisir mes photos'}
              </div>
              <div className="an-upload-hint">JPG, PNG ou WebP · 5 Mo max par photo · {MAX_TOTAL_MB} Mo total</div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                style={{ display: 'none' }}
                onChange={e => e.target.files && addFiles(e.target.files)}
              />
            </div>

            {files.length > 0 && (
              <div className="an-weight">
                <div className="an-weight-track">
                  <div className={`an-weight-fill${fillClass ? ' ' + fillClass : ''}`} style={{ width: `${fillPct}%` }} />
                </div>
                <span className={`an-weight-label${overLimit ? ' over' : ''}`}>
                  {totalSizeMb.toFixed(1).replace('.', ',')} Mo / {MAX_TOTAL_MB} Mo
                </span>
              </div>
            )}
            {overLimit && <p className="an-error">Total trop lourd. Supprimez des photos pour continuer.</p>}

            <div className="an-field">
              <label className="an-label">Votre email pour recevoir l'analyse</label>
              <input
                type="email"
                className="an-input"
                placeholder="votre@email.fr"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onBlur={e => checkProfile(e.target.value)}
              />
            </div>

            {hasProfile && (
              <div className="an-info-dark">
                <div>Votre profil <strong>{styleProfile.style_name}</strong> a été retrouvé.</div>
                <div>On l'utilise pour enrichir votre analyse.</div>
                {swatches.length > 0 && (
                  <div className="an-swatches">
                    {swatches.map(c => <div key={c} className="an-swatch" style={{ background: c }} />)}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ─── ÉTAPE 4 : Paiement ─── */}
        {step === 4 && (
          <div className="an-wrap">
            <h1 className="an-title">Plus qu&rsquo;une étape.</h1>
            <p className="an-sub">Votre analyse est prête à démarrer.</p>

            <div className="an-livrables an-livrables-dark">
              <p className="an-section">Ce que vous recevez, sous 48h</p>
              <p style={{ fontSize: 14, color: '#F5EFE4', margin: '4px 0 10px' }}>Un PDF personnalisé d&rsquo;environ 5 pages, construit à partir de vos photos :</p>
              <div className="an-livrable">
                <span className="an-check">✓</span>
                Un diagnostic de votre {roomContext.type_piece.toLowerCase()}. Ce qui fonctionne, ce qui crée la gêne que vous ressentez, et pourquoi. Une lecture de vos photos, mur par mur.
              </div>
              <div className="an-livrable">
                <span className="an-check">✓</span>
                Trois directions au choix, du plus sobre au plus affirmé. Chacune avec sa palette précise (références exactes, couleurs à conserver) et ses actions prioritaires.
              </div>
              <div className="an-livrable">
                <span className="an-check">✓</span>
                Chaque action est chiffrée. Quoi faire, dans quel ordre, et combien ça coûte (fourchette par poste). Vous choisissez la direction qui vous parle, votre budget suit.
              </div>
              <div className="an-livrable">
                <span className="an-check">✓</span>
                Les matières à privilégier et à éviter, pour que vos achats restent cohérents.
              </div>
              <p style={{ fontSize: 14, color: '#F5EFE4', margin: '10px 0 0' }}>Vous repartez avec un plan que vous exécutez vous-même, à votre rythme, sans décorateur.</p>
            </div>

            <p className="an-delai">Livraison sous 48h par email</p>
            <div className="an-price">{OFFERS.analyse.display}</div>

            <p className="an-delai" style={{ marginBottom: 20 }}>Si l&rsquo;analyse ne vous parle pas, je vous rembourse. Vous me le dites dans les 14 jours, sans justification à fournir.</p>

            <div className="an-consent">
              <label className="an-consent-row">
                <input
                  type="checkbox"
                  checked={acceptLegal}
                  onChange={e => setAcceptLegal(e.target.checked)}
                />
                <span className="an-consent-label">
                  J&rsquo;accepte les{" "}
                  <a href="/cgv" target="_blank" rel="noopener noreferrer">conditions générales de vente</a>
                  {" "}et je demande que mon analyse commence dès maintenant.
                </span>
              </label>
            </div>

            {uploadError && <p className="an-error">{uploadError}</p>}
          </div>
        )}

        {/* ─── BARRE DE NAVIGATION FIXE ─── */}
        <div className="an-foot">
          <div className="an-foot-inner">
            {step > 1 && <button className="an-prev-link" onClick={goPrev}>← Précédent</button>}
            {step === 1 && (
              <button className="an-cta" disabled={!step1Ready} onClick={goNext}>Continuer →</button>
            )}
            {step === 2 && (
              <button className="an-cta" disabled={!step2Ready} onClick={goNext}>Continuer →</button>
            )}
            {step === 3 && (
              <button className="an-cta" disabled={!step3Ready} onClick={goNext}>Continuer →</button>
            )}
            {step === 4 && (
              <button className="an-cta" disabled={!step4Ready || paying} onClick={handlePay}>
                {uploading ? 'Envoi en cours…' : paying ? 'Redirection…' : 'Payer et recevoir mon analyse →'}
              </button>
            )}
          </div>
        </div>
      </KovaStepShell>

      <KovaFooter />
    </>
  );
}
