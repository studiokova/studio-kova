import { getAllPosts, formatDate } from "@/lib/blog";
import KovaNav         from "@/components/kova/KovaNav";
import KovaPageHeader  from "@/components/kova/KovaPageHeader";
import KovaArticleCard from "@/components/kova/KovaArticleCard";
import KovaFooter      from "@/components/kova/KovaFooter";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://studiokova.fr";

export const metadata = {
  title: "Journal - Studio Kova",
  description:
    "Conseils décoration, méthodes et inspirations pour transformer votre intérieur avec justesse.",
  openGraph: {
    title: "Journal Studio Kova — Conseils et méthodes décoration",
    description:
      "Guides pratiques pour décorer votre intérieur avec méthode : couleurs, textiles, pièce par pièce.",
    url: `${SITE_URL}/blog`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.webp` }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Journal Studio Kova — Conseils décoration",
    description:
      "Guides pratiques pour décorer votre intérieur avec méthode : couleurs, textiles, pièce par pièce.",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <KovaNav full />

      <KovaPageHeader
        eyebrow="Journal"
        title="Conseils déco intérieur : la méthode Studio Kova"
        sub="Des méthodes concrètes, des règles utiles et des perspectives pour transformer votre intérieur avec justesse."
      />

      <main className="kova-blog-list">
        {posts.length === 0 ? (
          <div className="kova-blog-empty">Aucun article pour le moment. Revenez bientôt.</div>
        ) : (
          posts.map((post, i) => (
            <KovaArticleCard
              key={post.slug}
              href={`/blog/${post.slug}`}
              date={formatDate(post.date)}
              title={post.title}
              excerpt={post.excerpt}
              image={post.image || null}
              priority={i === 0}
            />
          ))
        )}
      </main>

      <KovaFooter />
    </>
  );
}
