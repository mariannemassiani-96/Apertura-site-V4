import Link from "next/link";
import { siteContent } from "@/lib/content";

export const Footer = () => {
  const { footer } = siteContent;

  return (
    <footer className="bg-graphite text-ivoire">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-12">
        <div className="text-xs uppercase tracking-[0.4em] text-ivoire/40">{footer.signature}</div>
        <div className="text-sm text-ivoire/70">{footer.mention}</div>
        <div className="flex flex-wrap gap-4 text-xs text-ivoire/50">
          {footer.links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};
