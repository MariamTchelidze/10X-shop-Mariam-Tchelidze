import type { FormEvent } from "react";
import { SectionPanel } from "./SectionPanel";
import { ProfileField } from "./ProfileField";

interface GeneralSettingsSectionProps {
  name: string;
  email: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onSave: () => void;
}

export function GeneralSettingsSection({
  name,
  email,
  onNameChange,
  onEmailChange,
  onSave,
}: GeneralSettingsSectionProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave();
  };

  return (
    <SectionPanel
      title="General settings"
      intro="Manage your personal details for your journey through the realm."
    >
      <form onSubmit={handleSubmit} className="grid gap-6 sm:max-w-xl">
        <ProfileField
          id="profile-name"
          label="Full name"
          autoComplete="name"
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
      </form>
    </SectionPanel>
  );
}
