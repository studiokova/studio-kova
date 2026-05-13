import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/blog";

export const metadata = {
  title: "Journal — Studio Kova",
  description: "Conseils décoration, méthodes et inspirations pour transformer votre intérieur avec justesse.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --craie: #F5EFE4;
          --cuivre: #B8612A;
          --sauge-md: #3D6B52;
          --sauge-dk: #2E4A3A;
          --sauge-lt: #6B9E7A;
          --ocre: #E8C97A;
          --gris: #888780;
          --gris-clair: #D3D1C7;
        }
        body { background: var(--craie); font-family: var(--font-dm-sans, "DM Sans"), sans-serif; color: var(--sauge-dk); -webkit-font-smoothing: antialiased; }

        .blog-nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 24px; height: 58px;
          border-bottom: 1px solid rgba(211,209,199,0.5);
          background: var(--craie);
          position: sticky; top: 0; z-index: 10;
        }
        .blog-nav a { text-decoration: none; }
        .nav-logo { display: flex; align-items: center; gap: 10px; }
        .nav-logotype { display: flex; flex-direction: column; line-height: 1; gap: 1px; }
        .nav-logotype .studio { font-size: 7.5px; font-weight: 500; letter-spacing: 0.2em; color: var(--sauge-lt); text-transform: uppercase; }
        .nav-logotype .kova { font-size: 19px; font-weight: 300; letter-spacing: 0.03em; color: var(--sauge-dk); }
        .nav-back { font-size: 13px; color: var(--gris); display: flex; align-items: center; gap: 6px; transition: color 0.2s; }
        .nav-back:hover { color: var(--cuivre); }
        .nav-back svg { flex-shrink: 0; }

        .blog-header {
          max-width: 800px; margin: 0 auto;
          padding: 56px 24px 40px;
          border-bottom: 1px solid var(--gris-clair);
        }
        .blog-header .eyebrow {
          font-size: 10px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--cuivre); margin-bottom: 14px;
        }
        .blog-header h1 {
          font-family: var(--font-playfair, "Playfair Display"), serif;
          font-size: clamp(28px, 5vw, 42px); font-weight: 400; line-height: 1.15;
          color: var(--sauge-dk); margin-bottom: 14px;
        }
        .blog-header p { font-size: 15px; color: var(--gris); line-height: 1.6; max-width: 520px; }

        .blog-list { max-width: 800px; margin: 0 auto; padding: 0 24px 80px; }

        .post-card {
          display: block; text-decoration: none;
          padding: 32px 0;
          border-bottom: 1px solid var(--gris-clair);
          transition: opacity 0.2s;
        }
        .post-card:first-child { padding-top: 36px; }
        .post-card:hover { opacity: 0.75; }
        .post-card:hover .post-title { color: var(--cuivre); }

        .post-meta { font-size: 11px; color: var(--gris); letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 10px; }
        .post-title {
          font-family: var(--font-playfair, "Playfair Display"), serif;
          font-size: clamp(18px, 2.5vw, 22px); font-weight: 400; line-height: 1.3;
          color: var(--sauge-dk); margin-bottom: 10px;
          transition: color 0.2s;
        }
        .post-excerpt { font-size: 14px; color: var(--gris); line-height: 1.65; max-width: 580px; margin-bottom: 16px; }
        .post-cta { font-size: 13px; color: var(--cuivre); font-weight: 500; display: flex; align-items: center; gap: 6px; }

        .blog-empty { padding: 80px 24px; text-align: center; color: var(--gris); font-size: 15px; }

        @media (max-width: 640px) {
          .blog-header { padding: 40px 20px 32px; }
          .blog-list { padding: 0 20px 60px; }
          .blog-nav { padding: 0 20px; }
        }
      `}</style>

      <nav className="blog-nav">
        <Link href="/" className="nav-logo">
          <div className="nav-logotype">
            <span className="studio">Studio</span>
            <span className="kova">Kova</span>
          </div>
        </Link>
        <Link href="/" className="nav-back">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Accueil
        </Link>
      </nav>

      <header className="blog-header">
        <p className="eyebrow">Journal</p>
        <h1>Conseils & inspirations déco</h1>
        <p>Des méthodes concrètes, des règles utiles et des perspectives pour transformer votre intérieur avec justesse.</p>
      </header>

      <main className="blog-list">
        {posts.length === 0 ? (
          <div className="blog-empty">Aucun article pour le moment. Revenez bientôt.</div>
        ) : (
          posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="post-card">
              <p className="post-meta">{formatDate(post.date)}</p>
              <h2 className="post-title">{post.title}</h2>
              {post.excerpt && <p className="post-excerpt">{post.excerpt}</p>}
              <span className="post-cta">
                Lire l&rsquo;article
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </Link>
          ))
        )}
      </main>
    </>
  );
}
