"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import KovaStepShell from "@/components/kova/KovaStepShell";
import KovaNav from "@/components/kova/KovaNav";
import KovaHeading from "@/components/kova/KovaHeading";
import KovaText from "@/components/kova/KovaText";
import KovaButton from "@/components/kova/KovaButton";
import KovaFooter from "@/components/kova/KovaFooter";


const CSS = `
  .an-wrap { max-width: 560px; margin: 0 auto; padding: 24px 24px 120px; }
  .an-title { font-family: "Playfair Display", serif; font-style: italic; font-size: 28px; color: var(--sauge-fonce, #2E4A3A); margin-top: 24px; margin-bottom: 8px; line-height: 1.2; }
  .an-sub { font-size: 14px; color: var(--gris, #888780); line-height: 1.6; margin-bottom: 28px; }
  .an-label { font-size: 13px; font-weight: 500; color: var(--sauge-fonce, #2E4A3A); margin-bottom: 8px; display: block; }
  .an-hint { font-size: 12px; color: var(--gris, #888780); margin-top: 4px; }
  .an-input { width: 100%; padding: 14px; border: 1.5px solid var(--gris-clair, #D3D1C7); border-radius: 8px; font-family: "DM Sans", sans-serif; font-size: 15px; color: var(--sauge-fonce, #2E4A3A); background: white; outline: none; box-sizing: border-box; transition: border-color 0.18s; }
  .an-input:focus { border-color: var(--sauge-med, #3D6B52); }
  .an-input::placeholder { color: var(--gris, #888780); }
  .an-textarea { width: 100%; padding: 14px; border: 1.5px solid var(--gris-clair, #D3D1C7); border-radius: 8px; font-family: "DM Sans", sans-serif; font-size: 15px; color: var(--sauge-fonce, #2E4A3A); background: white; outline: none; box-sizing: border-box; transition: border-color 0.18s; resize: none; height: 120px; }
  .an-textarea:focus { border-color: var(--sauge-med, #3D6B52); }
  .an-textarea::placeholder { color: var(--gris, #888780); }
  .an-field { margin-bottom: 24px; }
  .an-section { font-size: 14px; font-weight: 500; color: var(--sauge-fonce, #2E4A3A); margin: 0 0 10px; }
  .an-recap-row { font-size: 14px; color: var(--sauge-fonce, #2E4A3A); line-height: 1.5; margin: 0; }
  .an-recap-muted { font-size: 13px; color: var(--gris, #888780); margin: 6px 0 0; }
  .an-recap-block { background: var(--craie, #F5EFE4); border: 1px solid var(--gris-clair, #D3D1C7); border-radius: 14px; padding: 16px; margin-bottom: 4px; }
  .an-foot { position: fixed; bottom: 0; left: 0; right: 0; background: var(--craie, #F5EFE4); border-top: 1px solid var(--gris-clair, #D3D1C7); z-index: 50; }
  .an-foot-inner { max-width: 560px; margin: 0 auto; padding: 16px 24px 24px; }
  .an-prev-link { display: block; background: none; border: none; color: var(--gris, #888780); font-size: 14px; font-family: "DM Sans", sans-serif; cursor: pointer; padding: 0; margin-bottom: 12px; text-align: left; }
  .an-prev-link:hover { color: var(--sauge-fonce, #2E4A3A); }
  .an-cta { display: block; width: 100%; padding: 17px 24px; background: var(--cuivre, #B8612A); color: white; border: none; border-radius: 999px; font-family: "DM Sans", sans-serif; font-size: 16px; font-weight: 500; cursor: pointer; text-align: center; transition: opacity 0.18s, transform 0.15s; box-shadow: 0 4px 20px rgba(184,97,42,0.25); }
  .an-cta:disabled { background: var(--gris-clair, #D3D1C7); color: var(--gris, #888780); cursor: not-allowed; box-shadow: none; }
  .an-cta:not(:disabled):hover { opacity: 0.9; transform: translateY(-1px); }
  .an-error { font-size: 13px; color: #c0392b; margin-top: 8px; }
  .an-success { max-width: 480px; margin: 80px auto; padding: 0 24px; text-align: center; }
  .an-success-icon { font-size: 36px; margin-bottom: 24px; color: var(--cuivre, #B8612A); }
`;

