import { labels } from "@/lib/content";

export const SkipLink = () => (
  <a
    href="#main"
    className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ivoire focus:px-4 focus:py-2 focus:text-xs focus:uppercase focus:text-graphite"
  >
    {labels.accessibility.skip}
  </a>
);
