"use client";
import { useEffect, useState } from "react";

export default function Toc() {
  const [items, setItems] = useState<
    { id: string; text: string; level: number }[]
  >([]);
  useEffect(() => {
    const stripEmojis = (s: string) =>
      s.replace(
        /[\u{1F300}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}\u{1F3FB}-\u{1F3FF}]/gu,
        ""
      );
    const headings = Array.from(
      document.querySelectorAll("h1, h2, h3, h4, h5")
    ).map((h) => ({
      id: (h as HTMLElement).id || "",
      text: stripEmojis((h as HTMLElement).innerText).trim(),
      level: Number((h.tagName || "H2").slice(1)),
    }));
    setItems(headings);
  }, []);
  return (
    <aside
      style={{
        position: "sticky",
        top: 16,
        alignSelf: "flex-start",
        minWidth: 220,
      }}
    >
      <div className="cardMeta" style={{ fontWeight: 600, marginBottom: 6 }}>
        Contents
      </div>
      <nav>
        {items.map((it, idx) => (
          <div
            key={idx}
            style={{ marginBottom: 6, paddingLeft: (it.level - 2) * 12 }}
          >
            <a href={`#${it.id}`} className="cardMeta">
              {it.text}
            </a>
          </div>
        ))}
      </nav>
    </aside>
  );
}
