import Link from "next/link";
import { siteContent } from "@/lib/content";

export default function NotFound() {
  const { notFound } = siteContent;

  return (
    <div className="bg-graphite py-24">
      <div className="mx-auto w-full max-w-3xl px-5 text-center">
        <h1 className="section-heading">{notFound.title}</h1>
        <p className="section-body mt-6">{notFound.text}</p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full border border-cuivre px-6 py-3 text-xs uppercase tracking-wide text-cuivre"
        >
          {notFound.action}
        </Link>
      </div>
    </div>
  );
}
