import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "src/content/blog");

export function getAllPosts() {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));

  return files
    .map((filename) => {
      const slug = filename.replace(".mdx", "");
      const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), "utf-8");
      const { data } = matter(raw);
      return { slug, ...data };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getPostBySlug(slug) {
  const filepath = path.join(CONTENT_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(filepath, "utf-8");
  const { data, content } = matter(raw);
  return { frontmatter: data, content };
}

const FALLBACK_SLUGS = ['ia-decoration-interieur', 'decorer-appartement'];

export function getPostsByPiece(piece) {
  const allPosts = getAllPosts();
  const pieceArticles = allPosts
    .filter((post) => Array.isArray(post.pieces) && post.pieces.includes(piece))
    .slice(0, 3);

  if (pieceArticles.length >= 3) return pieceArticles;

  const existingSlugs = new Set(pieceArticles.map((p) => p.slug));
  const fallbacks = FALLBACK_SLUGS
    .map((slug) => allPosts.find((p) => p.slug === slug))
    .filter((p) => p && !existingSlugs.has(p.slug));

  return [...pieceArticles, ...fallbacks].slice(0, 3);
}

export function formatDate(dateStr) {
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateStr));
}
