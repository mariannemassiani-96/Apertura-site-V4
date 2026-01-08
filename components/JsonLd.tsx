import { ReactNode } from "react";

export const JsonLd = ({ data }: { data: Record<string, unknown> }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);

export const JsonLdBlock = ({ children }: { children: ReactNode }) => <>{children}</>;
