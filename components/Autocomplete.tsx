"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Autocomplete({
  lang = "en",
  placeholder = "Search teams or players",
}: {
  lang?: string;
  placeholder?: string;
}) {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<{ title: string; url: string }[]>([]);
  const [open, setOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!q.trim()) {
      setItems([]);
      setOpen(false);
      return;
    }
    const ac = new AbortController();
    abortRef.current?.abort();
    abortRef.current = ac;
    const t = setTimeout(async () => {
      try {
        const r = await fetch(
          `/api/search?q=${encodeURIComponent(q)}&lang=${lang}`,
          { signal: ac.signal }
        );
        const json = await r.json();
        setItems(json);
        setOpen(true);
      } catch {}
    }, 200);
    return () => {
      clearTimeout(t);
      ac.abort();
    };
  }, [q, lang]);

  function go(url: string) {
    // open same tab
    window.location.href = url;
  }

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 680 }}>
      <div className="searchRow">
        <input
          className="searchInput"
          placeholder={placeholder}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button
          className="searchBtn"
          onClick={() => {
            if (items[0]) go(items[0].url);
            else if (q.trim())
              go(
                `https://${lang}.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(
                  q
                )}`
              );
          }}
        >
          Search
        </button>
      </div>
      {open && items.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #a2a9b1",
            borderTop: "none",
            zIndex: 20,
            maxHeight: 320,
            overflow: "auto",
          }}
        >
          {items.map((it) => (
            <div
              key={it.url}
              className="item"
              style={{
                border: "none",
                borderBottom: "1px solid #eaecf0",
                borderRadius: 0,
                cursor: "pointer",
              }}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => go(it.url)}
            >
              <span>{it.title}</span>
              <span style={{ color: "#54595d", fontSize: 12 }}>Open ↗</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
