// სხვადასხვა რეგიონის ვალუტებს შორის თანხას ითვლის.
import { useState } from "react";
import { REALMS, useRealm } from "../../context/RealmContext";
import { convertRealmCurrency, formatRealmAmount } from "./utils/currencyConversion";

export function CalculatorForm() {
  const { realm } = useRealm();
  const [sourceId, setSourceId] = useState(realm.id);
  const [targetId, setTargetId] = useState(
    () => REALMS.find((option) => option.id !== realm.id)?.id ?? realm.id,
  );
  const [amount, setAmount] = useState("1");
  // არჩეული ID-ებიდან ვიღებთ რეგიონებს და მხოლოდ სწორი რიცხვითი თანხის დროს ვითვლით შედეგს.
  const sourceRealm = REALMS.find((option) => option.id === sourceId) ?? REALMS[0];
  const targetRealm = REALMS.find((option) => option.id === targetId) ?? REALMS[0];
  const numericAmount = amount.trim() === "" ? Number.NaN : Number(amount);
  const convertedAmount = Number.isFinite(numericAmount) && numericAmount >= 0
    ? convertRealmCurrency(numericAmount, sourceRealm, targetRealm)
    : null;
  const exchangeRate = convertRealmCurrency(1, sourceRealm, targetRealm);

  const swapRealms = () => {
    // ერთი განახლებით ადგილებს ვუცვლით მიმდინარე საწყის და სამიზნე რეგიონებს.
    setSourceId(targetRealm.id);
    setTargetId(sourceRealm.id);
  };

  return (
    <div className="space-y-5 p-4 sm:p-5">
      <label htmlFor="mithril-amount" className="grid gap-2 text-[10px] uppercase tracking-[0.14em] text-market-muted">
        Amount to exchange
        <input
          id="mithril-amount"
          name="amount"
          type="number"
          min="0"
          step="0.01"
          inputMode="decimal"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          className="min-h-12 w-full border border-market-border bg-primary px-3 text-base text-primary outline-none transition-colors focus:border-gold"
        />
      </label>

      <div className="grid grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,1fr)] items-end gap-2">
        <RealmSelect id="mithril-source" label="From" value={sourceId} onChange={setSourceId} />
        <button
          type="button"
          onClick={swapRealms}
          aria-label="Swap source and target realms"
          className="mb-0.5 inline-flex h-10 w-10 items-center justify-center border border-market-border text-lg text-market-ink transition-colors hover:border-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          ⇄
        </button>
        <RealmSelect id="mithril-target" label="To" value={targetId} onChange={setTargetId} />
      </div>

      <div className="border border-gold/50 bg-market-surface p-4" aria-live="polite">
        <p className="text-[10px] uppercase tracking-[0.14em] text-market-muted">You will receive</p>
        <p className="mt-2 break-words font-display text-xl text-market-ink sm:text-2xl">
          {convertedAmount === null ? "Enter an amount" : formatRealmAmount(convertedAmount, targetRealm)}
        </p>
        <p className="mt-2 text-[10px] leading-5 text-market-muted">
          1 {sourceRealm.currencyName} = {formatRealmAmount(exchangeRate, targetRealm)}
        </p>
      </div>
    </div>
  );
}

interface RealmSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (realmId: string) => void;
}

function RealmSelect({ id, label, value, onChange }: RealmSelectProps) {
  return (
    <label htmlFor={id} className="grid min-w-0 gap-2 text-[10px] uppercase tracking-[0.12em] text-market-muted">
      {label}
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-11 min-w-0 w-full border border-market-border bg-primary px-2 text-xs text-primary outline-none focus:border-gold sm:px-3"
      >
        {REALMS.map((option) => (
          <option key={option.id} value={option.id} className="bg-primary text-primary">
            {option.marker} {option.name}
          </option>
        ))}
      </select>
    </label>
  );
}
