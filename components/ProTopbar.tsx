"use client";

import Link from "next/link";
import { logout } from "@/lib/auth";
import { siteContent } from "@/lib/content";
import { useRouter } from "next/navigation";

export const ProTopbar = () => {
  const router = useRouter();
  const { topbar } = siteContent.pro;

  return (
    <div className="flex items-center justify-between border-b border-ivoire/10 px-6 py-4 text-sm text-ivoire">
      <div className="text-xs uppercase tracking-wide text-ivoire/60">{siteContent.brand.name}</div>
      <div className="flex items-center gap-3">
        <Link href="/" className="text-xs uppercase tracking-wide text-ivoire/70 hover:text-ivoire">
          {topbar.backToSite}
        </Link>
        <button
          type="button"
          className="rounded-full border border-ivoire/30 px-3 py-1 text-xs uppercase tracking-wide"
          onClick={() => {
            logout();
            router.push("/pro/login");
          }}
        >
          {topbar.logout}
        </button>
      </div>
    </div>
  );
};
