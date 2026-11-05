import { useEffect, useMemo, useState } from "react";
import { REALMS, useRealm } from "../../context/RealmContext";

function formatAmount(value: number): string {
  return new Intl.NumberFormat("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}

export function VaultCalculatorPanel() {
  const { realm } = useRealm();
  const [sourceId, setSourceId] = useState(realm.id);
  const [targetId, setTargetId] = useState(realm.id === "shire" ? "rivendell" : "shire");
  const [amount, setAmount] = useState("100");

  useEffect(() => setSourceId(realm.id), [realm.id]);

  const source = REALMS.find((option) => option.id === sourceId) ?? REALMS[0];
  const target = REALMS.find((option) => option.id === targetId) ?? REALMS[0];
  const numericAmount = Number(amount);
  const converted = useMemo(
    () => Number.isFinite(numericAmount) && numericAmount >= 0
      ? (numericAmount / source.multiplier) * target.multiplier
      : null,
    [numericAmount, source.multiplier, target.multiplier],
  );

  return (
    <div className="space-y-4">
      <div>
        <p className="font-display text-lg text-market-ink">The Mithril Vault</p>
        <p className="mt-1 text-sm leading-6 text-market-muted">Exchange estimates use the realm rates from the selector.</p>
      </div>
      <label htmlFor="vault-amount" className="grid gap-2 text-[10px] uppercase tracking-[0.14em] text-market-muted">
        Amount
        <input id="vault-amount" type="number" min="0" step="0.01" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} className="min-h-12 w-full border border-market-border bg-market-paper px-3 text-sm text-market-ink outline-none focus:border-gold focus:ring-1 focus:ring-gold" />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label htmlFor="vault-source" className="grid min-w-0 gap-2 text-[10px] uppercase tracking-[0.12em] text-market-muted">
          From
          <select id="vault-source" value={sourceId} onChange={(event) => setSourceId(event.target.value)} className="min-h-12 min-w-0 border border-market-border bg-market-paper px-2 text-xs text-market-ink outline-none focus:border-gold">
            {REALMS.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
          </select>
        </label>
        <label htmlFor="vault-target" className="grid min-w-0 gap-2 text-[10px] uppercase tracking-[0.12em] text-market-muted">
          To
          <select id="vault-target" value={targetId} onChange={(event) => setTargetId(event.target.value)} className="min-h-12 min-w-0 border border-market-border bg-market-paper px-2 text-xs text-market-ink outline-none focus:border-gold">
            {REALMS.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
          </select>
        </label>
      </div>
      <output className="block border border-gold/50 bg-market-surface p-4" aria-live="polite">
        <span className="block text-[10px] uppercase tracking-[0.16em] text-market-muted">Realm estimate</span>
        <span className="mt-2 block font-display text-xl text-market-ink">{converted === null ? "Enter a valid amount" : `${target.currencySymbol} ${formatAmount(converted)}`}</span>
        {converted !== null && <span className="mt-1 block text-xs text-market-muted">{formatAmount(numericAmount)} {source.currencyName} → {target.currencyName} · {(target.multiplier / source.multiplier).toFixed(2)}×</span>}
      </output>
    </div>
  );
}
