import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { ContactForm } from "@/components/site/contact-form";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "Contactez la rédaction du Recruteur de Demain.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ name: "Contact", path: "/contact" }]} />
      <h1 className="mt-3 font-serif text-3xl font-bold text-ink-950 sm:text-4xl">
        Contact
      </h1>
      <p className="mt-2 text-ink-600">
        Une correction à proposer, une envie d&apos;interview, une idée de
        sujet ? Écrivez-nous.
      </p>
      <div className="mt-8">
        <ContactForm />
      </div>
    </div>
  );
}
