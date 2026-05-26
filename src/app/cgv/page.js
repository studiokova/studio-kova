import KovaNav    from "@/components/kova/KovaNav";
import KovaFooter from "@/components/kova/KovaFooter";

export const metadata = {
  title: "Conditions Générales de Vente - Studio Kova",
  alternates: { canonical: "https://www.studiokova.fr/cgv" },
};

export default function CGV() {
  return (
    <>
      <KovaNav full />

      <div className="kova-legal">
        <h1>Conditions Générales de Vente</h1>
        <p className="kova-legal__date">Dernière mise à jour : 26 mai 2026</p>

        <div className="kova-legal__section">
          <h2>Article 1 — Identité du vendeur</h2>
          <address>
            Clémence Laurent, entrepreneur individuelle exerçant sous le nom commercial « Studio Kova »<br />
            SIRET&nbsp;: 10523019700011<br />
            41500 Mer, France<br />
            Email&nbsp;: hello@studiokova.fr
          </address>
          <p>TVA non applicable, article 293 B du CGI.</p>
        </div>

        <div className="kova-legal__divider" />

        <div className="kova-legal__section">
          <h2>Article 2 — Prestations proposées et prix</h2>
          <p>Studio Kova propose les prestations suivantes, à destination des particuliers résidant en France&nbsp;:</p>
          <ul>
            <li>
              <strong>Quiz de style</strong>&nbsp;: gratuit. Questionnaire en ligne permettant
              d&rsquo;identifier votre profil décoratif. Résultat envoyé par email.
            </li>
            <li>
              <strong>Analyse photo de pièce</strong>&nbsp;: 69&nbsp;€ TTC. Sur envoi d&rsquo;une photo
              de votre pièce et d&rsquo;un questionnaire de contexte, je réalise une analyse personnalisée
              livrée sous forme de PDF.
            </li>
            <li>
              <strong>Offre sur-mesure</strong>&nbsp;: à partir de 299&nbsp;€ par pièce TTC. Sélection
              complète de meubles, planche produits et liens d&rsquo;achat, réalisée sur la base d&rsquo;un
              brief détaillé.
            </li>
          </ul>
          <p>
            Tous les prix sont indiqués en euros, TVA non applicable conformément à l&rsquo;article 293 B
            du Code général des impôts. Je me réserve le droit de modifier mes tarifs à tout moment&nbsp;;
            les prestations sont facturées au prix en vigueur au moment de la validation de la commande.
          </p>
        </div>

        <div className="kova-legal__divider" />

        <div className="kova-legal__section">
          <h2>Article 3 — Commande et paiement</h2>
          <p>
            La commande est effectuée en ligne sur le site studiokova.fr. Le paiement est sécurisé et
            traité par <strong>Stripe</strong>. Je n&rsquo;ai jamais accès à vos données bancaires&nbsp;;
            celles-ci sont traitées directement par Stripe selon ses propres conditions de sécurité.
          </p>
          <p>
            La commande est considérée comme ferme et définitive dès validation du paiement. Un email
            de confirmation est envoyé à l&rsquo;adresse fournie lors de la commande.
          </p>
          <p>
            Aucun accès à la prestation n&rsquo;est possible avant réception du paiement intégral.
          </p>
        </div>

        <div className="kova-legal__divider" />

        <div className="kova-legal__section">
          <h2>Article 4 — Livraison des prestations</h2>
          <p>
            Les prestations sont livrées exclusivement par voie électronique, à l&rsquo;adresse email
            renseignée lors de la commande&nbsp;:
          </p>
          <ul>
            <li>
              <strong>Analyse photo de pièce</strong>&nbsp;: le PDF est envoyé dans un délai de{" "}
              <strong>48 heures ouvrées</strong> à compter de la réception de la photo et du questionnaire
              complets.
            </li>
            <li>
              <strong>Offre sur-mesure</strong>&nbsp;: la planche et la sélection produits sont envoyées
              dans un délai de <strong>5 jours ouvrés</strong> à compter de la validation du brief.
            </li>
          </ul>
          <p>
            Ces délais s&rsquo;entendent hors week-ends et jours fériés. En cas de retard imprévu,
            je m&rsquo;engage à vous en informer par email dans les meilleurs délais.
          </p>
        </div>

        <div className="kova-legal__divider" />

        <div className="kova-legal__section">
          <h2>Article 5 — Droit de rétractation</h2>
          <p>
            Conformément à l&rsquo;article L. 221-18 du Code de la consommation, vous disposez d&rsquo;un
            délai de <strong>14 jours</strong> à compter de la validation de votre commande pour exercer
            votre droit de rétractation, sans avoir à justifier de motifs ni à payer de pénalités.
          </p>
          <p>
            Toutefois, conformément à l&rsquo;article L. 221-28 du Code de la consommation,{" "}
            <strong>le droit de rétractation ne peut être exercé</strong> pour les prestations de fourniture
            de contenu numérique dont l&rsquo;exécution a commencé avant la fin du délai de rétractation,
            avec votre accord préalable exprès et votre renonciation expresse à ce droit.
          </p>
          <p>
            En validant votre commande d&rsquo;<strong>analyse photo de pièce</strong>, vous reconnaissez
            expressément que l&rsquo;exécution de la prestation commence immédiatement après paiement et
            renoncez expressément à votre droit de rétractation.
          </p>
          <p>
            Pour l&rsquo;<strong>offre sur-mesure</strong>, le droit de rétractation peut être exercé
            jusqu&rsquo;au début effectif de la prestation, c&rsquo;est-à-dire avant l&rsquo;envoi de
            votre brief validé. Une fois ce brief transmis et la prestation engagée avec votre accord,
            le droit de rétractation ne s&rsquo;applique plus.
          </p>
          <p>
            Pour exercer votre droit de rétractation le cas échéant&nbsp;: hello@studiokova.fr
          </p>
        </div>

        <div className="kova-legal__divider" />

        <div className="kova-legal__section">
          <h2>Article 6 — Réclamations</h2>
          <p>
            Pour toute réclamation relative à une prestation, adressez-moi un email à{" "}
            <strong>hello@studiokova.fr</strong> en précisant votre nom, la date de commande et la
            nature de votre demande. Je m&rsquo;engage à y répondre dans un délai de{" "}
            <strong>5 jours ouvrés</strong>.
          </p>
          <p>
            En cas de litige non résolu à l&rsquo;amiable, vous pouvez recourir à la médiation de
            la consommation dans les conditions prévues à l&rsquo;article 7.
          </p>
        </div>

        <div className="kova-legal__divider" />

        <div className="kova-legal__section">
          <h2>Article 7 — Médiation de la consommation</h2>
          <p>
            Conformément aux dispositions du Code de la consommation concernant le processus de
            médiation des litiges de la consommation, après m&rsquo;avoir sollicitée et à défaut
            de réponse vous satisfaisant, vous avez la possibilité de recourir gratuitement à une
            procédure de médiation de la consommation auprès de&nbsp;: CM2C, 49 rue de Ponthieu,
            75008 Paris. Téléphone&nbsp;: 01 89 47 00 14.{" "}
            Site internet&nbsp;:{" "}
            <a
              href="https://www.cm2c.net/declarer-un-litige.php"
              target="_blank"
              rel="noopener noreferrer"
            >
              cm2c.net
            </a>. Mail&nbsp;: litiges@cm2c.net
          </p>
          <p>
            Vous pouvez également accéder à la plateforme européenne de règlement en ligne des
            litiges (plateforme ODR) à l&rsquo;adresse&nbsp;:{" "}
            <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">
              ec.europa.eu/consumers/odr
            </a>.
          </p>
        </div>

        <div className="kova-legal__divider" />

        <div className="kova-legal__section">
          <h2>Article 8 — Garanties légales</h2>
          <p>
            Conformément aux articles L. 224-25-1 et suivants du Code de la consommation, issus
            de la transposition de la directive européenne 2019/770, les contenus numériques fournis
            (PDF d&rsquo;analyse, planche sur-mesure) bénéficient d&rsquo;une{" "}
            <strong>garantie légale de conformité de deux ans</strong> à compter de leur livraison.
          </p>
          <p>
            En cas de défaut de conformité, je m&rsquo;engage à mettre en conformité le livrable
            concerné ou, si cela s&rsquo;avère impossible, à procéder au remboursement. Pour
            exercer cette garantie&nbsp;: hello@studiokova.fr
          </p>
        </div>

        <div className="kova-legal__divider" />

        <div className="kova-legal__section">
          <h2>Article 9 — Propriété intellectuelle</h2>
          <p>
            Les livrables remis (PDF d&rsquo;analyse, planche produits, sélection meubles) sont
            destinés à un usage strictement personnel et non commercial. Je vous cède le droit de
            les utiliser à titre personnel pour la durée légale de protection des droits d&rsquo;auteur.
          </p>
          <p>
            Toute reproduction, diffusion publique, revente ou utilisation commerciale de ces
            livrables sans mon autorisation préalable écrite est interdite.
          </p>
        </div>

        <div className="kova-legal__divider" />

        <div className="kova-legal__section">
          <h2>Article 10 — Limitation de responsabilité</h2>
          <p>
            Les conseils et recommandations délivrés par Studio Kova constituent une prestation
            intellectuelle fournie à titre indicatif. Ils ne constituent pas une obligation de
            résultat quant au rendu final de votre intérieur, qui dépend de facteurs indépendants
            de ma volonté&nbsp;: qualité d&rsquo;exécution des artisans, disponibilité des produits,
            contraintes structurelles du logement, etc.
          </p>
          <p>
            Ma responsabilité ne saurait en aucun cas excéder le montant payé pour la prestation
            concernée. Je ne suis pas responsable des dommages indirects résultant de
            l&rsquo;utilisation des livrables.
          </p>
        </div>

        <div className="kova-legal__divider" />

        <div className="kova-legal__section">
          <h2>Article 11 — Droit applicable et juridiction compétente</h2>
          <p>
            Les présentes conditions générales de vente sont soumises au droit français. En cas
            de litige non résolu par voie amiable ou par médiation, les tribunaux français seront
            seuls compétents.
          </p>
        </div>
      </div>

      <KovaFooter />
    </>
  );
}
