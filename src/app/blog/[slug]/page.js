import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug, formatDate } from "@/lib/blog";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const { frontmatter } = getPostBySlug(slug);
    return {
      title: `${frontmatter.title} — Studio Kova`,
      description: frontmatter.excerpt || "",
    };
  } catch {
    return {};
  }
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;

  let post;
  try {
    post = getPostBySlug(slug);
  } catch {
    notFound();
  }

  const { frontmatter, content } = post;

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

        .article-wrap { max-width: 700px; margin: 0 auto; padding: 0 24px 100px; }

        .article-header { padding: 52px 0 36px; border-bottom: 1px solid var(--gris-clair); margin-bottom: 44px; }
        .article-meta { font-size: 11px; color: var(--gris); letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 16px; }
        .article-title {
          font-family: var(--font-playfair, "Playfair Display"), serif;
          font-size: clamp(24px, 4vw, 36px); font-weight: 400; line-height: 1.2;
          color: var(--sauge-dk); margin-bottom: 16px;
        }
        .article-excerpt { font-size: 15px; color: var(--gris); line-height: 1.65; }

        .article-body { font-size: 15px; line-height: 1.75; color: var(--sauge-dk); }
        .article-body p { margin-bottom: 20px; }
        .article-body h2 {
          font-family: var(--font-playfair, "Playfair Display"), serif;
          font-size: clamp(18px, 2.5vw, 22px); font-weight: 400;
          color: var(--sauge-dk); margin: 44px 0 14px;
          line-height: 1.3;
        }
        .article-body h3 {
          font-size: 15px; font-weight: 500; color: var(--sauge-dk);
          margin: 32px 0 10px; letter-spacing: 0.01em;
        }
        .article-body strong { font-weight: 500; color: var(--sauge-dk); }
        .article-body em { font-style: italic; }
        .article-body a { color: var(--cuivre); text-decoration: underline; text-decoration-color: rgba(184,97,42,0.35); text-underline-offset: 3px; transition: text-decoration-color 0.2s; }
        .article-body a:hover { text-decoration-color: var(--cuivre); }
        .article-body ul, .article-body ol { padding-left: 22px; margin-bottom: 20px; }
        .article-body li { margin-bottom: 6px; }
        .article-body blockquote {
          border-left: 2px solid var(--cuivre);
          margin: 32px 0; padding: 16px 24px;
          background: rgba(184,97,42,0.05);
          border-radius: 0 4px 4px 0;
          font-style: italic; color: var(--gris);
          font-size: 15px; line-height: 1.7;
        }
        .article-body blockquote p { margin-bottom: 0; }
        .article-body hr { border: none; border-top: 1px solid var(--gris-clair); margin: 44px 0; }
        .article-body code {
          font-family: monospace; font-size: 13px;
          background: rgba(46,74,58,0.07); padding: 2px 6px; border-radius: 3px;
        }

        .article-footer {
          margin-top: 60px; padding-top: 32px;
          border-top: 1px solid var(--gris-clair);
          display: flex; align-items: center; justify-content: space-between; gap: 16px;
          flex-wrap: wrap;
        }
        .footer-back { font-size: 13px; color: var(--gris); text-decoration: none; display: flex; align-items: center; gap: 6px; transition: color 0.2s; }
        .footer-back:hover { color: var(--cuivre); }
        .footer-cta {
          font-size: 13px; font-weight: 500; color: var(--craie);
          background: var(--cuivre); text-decoration: none;
          padding: 10px 20px; border-radius: 4px;
          transition: opacity 0.2s;
        }
        .footer-cta:hover { opacity: 0.85; }

        @media (max-width: 640px) {
          .article-wrap { padding: 0 20px 80px; }
          .article-header { padding: 36px 0 28px; margin-bottom: 32px; }
          .blog-nav { padding: 0 20px; }
          .article-footer { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <nav className="blog-nav">
        <Link href="/" className="nav-logo">
          <div className="nav-logotype">
            <span className="studio">Studio</span>
            <span className="kova">Kova</span>
          </div>
        </Link>
        <Link href="/blog" className="nav-back">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Journal
        </Link>
      </nav>

      <article className="article-wrap">
        <header className="article-header">
          <p className="article-meta">{formatDate(frontmatter.date)}</p>
          <h1 className="article-title">{frontmatter.title}</h1>
          {frontmatter.excerpt && <p className="article-excerpt">{frontmatter.excerpt}</p>}
        </header>

        <div className="article-body">
          <MDXRemote source={content} />
        </div>

        <footer className="article-footer">
          <Link href="/blog" className="footer-back">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Tous les articles
          </Link>
          <Link href="/analyse" className="footer-cta">
            Découvrir l&rsquo;Analyse déco →
          </Link>
        </footer>
      </article>
    </>
  );
}
