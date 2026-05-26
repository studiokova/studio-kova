"use client";
import { useState, useEffect, useRef } from "react";
import KovaButton from "./KovaButton";
import { OFFERS } from "@/lib/config";
import { track, getSource } from "@/lib/plausible";
import { getStoredUtms } from "@/lib/utmTracking";

const BASE  = OFFERS.surmesure.stripePerPiece;
const EXTRA = OFFERS.surmesure.stripePerPieceExtra;

function calcTotal(n)  { return BASE + (n - 1) * EXTRA; }
function calcSaving(n) { return (n - 1) * (BASE - EXTRA); }
function calcDetail(n) { return n === 1 ? "" : `${BASE}€ + ${n - 1}×${EXTRA}€`; }

export default function PriceCalculator({ email = "hello@studiokova.fr" }) {
  const [count, setCount]       = useState(1);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [acceptLegal, setAcceptLegal] = useState(false);
  const isFirstRender = useRef(true);
  const sliderDebounce = useRef(null);

  const total  = calcTotal(count);
  const saving = calcSaving(count);

  useEffect(() => {
    track("Premium Page Viewed", { source: getSource() });
  }, []);

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    clearTimeout(sliderDebounce.current);
    sliderDebounce.current = setTimeout(() => {
      track("Premium Slider Used", { rooms_count: count });
    }, 800);
    return () => clearTimeout(sliderDebounce.current);
  }, [count]);

  async function handleCheckout() {
    track("Premium Checkout Started", { rooms_count: count }, total);
    setLoading(true);
    setError(null);
    try {
      const utms = getStoredUtms();
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rooms: count, utms }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      window.location.href = data.url;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <section className="kova-price-calc" id="tarifs">
      <div className="kova-price-calc__eyebrow">
        <span className="kova-badge kova-badge--eyebrow-light">Tarifs</span>
      </div>

      <h2 className="kova-price-calc__title">
        Combien de pièces<br />souhaitez-vous transformer&nbsp;?
      </h2>

      <p className="kova-price-calc__sub">
        Première pièce à {BASE}€, chaque pièce suivante à {EXTRA}€.
        Plus vous confiez, plus vous économisez.
      </p>

      <div className="kova-price-calc__grid">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            className={`kova-price-calc__btn${count === n ? " kova-price-calc__btn--active" : ""}`}
            onClick={() => setCount(n)}
          >
            {n}
          </button>
        ))}
      </div>

      <div className="kova-price-calc__box">
        <p className="kova-price-calc__detail">{calcDetail(count)}</p>
        <div className="kova-price-calc__row">
          <span className="kova-price-calc__result-label">Total estimé</span>
          <span className="kova-price-calc__total">{total.toLocaleString("fr-FR")}€</span>
        </div>
      </div>

      <div className={`kova-price-calc__saving${saving > 0 ? " kova-price-calc__saving--visible" : ""}`}>
        Vous économisez {saving > 0 ? saving.toLocaleString("fr-FR") : "0"}€ sur le tarif individuel
      </div>

      <div className="kova-price-calc__cta">
        <label className="kova-price-calc__consent">
          <input
            type="checkbox"
            checked={acceptLegal}
            onChange={e => setAcceptLegal(e.target.checked)}
          />
          <span className="kova-price-calc__consent-label">
            J&rsquo;accepte les{" "}
            <a href="/cgv" target="_blank" rel="noopener noreferrer">conditions générales de vente</a>
            {" "}et je demande que la prestation commence dès maintenant, en reconnaissant
            qu&rsquo;une fois le projet lancé je perds mon droit de rétractation de 14 jours.
          </span>
        </label>
        <KovaButton
          variant="primary"
          onClick={handleCheckout}
          disabled={loading || !acceptLegal}
          fullWidth
        >
          {loading ? "Redirection..." : `Démarrer mon projet - ${count} pièce${count > 1 ? "s" : ""} →`}
        </KovaButton>
        {error && <p className="kova-price-calc__error">{error}</p>}
        <p className="kova-price-calc__mail">
          Une question ? Écrivez-moi à{" "}
          <a href={`mailto:${email}?subject=Question%20sur%20l%27offre%20sur-mesure`}>
            {email}
          </a>
        </p>
      </div>
    </section>
  );
}
