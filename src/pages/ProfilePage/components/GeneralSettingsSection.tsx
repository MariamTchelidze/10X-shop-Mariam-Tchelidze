// პროფილის სახელისა და ელფოსტის შესაცვლელ ნაწილს აჩვენებს.
import type { FormEvent } from "react";
import { SectionPanel } from "./SectionPanel";
import { ProfileField } from "./ProfileField";

interface GeneralSettingsSectionProps {
  name: string;
  email: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onSave: () => void;
  onClearLocalData: () => void;
}

export function GeneralSettingsSection({
  name,
  email,
  onNameChange,
  onEmailChange,
  onSave,
  onClearLocalData,
}: GeneralSettingsSectionProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // ველების კონტროლი მშობელ hook-შია, ამიტომ ფორმა მხოლოდ შენახვას ითხოვს.
    onSave();
  };

  return (
    <SectionPanel
      title="General settings"
      intro="Manage your personal details for your journey through the realm."
    >
      <form onSubmit={handleSubmit} className="grid w-full min-w-0 max-w-full gap-6 sm:max-w-xl">
        <ProfileField
          id="profile-name"
          label="Full name"
          autoComplete="name"
          minLength={2}
          value={name}
          onChange={onNameChange}
        />
        <ProfileField
          id="profile-email"
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={onEmailChange}
        />
        <button
          type="submit"
          className="min-h-12 bg-market-ink px-7 text-xs uppercase tracking-[0.14em] text-market-paper transition-opacity hover:opacity-80 sm:w-fit"
        >
          Save changes
        </button>
        <button
          type="button"
          onClick={onClearLocalData}
          className="min-h-11 text-left text-xs uppercase tracking-widest text-error underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error sm:w-fit"
        >
          Clear saved cart, orders &amp; reviews
        </button>
      </form>
    </SectionPanel>
  );
}
