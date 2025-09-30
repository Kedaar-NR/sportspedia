"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumbs({
  trail,
}: {
  trail: { href: string; label: string }[];
}) {
  const path = usePathname();
  return (
    <aside
      style={{
        position: "sticky",
        top: 16,
        alignSelf: "flex-start",
        minWidth: 220,
      }}
    >
      <nav aria-label="Breadcrumbs">
        {trail.map((t, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <Link href={t.href} className="cardMeta">
              {i === 0 ? "🏠 " : ""}
              {t.label}
            </Link>
          </div>
        ))}
      </nav>
    </aside>
  );
}
