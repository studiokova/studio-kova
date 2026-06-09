import PropTypes from 'prop-types';
import KovaHeading from '@/components/kova/KovaHeading';

export default function OffreDetail({ piece, dark = false, only = null }) {
  const label = piece ? `votre ${piece}` : 'votre pièce';

  const showSteps = only === null || only === 'steps';
  const showDeliverables = only === null || only === 'deliverables';

  // When only one section is rendered inside an already-styled parent, skip the
  // background/padding that offre-detail__section--dark normally self-applies.
  const deliverableClass = dark
    ? (only === 'deliverables' ? 'offre-detail__section--dark-inline' : 'offre-detail__section--dark')
    : 'offre-detail__section';

  // offre-detail--dark handles gap=0 between the two sibling sections; not needed for single renders.
  const outerClass = `offre-detail${dark && only === null ? ' offre-detail--dark' : ''}`;

  return (
    <div className={outerClass}>
      {showSteps && (
        <div className="offre-detail__section">
          <p className="kova-kicker">Comment ça marche</p>
          <ol className="offre-detail__steps">
            <li className="offre-detail__step">
              <span className="offre-detail__step-num">1</span>
              <span>Vous m&apos;envoyez les photos de votre pièce, votre budget et ce qui vous
              dérange aujourd&apos;hui.</span>
            </li>
            <li className="offre-detail__step">
              <span className="offre-detail__step-num">2</span>
              <span>J&apos;analyse votre pièce : une IA lit vos photos, je relis et j&apos;ajuste
              chaque recommandation avant de vous l&apos;envoyer.</span>
            </li>
            <li className="offre-detail__step">
              <span className="offre-detail__step-num">3</span>
              <span>Vous recevez votre plan sous 48h. On peut échanger par email pour
              l&apos;ajuster si besoin.</span>
            </li>
          </ol>
        </div>
      )}

      {showDeliverables && (
        <div className={deliverableClass}>
          <p className={`kova-kicker${dark ? ' kova-kicker--light' : ''}`}>Ce que vous recevez</p>
          <KovaHeading level="h2" className="kova-heading--nav" light={dark}>Ce que vous recevez, sous 48h</KovaHeading>
          <p className="offre-detail__body">
            Un PDF personnalisé d&apos;environ 5 pages, construit à partir de vos photos :
          </p>
          <ul className="kova-pt-points">
            <li className="kova-pt-point">
              <span className="kova-pt-point__check">✓</span>
              <span>Un diagnostic de {label}. Ce qui fonctionne, ce qui crée la gêne que vous
              ressentez, et pourquoi. Une lecture de vos photos, mur par mur.</span>
            </li>
            <li className="kova-pt-point">
              <span className="kova-pt-point__check">✓</span>
              <span>Trois directions au choix, du plus sobre au plus affirmé. Chacune avec sa
              palette précise (références exactes, couleurs à conserver) et ses actions
              prioritaires.</span>
            </li>
            <li className="kova-pt-point">
              <span className="kova-pt-point__check">✓</span>
              <span>Chaque action est chiffrée. Quoi faire, dans quel ordre, et combien ça coûte
              (fourchette par poste). Vous choisissez la direction qui vous parle, votre
              budget suit.</span>
            </li>
            <li className="kova-pt-point">
              <span className="kova-pt-point__check">✓</span>
              <span>Les matières à privilégier et à éviter, pour que vos achats restent cohérents.</span>
            </li>
          </ul>
          <p className="offre-detail__body">
            Vous repartez avec un plan que vous exécutez vous-même, à votre rythme, sans
            décorateur.
          </p>
          <p className="offre-detail__body">
            Et si l&apos;analyse ne vous parle pas, je vous rembourse. Vous me le dites dans
            les 14 jours, sans justification à fournir.
          </p>
        </div>
      )}
    </div>
  );
}

OffreDetail.propTypes = {
  piece: PropTypes.string,
  dark: PropTypes.bool,
  only: PropTypes.oneOf(['steps', 'deliverables']),
};
