import { ReactNode } from "react";

type CalloutType = "fait" | "analyse" | "opinion";

const STYLES: Record<CalloutType, { label: string; classes: string }> = {
  fait: {
    label: "Fait vérifié",
    classes: "border-brand-500 bg-brand-50 text-brand-900",
  },
  analyse: {
    label: "Analyse de la rédaction",
    classes: "border-ink-400 bg-ink-50 text-ink-800",
  },
  opinion: {
    label: "Opinion",
    classes: "border-clay-500 bg-orange-50 text-ink-800",
  },
};

// Utilisé dans le contenu MDX pour distinguer explicitement faits sourcés,
// analyse éditoriale et opinion (voir charte anti-hallucination, section 14).
export function Callout({
  type = "analyse",
  children,
}: {
  type?: CalloutType;
  children: ReactNode;
}) {
  const style = STYLES[type];
  return (
    <div
      className={`not-prose my-6 rounded-md border-l-4 px-4 py-3 text-[0.95rem] leading-relaxed ${style.classes}`}
    >
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide opacity-80">
        {style.label}
      </p>
      <div className="prose-sm">{children}</div>
    </div>
  );
}
