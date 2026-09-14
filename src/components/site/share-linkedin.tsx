"use client";

export function ShareLinkedIn({ url, title }: { url: string; title: string }) {
  const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    url
  )}`;
  return (
    <a
      href={shareUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Partager "${title}" sur LinkedIn`}
      className="inline-flex items-center gap-2 rounded-md border border-ink-200 px-3 py-2 text-sm font-medium text-ink-700 transition hover:border-brand-600 hover:text-brand-700"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.11 20.45H3.56V9h3.55v11.45z" />
      </svg>
      Partager
    </a>
  );
}
