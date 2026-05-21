"use client";

import { useState, useEffect } from "react";

export default function KovaToc({ headings }) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-10% 0% -75% 0%" }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) return null;

  return (
    <nav className="kova-toc" aria-label="Sommaire de l'article">
      <p className="kova-toc__label">Sommaire</p>
      <ul className="kova-toc__list">
        {headings.map(({ id, text }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={`kova-toc__link${activeId === id ? " kova-toc__link--active" : ""}`}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
