"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function TierControls({
  leagueId,
  options,
}: {
  leagueId: string;
  options: { key: string; name: string }[];
}) {
  const router = useRouter();
  const sp = useSearchParams();
  const sortParam = sp.get("sort") || "asc";
  const urlTier = sp.get("tier");
  const storageKey = `tier:${leagueId}`;
  const [tier, setTier] = useState<string | null>(urlTier);

  useEffect(() => {
    if (urlTier) {
      localStorage.setItem(storageKey, urlTier);
      setTier(urlTier);
    } else {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        router.replace(
          `/league/${leagueId}?tier=${encodeURIComponent(
            saved
          )}&sort=${sortParam}`
        );
      }
    }
  }, [urlTier, leagueId, router, sortParam]);

  function navigate(nextTier: string) {
    localStorage.setItem(storageKey, nextTier);
    router.push(
      `/league/${leagueId}?tier=${encodeURIComponent(
        nextTier
      )}&sort=${sortParam}`
    );
  }

  return (
    <div className="btnRow" style={{ marginBottom: 8 }}>
      {options.map((o) => (
        <button
          key={o.key}
          className="searchBtn"
          style={{
            background:
              (tier || options[0].key) === o.key ? "#e6f0ff" : undefined,
          }}
          onClick={() => navigate(o.key)}
        >
          {o.name}
        </button>
      ))}
      <span className="cardMeta" style={{ marginLeft: 8 }}>
        Sort:
      </span>
      <button
        className="searchBtn"
        style={{ background: sortParam === "asc" ? "#e6f0ff" : undefined }}
        onClick={() =>
          router.push(
            `/league/${leagueId}?tier=${encodeURIComponent(
              tier || options[0].key
            )}&sort=asc`
          )
        }
      >
        A–Z
      </button>
      <button
        className="searchBtn"
        style={{ background: sortParam === "desc" ? "#e6f0ff" : undefined }}
        onClick={() =>
          router.push(
            `/league/${leagueId}?tier=${encodeURIComponent(
              tier || options[0].key
            )}&sort=desc`
          )
        }
      >
        Z–A
      </button>
    </div>
  );
}
