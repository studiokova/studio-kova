import { getAllPosts, formatDate } from "@/lib/blog";
import KovaNav         from "@/components/kova/KovaNav";
import KovaPageHeader  from "@/components/kova/KovaPageHeader";
import KovaArticleCard from "@/components/kova/KovaArticleCard";
import KovaFooter      from "@/components/kova/KovaFooter";

export const metadata = {
  title: "Journal — Studio Kova",
  description:
    "Conseils décoration, méthodes et inspirations pour transformer votre intérieur avec justesse.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <KovaNav showBack backLabel="Accueil" backHref="/" />

      <KovaPageHeader
        eyebrow="Journal"
        title="Conseils & inspirations déco"
        sub="Des méthodes concrètes, des règles utiles et des perspectives pour transformer votre intérieur avec justesse."
      />

      <main className="kova-blog-list">
        {posts.length === 0 ? (
          <div className="kova-blog-empty">Aucun article pour le moment. Revenez bientôt.</div>
        ) : (
          posts.map((post) => (
            <KovaArticleCard
              key={post.slug}
              href={`/blog/${post.slug}`}
              date={formatDate(post.date)}
              title={post.title}
              excerpt={post.excerpt}
            />
          ))
        )}
      </main>

      <KovaFooter />
    </>
  );
}
