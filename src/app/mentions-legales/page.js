import KovaNav    from "@/components/kova/KovaNav";
import KovaFooter from "@/components/kova/KovaFooter";

export const metadata = {
  title: "Mentions légales - Studio Kova",
};

export default function MentionsLegales() {
  return (
    <>
      <KovaNav full />

      <div className="kova-legal">
        <h1>Mentions légales</h1>

        <div className="kova-legal__section">
          <h2>Éditeur du site</h2>
          <address>
            Clémence Laurent, entrepreneur individuelle exerçant sous le nom commercial « Studio Kova »<br />
            SIRET : 10523019700011<br />
            41500 Mer, France<br />
            Email : hello@studiokova.fr<br />
            Site : studiokova.fr
          </address>
          <p>Directrice de la publication : Clémence Laurent</p>
        </div>

        <div className="kova-legal__divider" />

        <div className="kova-legal__section">
          <h2>Activité</h2>
          <p>Studio Kova est une activité de conseil en décoration d&rsquo;intérieur exercée à titre individuel.</p>
          <p>TVA non applicable, article 293 B du CGI.</p>
        </div>

        <div className="kova-legal__divider" />

        <div className="kova-legal__section">
          <h2>Hébergement</h2>
          <address>
            Vercel Inc.<br />
            340 S Lemon Ave #4133<br />
            Walnut, CA 91789, États-Unis<br />
            vercel.com
          </address>
        </div>

        <div className="kova-legal__divider" />

        <div className="kova-legal__section">
          <h2>Propriété intellectuelle</h2>
          <p>
            L&rsquo;ensemble du contenu de ce site (textes, visuels, logo) est la propriété exclusive
            de Studio Kova. Toute reproduction, même partielle, est interdite sans autorisation préalable.
          </p>
        </div>

        <div className="kova-legal__divider" />

        <div className="kova-legal__section">
          <h2>Médiation de la consommation</h2>
          <p>
            Conformément aux dispositions du Code de la consommation concernant le processus de
            médiation des litiges de la consommation, après m&rsquo;avoir sollicitée et à défaut
            de réponse vous satisfaisant, vous avez la possibilité de recourir gratuitement à une
            procédure de médiation de la consommation auprès de : CM2C, 49 rue de Ponthieu,
            75008 Paris. Téléphone : 01 89 47 00 14.{" "}
            Site internet :{" "}
            <a href="https://www.cm2c.net/declarer-un-litige.php" target="_blank" rel="noopener noreferrer">
              cm2c.net
            </a>. Mail : litiges@cm2c.net
          </p>
        </div>

        <div className="kova-legal__divider" />

        <div className="kova-legal__section">
          <h2>Contact</h2>
          <p>Pour toute question : hello@studiokova.fr</p>
        </div>
      </div>

      <KovaFooter />
    </>
  );
}
