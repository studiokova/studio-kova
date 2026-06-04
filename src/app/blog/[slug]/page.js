import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug, formatDate } from "@/lib/blog";
import rehypeFrenchTypo from "@/lib/rehypeFrenchTypo";
import KovaNav        from "@/components/kova/KovaNav";
import KovaPageHeader from "@/components/kova/KovaPageHeader";
import KovaButton     from "@/components/kova/KovaButton";
import KovaFooter     from "@/components/kova/KovaFooter";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://studiokova.fr";

function buildArticleSchema(frontmatter, slug) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title,
    description: frontmatter.excerpt || "",
    datePublished: frontmatter.date,
    dateModified: frontmatter.date,
    url: `${SITE_URL}/blog/${slug}`,
    ...(frontmatter.image && { image: `${SITE_URL}${frontmatter.image}` }),
    author: { "@type": "Organization", name: "Studio Kova", url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: "Studio Kova",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logos/logo-email.png` },
    },
  };
}

function buildFaqSchema(faq) {
  if (!Array.isArray(faq) || faq.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const { frontmatter } = getPostBySlug(slug);
    const title = `${frontmatter.title} - Studio Kova`;
    const description = frontmatter.excerpt || "";
    const ogImage = frontmatter.image
      ? { url: `${SITE_URL}${frontmatter.image}`, width: 1200, height: 630, alt: title }
      : { url: `${SITE_URL}/og-image.webp` };
    return {
      title,
      description,
      ...(frontmatter.keywords?.length && { keywords: frontmatter.keywords }),
      openGraph: {
        title,
        description,
        url: `${SITE_URL}/blog/${slug}`,
        type: "article",
        publishedTime: frontmatter.date,
        images: [ogImage],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImage.url],
      },
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
  const articleSchema = buildArticleSchema(frontmatter, slug);
  const faqSchema = buildFaqSchema(frontmatter.faq);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      <KovaNav full />

      <KovaPageHeader
        eyebrow={formatDate(frontmatter.date)}
        title={frontmatter.title}
        sub={frontmatter.excerpt || undefined}
        narrow
      />

      {frontmatter.image && (
        <div className="kova-article-hero">
          <Image
            src={frontmatter.image}
            alt={frontmatter.title}
            fill
            priority
            sizes="(max-width: 860px) 100vw, 860px"
            style={{ objectFit: "cover", objectPosition: frontmatter.imagePosition || "center" }}
          />
        </div>
      )}

      <div className="kova-article-wrap">
        <div className="kova-article-body">
          <MDXRemote
            source={content}
            options={{ mdxOptions: { rehypePlugins: [rehypeFrenchTypo] } }}
          />
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
