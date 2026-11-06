// პროფილის სახელისა და ელფოსტის შესაცვლელ ნაწილს აჩვენებს.
import type { FormEvent } from "react";
import { ThemeToggle } from "../../../components/ThemeToggle/ThemeToggle";
import { SectionPanel } from "./SectionPanel";
import { ProfileField } from "./ProfileField";

interface GeneralSettingsSectionProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  errors: Partial<Record<"firstName" | "lastName" | "email" | "phone", string>>;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onSave: () => void;
  onClearLocalData: () => void;
}

export function GeneralSettingsSection({
  firstName,
  lastName,
  email,
  phone,
  errors,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onPhoneChange,
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
      <form onSubmit={handleSubmit} noValidate className="grid w-full min-w-0 max-w-full gap-6 sm:max-w-xl">
        <ProfileField
          id="profile-first-name"
          label="First name"
          autoComplete="given-name"
          minLength={2}
          value={firstName}
          error={errors.firstName}
          onChange={onFirstNameChange}
        />
        <ProfileField
          id="profile-last-name"
          label="Last name"
          autoComplete="family-name"
          minLength={2}
          value={lastName}
          error={errors.lastName}
          onChange={onLastNameChange}
        />
        <ProfileField
          id="profile-email"
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          error={errors.email}
          onChange={onEmailChange}
        />
        <ProfileField
          id="profile-phone"
          label="Phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          value={phone}
          error={errors.phone}
          onChange={onPhoneChange}
        />
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-4 border-y border-market-border py-3">
          <div>
            <h3 className="font-display text-sm text-market-ink">Appearance</h3>
            <p className="mt-1 text-xs text-market-muted">Choose the light of the Shire or the dark of Mordor.</p>
          </div>
          <ThemeToggle showLabel />
        </div>
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
