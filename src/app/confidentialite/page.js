import KovaNav    from "@/components/kova/KovaNav";
import KovaFooter from "@/components/kova/KovaFooter";

export const metadata = {
  title: "Politique de confidentialité - Studio Kova",
};

export default function Confidentialite() {
  return (
    <>
      <KovaNav full />

      <div className="kova-legal">
        <h1>Politique de confidentialité</h1>
        <p className="kova-legal__date">Dernière mise à jour : 18 mai 2026</p>

        <div className="kova-legal__section">
          <h2>Qui suis-je</h2>
          <p>
            Studio Kova est un service de conseil en décoration d&rsquo;intérieur édité par
            Clémence Laurent, 41500 Mer, France.<br />
            Contact : hello@studiokova.fr<br />
            Je suis responsable du traitement de vos données personnelles au sens du RGPD.
          </p>
        </div>

        <div className="kova-legal__divider" />

        <div className="kova-legal__section">
          <h2>Données collectées</h2>
          <p>Selon les services que vous utilisez, je collecte les données suivantes :</p>
          <ul>
            <li>Votre adresse email (quiz de style et tunnel d&rsquo;analyse)</li>
            <li>Votre prénom, si vous le renseignez</li>
            <li>Vos réponses au quiz de style : ambiance cible, couleurs aimées, matières préférées, références visuelles</li>
            <li>La photo de votre pièce, uploadée pour l&rsquo;analyse 69&nbsp;€</li>
            <li>Le contexte de votre pièce : type de pièce, approche souhaitée, budget, ce qui vous dérange, objectif</li>
            <li>Le statut de votre consentement marketing et, le cas échéant, sa date</li>
            <li>Des données techniques (adresse IP, navigateur, pages visitées) collectées automatiquement par Vercel pour l&rsquo;hébergement</li>
          </ul>
          <p>
            Les données de paiement (numéro de carte, etc.) sont traitées directement par Stripe.
            Je n&rsquo;y ai jamais accès et ne les stocke pas.
          </p>
        </div>

        <div className="kova-legal__divider" />

        <div className="kova-legal__section">
          <h2>Finalités du traitement</h2>
          <p>Je traite vos données pour les raisons suivantes :</p>
          <ul>
            <li><strong>Livraison du quiz</strong> : envoyer par email votre palette personnalisée et votre profil de style</li>
            <li><strong>Livraison de l&rsquo;analyse</strong> : générer le PDF de recommandations et vous l&rsquo;envoyer par email</li>
            <li><strong>Paiement</strong> : traitement sécurisé de l&rsquo;offre analyse 69&nbsp;€ via Stripe</li>
            <li><strong>Emails marketing</strong> : conseils déco et informations sur les offres - uniquement si vous avez coché la case de consentement</li>
            <li><strong>Amélioration du service</strong> : analyse agrégée et anonymisée des profils et retours clients</li>
          </ul>
        </div>

        <div className="kova-legal__divider" />

        <div className="kova-legal__section">
          <h2>Base légale du traitement</h2>
          <ul>
            <li>
              <strong>Exécution du contrat</strong> (art. 6.1.b RGPD) : emails transactionnels
              (livraison palette, PDF) et traitement du paiement
            </li>
            <li>
              <strong>Consentement</strong> (art. 6.1.a RGPD) : emails marketing, recueilli via
              case à cocher non pré-cochée, retirable à tout moment
            </li>
            <li>
              <strong>Obligation légale</strong> (art. 6.1.c RGPD) : conservation des données
              comptables pendant 10 ans (gérées par Stripe)
            </li>
          </ul>
        </div>

        <div className="kova-legal__divider" />

        <div className="kova-legal__section">
          <h2>Sous-traitants</h2>
          <p>Je fais appel aux prestataires suivants, qui traitent des données en mon nom :</p>
          <table className="kova-legal__table">
            <thead>
              <tr>
                <th>Prestataire</th>
                <th>Données traitées</th>
                <th>Finalité</th>
                <th>Localisation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Supabase</td>
                <td>Email, profil style, métadonnées analyses</td>
                <td>Base de données</td>
                <td>UE / USA</td>
              </tr>
              <tr>
                <td>Vercel</td>
                <td>IP, navigation, photos temporaires</td>
                <td>Hébergement, stockage Blob</td>
                <td>USA / mondial</td>
              </tr>
              <tr>
                <td>Stripe</td>
                <td>Email, données de paiement</td>
                <td>Paiement analyse 69&nbsp;€</td>
                <td>USA / Irlande</td>
              </tr>
              <tr>
                <td>Anthropic</td>
                <td>Photo de pièce, profil style, contexte</td>
                <td>Analyse IA des photos</td>
                <td>USA</td>
              </tr>
              <tr>
                <td>Pexels</td>
                <td>Aucune donnée personnelle</td>
                <td>Photos de moodboard</td>
                <td>USA</td>
              </tr>
              <tr>
                <td>Brevo</td>
                <td>Email, prénom, consentement</td>
                <td>Envoi d&rsquo;emails</td>
                <td>France</td>
              </tr>
              <tr>
                <td>Meta (Facebook)</td>
                <td>Navigation, conversions (avec consentement)</td>
                <td>Mesure publicitaire</td>
                <td>USA / Irlande</td>
              </tr>
              <tr>
                <td>Pinterest</td>
                <td>Navigation, conversions (avec consentement)</td>
                <td>Mesure publicitaire</td>
                <td>USA</td>
              </tr>
            </tbody>
          </table>
          <p>
            Meta et Pinterest agissent en tant que responsables de traitement indépendants pour
            les données qu&rsquo;ils collectent via leurs pixels. Leurs politiques de confidentialité
            respectives s&rsquo;appliquent à ces traitements.
          </p>
        </div>

        <div className="kova-legal__divider" />

        <div className="kova-legal__section">
          <h2>Transferts hors Union européenne</h2>
          <p>
            Certains prestataires (Supabase, Vercel, Stripe, Anthropic, Pexels) peuvent
            traiter vos données aux États-Unis. Ces transferts sont encadrés par :
          </p>
          <ul>
            <li>
              Les <strong>Clauses Contractuelles Types (CCT)</strong> adoptées par la
              Commission européenne
            </li>
            <li>
              Le <strong>Data Privacy Framework (DPF)</strong> UE–États-Unis, pour les
              prestataires certifiés : Stripe, Anthropic et Vercel sont certifiés DPF
            </li>
          </ul>
        </div>

        <div className="kova-legal__divider" />

        <div className="kova-legal__section">
          <h2>Traitement des photos uploadées</h2>
          <p>
            Lorsque vous uploadez une photo de votre pièce pour l&rsquo;analyse, voici
            précisément ce qui se passe :
          </p>
          <ul>
            <li>La photo est stockée temporairement sur Vercel Blob</li>
            <li>
              Elle est transmise à Anthropic (Claude) uniquement pour générer votre
              analyse personnalisée
            </li>
            <li>
              Elle est supprimée automatiquement après génération du PDF, généralement
              dans les minutes qui suivent
            </li>
            <li>
              Elle n&rsquo;est jamais réutilisée pour entraîner des modèles d&rsquo;IA -
              l&rsquo;API Anthropic n&rsquo;utilise pas les données clients pour l&rsquo;entraînement
            </li>
            <li>Elle n&rsquo;est jamais partagée avec d&rsquo;autres tiers en dehors de ce flux</li>
          </ul>
        </div>

        <div className="kova-legal__divider" />

        <div className="kova-legal__section">
          <h2>Consentement marketing</h2>
          <ul>
            <li>
              Le consentement à recevoir des emails de conseil déco est libre, éclairé et
              explicite - il est recueilli via une case à cocher non pré-cochée
            </li>
            <li>
              Vous pouvez retirer votre consentement à tout moment via le lien de
              désinscription présent dans chaque email
            </li>
            <li>
              Le retrait du consentement n&rsquo;affecte pas les emails liés à une commande
              (livraison de votre analyse, confirmations de paiement)
            </li>
          </ul>
        </div>

        <div className="kova-legal__divider" />

        <div className="kova-legal__section">
          <h2>Durée de conservation</h2>
          <ul>
            <li>
              <strong>Email et profil style (quiz)</strong> : conservés tant que vous ne
              demandez pas la suppression, ou 3 ans après le dernier contact
            </li>
            <li>
              <strong>Photos uploadées</strong> : supprimées dans l&rsquo;heure suivant la
              génération du PDF
            </li>
            <li>
              <strong>Données de paiement</strong> : 10 ans (obligation comptable légale,
              gérées par Stripe)
            </li>
            <li>
              <strong>Liste marketing</strong> : conservées tant que vous êtes abonné·e,
              supprimées immédiatement en cas de désinscription
            </li>
          </ul>
        </div>

        <div className="kova-legal__divider" />

        <div className="kova-legal__section">
          <h2>Vos droits</h2>
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul>
            <li>Droit d&rsquo;accès à vos données</li>
            <li>Droit de rectification</li>
            <li>Droit à l&rsquo;effacement (droit à l&rsquo;oubli)</li>
            <li>Droit à la limitation du traitement</li>
            <li>Droit à la portabilité</li>
            <li>Droit d&rsquo;opposition</li>
            <li>Droit de retirer votre consentement à tout moment</li>
            <li>
              Droit d&rsquo;introduire une réclamation auprès de la{" "}
              <strong>CNIL</strong> (cnil.fr)
            </li>
          </ul>
          <p>
            Pour exercer ces droits, écrivez-moi à{" "}
            <strong>hello@studiokova.fr</strong>. Je réponds sous 30 jours maximum.
          </p>
        </div>

        <div className="kova-legal__divider" />

        <div className="kova-legal__section">
          <h2>Cookies et traceurs</h2>
          <ul>
            <li>
              <strong>Cookies techniques</strong>&nbsp;: strictement nécessaires au fonctionnement
              du site (session, sécurité). Aucun consentement requis.
            </li>
            <li>
              <strong>Meta Pixel</strong>&nbsp;: pixel publicitaire de Meta (Facebook/Instagram).
              Chargé uniquement avec votre consentement explicite. Permet de mesurer l&rsquo;efficacité
              des campagnes et de vous proposer des publicités pertinentes sur les plateformes Meta.
            </li>
            <li>
              <strong>Pinterest Tag</strong>&nbsp;: pixel de suivi de Pinterest. Chargé uniquement
              avec votre consentement explicite. Permet de mesurer les conversions issues de Pinterest.
            </li>
          </ul>
          <p>
            Les pixels Meta et Pinterest ne sont jamais chargés sans votre accord préalable. Vous
            pouvez gérer vos préférences à tout moment via le lien « Gérer mes cookies » en pied
            de page.
          </p>
        </div>

        <div className="kova-legal__divider" />

        <div className="kova-legal__section">
          <h2>Contact</h2>
          <p>Pour toute question relative à vos données personnelles : hello@studiokova.fr</p>
        </div>
      </div>

      <KovaFooter />
    </>
  );
}
