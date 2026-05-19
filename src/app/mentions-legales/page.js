import KovaNav    from "@/components/kova/KovaNav";
import KovaFooter from "@/components/kova/KovaFooter";

export const metadata = {
  title: "Mentions légales — Studio Kova",
};

export default function MentionsLegales() {
  return (
    <>
      <KovaNav showBack backLabel="Accueil" backHref="/" />

      <div className="kova-legal">
        <h1>Mentions légales</h1>

        <div className="kova-legal__section">
          <h2>Éditeur du site</h2>
          <address>
            Clémence Laurent<br />
            41500 Mer, France<br />
            Email : hello@studiokova.fr<br />
            Site : studiokova.fr
          </address>
        </div>

        <div className="kova-legal__divider" />

        <div className="kova-legal__section">
          <h2>Activité</h2>
          <p>Studio Kova est une activité de conseil en décoration d&rsquo;intérieur exercée à titre individuel.</p>
        </div>

        <div className="kova-legal__divider" />

        <div className="kova-legal__section">
          <h2>Hébergement</h2>
          <address>
            Vercel Inc.<br />
            440 N Barranca Ave #4133<br />
            Covina, CA 91723, États-Unis<br />
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
          <h2>Contact</h2>
          <p>Pour toute question : hello@studiokova.fr</p>
        </div>
      </div>

      <KovaFooter />
    </>
  );
}
