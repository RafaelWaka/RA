import Link from "next/link";

export function Pagination({
  basePath,
  currentPage,
  totalPages,
}: {
  basePath: string;
  currentPage: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex items-center justify-center gap-2"
    >
      {currentPage > 1 && (
        <PageLink basePath={basePath} page={currentPage - 1} label="← Précédent" />
      )}
      {pages.map((page) => (
        <Link
          key={page}
          href={page === 1 ? basePath : `${basePath}?page=${page}`}
          aria-current={page === currentPage ? "page" : undefined}
          className={`flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium ${
            page === currentPage
              ? "bg-ink-950 text-white"
              : "border border-ink-200 text-ink-700 hover:border-brand-600"
          }`}
        >
          {page}
        </Link>
      ))}
      {currentPage < totalPages && (
        <PageLink basePath={basePath} page={currentPage + 1} label="Suivant →" />
      )}
    </nav>
  );
}

function PageLink({
  basePath,
  page,
  label,
}: {
  basePath: string;
  page: number;
  label: string;
}) {
  return (
    <Link
      href={page === 1 ? basePath : `${basePath}?page=${page}`}
      className="rounded-md border border-ink-200 px-3 py-1.5 text-sm font-medium text-ink-700 hover:border-brand-600"
    >
      {label}
    </Link>
  );
}
