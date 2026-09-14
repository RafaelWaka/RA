import Link from "next/link";
import { getCategory } from "@/lib/categories";

const COLOR_CLASSES: Record<string, string> = {
  brand: "bg-brand-100 text-brand-800",
  clay: "bg-orange-100 text-clay-600",
  ink: "bg-ink-100 text-ink-700",
};

export function CategoryPill({
  slug,
  size = "sm",
}: {
  slug: string;
  size?: "sm" | "md";
}) {
  const category = getCategory(slug);
  if (!category) return null;
  const classes = COLOR_CLASSES[category.color] ?? COLOR_CLASSES.ink;
  const sizeClasses =
    size === "md" ? "px-3 py-1 text-sm" : "px-2.5 py-0.5 text-xs";
  return (
    <Link
      href={`/categories/${category.slug}`}
      className={`inline-block rounded-full font-medium uppercase tracking-wide transition hover:opacity-80 ${classes} ${sizeClasses}`}
    >
      {category.name}
    </Link>
  );
}
