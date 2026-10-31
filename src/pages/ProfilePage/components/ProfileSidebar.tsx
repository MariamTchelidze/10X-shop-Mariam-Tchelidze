import type { ProfileSectionId } from "../profileTypes";

interface ProfileSidebarProps {
  activeSection: ProfileSectionId;
  onSectionChange: (section: ProfileSectionId) => void;
  onSignOut: () => void;
}

const sections: { id: ProfileSectionId; label: string }[] = [
  { id: "general", label: "General settings" },
  { id: "addresses", label: "My addresses" },
  { id: "purchases", label: "My purchases" },
  { id: "refunds", label: "Refunds" },
  { id: "cards", label: "My cards" },
];

export function ProfileSidebar({
  activeSection,
  onSectionChange,
  onSignOut,
}: ProfileSidebarProps) {
  return (
    <aside className="h-fit md:sticky md:top-28">
      <p className="mb-3 hidden text-[10px] uppercase tracking-[0.16em] text-market-muted md:block">
        Account menu
      </p>
      <nav
        aria-label="Profile sections"
        className="flex gap-2 overflow-x-auto border-b border-market-border pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-col md:gap-0 md:overflow-visible md:border-b-0 md:border-t md:pb-0"
      >
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onSectionChange(section.id)}
              aria-current={isActive ? "page" : undefined}
              className={`min-h-11 shrink-0 border-b-2 px-3 text-left text-[10px] uppercase tracking-[0.1em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold md:w-full md:border-b md:border-l-2 md:border-r-0 md:border-t-0 md:px-4 md:text-xs ${isActive ? "border-gold bg-market-surface text-market-ink" : "border-transparent text-market-muted hover:text-market-ink"}`}
            >
              {section.label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={onSignOut}
          className="min-h-11 shrink-0 border-b-2 border-transparent px-3 text-left text-[10px] uppercase tracking-[0.1em] text-market-muted transition-colors hover:text-market-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold md:mt-4 md:w-full md:border-t md:border-b-0 md:border-market-border md:border-l-2 md:px-4 md:text-xs"
        >
          Sign out
        </button>
      </nav>
    </aside>
  );
}
