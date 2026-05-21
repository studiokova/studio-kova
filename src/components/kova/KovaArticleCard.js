import Link from "next/link";
import Image from "next/image";

export default function KovaArticleCard({ href, date, title, excerpt, image }) {
  return (
    <Link href={href} className="kova-article-card">
      {image && (
        <div className="kova-article-card__thumb">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(min-width: 860px) 33vw, (min-width: 640px) 50vw, 100vw"
            style={{ objectFit: "cover" }}
          />
        </div>
      )}
      <div className="kova-article-card__body">
        {date && <p className="kova-article-card__meta">{date}</p>}
        <h2 className="kova-article-card__title">{title}</h2>
        {excerpt && <p className="kova-article-card__excerpt">{excerpt}</p>}
        <span className="kova-article-card__cta">
          Lire l&rsquo;article
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
