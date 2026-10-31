import type { Realm } from "../../../context/RealmContext";

export function convertRealmCurrency(amount: number, source: Realm, target: Realm): number {
  if (!Number.isFinite(amount) || amount < 0 || source.multiplier <= 0) return 0;
  return (amount / source.multiplier) * target.multiplier;
}

export function formatRealmAmount(amount: number, realm: Realm): string {
  const formatted = new Intl.NumberFormat("en", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${realm.currencySymbol} ${formatted}`;
}
