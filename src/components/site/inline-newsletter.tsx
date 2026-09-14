import { NewsletterForm } from "./newsletter-form";

export function InlineNewsletter() {
  return (
    <div className="not-prose my-10 rounded-lg border border-brand-200 bg-brand-50 p-6 text-center">
      <p className="font-serif text-lg font-bold text-brand-900">
        Cet article vous a été utile ?
      </p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-brand-800">
        Recevez chaque semaine notre sélection d&apos;articles, d&apos;études
        et d&apos;outils pour les recruteurs.
      </p>
      <div className="mx-auto mt-4 max-w-sm">
        <NewsletterForm compact source="article-inline" />
      </div>
    </div>
  );
}
