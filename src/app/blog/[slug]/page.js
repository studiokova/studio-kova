import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug, formatDate } from "@/lib/blog";
import KovaNav        from "@/components/kova/KovaNav";
import KovaPageHeader from "@/components/kova/KovaPageHeader";
import KovaButton     from "@/components/kova/KovaButton";
import KovaFooter     from "@/components/kova/KovaFooter";

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
      <KovaNav showBack backLabel="Journal" backHref="/blog" />

      <KovaPageHeader
        eyebrow={formatDate(frontmatter.date)}
        title={frontmatter.title}
        sub={frontmatter.excerpt || undefined}
        narrow
      />

      <div className="kova-article-body-wrap">
        <div className="kova-article-body">
          <MDXRemote source={content} />
        </div>

        <footer className="kova-article-footer">
          <Link href="/blog" className="kova-article-footer-back">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Tous les articles
          </Link>
          <KovaButton variant="primary" href="/analyse">
            Découvrir l&rsquo;Analyse déco →
          </KovaButton>
        </footer>
      </div>

      <KovaFooter />
    </>
  );
}