export default function ConfirmationContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [step, setStep] = useState(1);
  const [pieces, setPieces] = useState("");
  const [photosLink, setPhotosLink] = useState("");
  const [style, setStyle] = useState("");
  const [budget, setBudget] = useState("");
  const [status, setStatus] = useState(null);

  function goNext() {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setStep(s => s + 1);
  }

  function goPrev() {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setStep(s => s - 1);
  }

  async function handleSubmit() {
    setStatus("loading");
    try {
      const res = await fetch("/api/send-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, pieces, photosLink, style, budget }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <>
        <style>{CSS}</style>
        <KovaNav showBack backLabel="Accueil" backHref="/" />
        <div className="an-success">
          <div className="an-success-icon">✦</div>
          <KovaHeading level="h1">Votre commande<br /><em>est confirmée.</em></KovaHeading>
          <KovaText size="md" muted style={{ marginTop: '16px', marginBottom: '32px' }}>
            Votre brief a bien été envoyé. Je reviens vers vous sous 24h pour lancer votre projet.
          </KovaText>
          <KovaButton variant="dark" href="/" fullWidth>
            Retour à l&rsquo;accueil
          </KovaButton>
        </div>
        <KovaFooter />
      </>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      <KovaStepShell
        offerLabel="JE VOUS CONFIE MON INTÉRIEUR"
        currentStep={step}
        totalSteps={4}
      >
        {step === 1 && (
          <div className="an-wrap">
            <h1 className="an-title">Montrez-moi votre pièce</h1>
            <p className="an-sub">Indiquez la ou les pièces concernées et partagez un lien vers vos photos.</p>
            <div className="an-field">
              <label className="an-label" htmlFor="pieces">Pièce(s) concernée(s)</label>
              <input id="pieces" type="text" className="an-input" placeholder="ex : salon, chambre principale" value={pieces} onChange={e => setPieces(e.target.value)} />
            </div>
            <div className="an-field">
              <label className="an-label" htmlFor="photosLink">Lien vers vos photos</label>
              <input id="photosLink" type="text" className="an-input" placeholder="Google Drive, WeTransfer, Dropbox…" value={photosLink} onChange={e => setPhotosLink(e.target.value)} />
              <p className="an-hint">Partagez un lien ou envoyez vos photos en réponse à l&rsquo;email de confirmation.</p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="an-wrap">
            <h1 className="an-title">Votre style en une phrase</h1>
            <p className="an-sub">Pas de bonne ou mauvaise réponse — juste ce que vous ressentez quand vous imaginez votre pièce idéale.</p>
            <div className="an-field">
              <label className="an-label" htmlFor="style">Décrivez votre style</label>
              <textarea id="style" className="an-textarea" placeholder="ex : épuré et naturel, avec quelques touches de cuivre" value={style} onChange={e => setStyle(e.target.value)} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="an-wrap">
            <h1 className="an-title">Parlons budget</h1>
            <p className="an-sub">Cette information me permet d&rsquo;orienter mes sélections vers ce qui est réellement accessible pour vous.</p>
            <div className="an-field">
              <label className="an-label" htmlFor="budget">Budget pour les meubles</label>
              <input id="budget" type="text" className="an-input" placeholder="ex : 800–1 200€" value={budget} onChange={e => setBudget(e.target.value)} />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="an-wrap">
            <h1 className="an-title">Dernière étape</h1>
            <p className="an-sub">Vérifiez vos informations avant d&rsquo;envoyer votre brief.</p>
            <div className="an-field">
              <p className="an-section">Vos photos</p>
              <div className="an-recap-block">
                <p className="an-recap-row">{pieces}</p>
                {photosLink && <p className="an-recap-muted">{photosLink}</p>}
              </div>
            </div>
            <div className="an-field">
              <p className="an-section">Votre style</p>
              <div className="an-recap-block">
                <p className="an-recap-row">{style}</p>
              </div>
            </div>
            <div className="an-field">
              <p className="an-section">Votre budget</p>
              <div className="an-recap-block">
                <p className="an-recap-row">{budget}</p>
              </div>
            </div>
            {status === "error" && (
              <p className="an-error">Une erreur s&rsquo;est produite. Écrivez-nous à <a href="mailto:hello@studiokova.fr">hello@studiokova.fr</a>.</p>
            )}
          </div>
        )}

        <div className="an-foot">
          <div className="an-foot-inner">
            {step > 1 && <button className="an-prev-link" onClick={goPrev}>← Précédent</button>}
            {step < 4 && (
              <button className="an-cta" disabled={
                (step === 1 && !pieces.trim()) ||
                (step === 2 && !style.trim()) ||
                (step === 3 && !budget.trim())
              } onClick={goNext}>Continuer →</button>
            )}
            {step === 4 && (
              <button className="an-cta" disabled={status === "loading"} onClick={handleSubmit}>
                {status === "loading" ? "Envoi…" : "Envoyer mon brief →"}
              </button>
            )}
          </div>
        </div>
      </KovaStepShell>

      <KovaFooter />
    </>
  );
}
