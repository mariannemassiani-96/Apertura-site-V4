import { ReactNode } from "react";

export const Section = ({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLElement>) => (
  <section className={className} {...props}>
    {children}
  </section>
);
