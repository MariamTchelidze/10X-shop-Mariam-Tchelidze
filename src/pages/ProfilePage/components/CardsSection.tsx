import type { FormEvent } from "react";
import type { CardFormValues, SavedCard } from "../../../types/profile";
import { ProfileField } from "./ProfileField";
import { SectionPanel } from "./SectionPanel";

interface CardsSectionProps {
  cards: SavedCard[];
  values: CardFormValues;
  onFieldChange: (field: keyof CardFormValues, value: string) => void;
  onSubmit: () => void;
  onRemove: (id: string) => void;
}

export function CardsSection({ cards, values, onFieldChange, onSubmit, onRemove }: CardsSectionProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <SectionPanel
      title="My cards"
      intro="Manage masked card references for this local checkout demo. Full card numbers and security codes are never saved."
    >
      {cards.length > 0 && (
        <ul className="mb-8 grid gap-3 sm:grid-cols-2">
          {cards.map((card) => (
            <li key={card.id} className="border border-market-border bg-market-surface p-5">
              <p className="font-display text-sm text-market-ink">•••• •••• •••• {card.lastFour}</p>
              <p className="mt-3 text-xs uppercase tracking-widest text-market-muted">{card.holder}</p>
              <p className="mt-1 text-xs text-market-muted">Expires {card.expiry}</p>
              <button type="button" onClick={() => onRemove(card.id)} className="mt-4 text-[10px] uppercase tracking-widest text-market-muted underline underline-offset-4">
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={handleSubmit} className="grid gap-5 sm:max-w-xl">
        <ProfileField id="card-holder" label="Cardholder name" autoComplete="cc-name" value={values.holder} onChange={(value) => onFieldChange("holder", value)} />
        <ProfileField id="card-number" label="Card number" inputMode="numeric" autoComplete="cc-number" value={values.number} onChange={(value) => onFieldChange("number", value)} />
        <ProfileField id="card-expiry" label="Expiry (MM/YY)" autoComplete="cc-exp" placeholder="MM/YY" pattern="(0[1-9]|1[0-2])/[0-9]{2}" value={values.expiry} onChange={(value) => onFieldChange("expiry", value)} />
        <button type="submit" className="min-h-12 bg-market-ink px-7 text-xs uppercase tracking-[0.14em] text-market-paper sm:w-fit">
          Save card reference
        </button>
      </form>
    </SectionPanel>
  );
}
