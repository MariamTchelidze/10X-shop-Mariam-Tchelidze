import type { ReactNode } from "react";

interface SectionPanelProps {
  title: string;
  intro: string;
  children: ReactNode;
}

export function SectionPanel({ title, intro, children }: SectionPanelProps) {
  return (
    <section className="w-full min-w-0 max-w-full" aria-labelledby="profile-section-title">
      <p className="text-[10px] uppercase tracking-[0.18em] text-gold">
        Middle-earth Market · Account
      </p>
      <h2
        id="profile-section-title"
        className="mt-3 border-b border-market-border pb-5 font-display text-2xl text-market-ink sm:text-3xl"
      >
        {title}
      </h2>
      <p className="mt-5 text-sm leading-6 text-market-muted">{intro}</p>
      <div className="mt-7 w-full min-w-0 max-w-full">{children}</div>
    </section>
  );
}
