// რეგიონების კურსით თანხას გარდაქმნის და ვალუტის სახით აფორმატებს.
import type { Realm } from "../../../types/realm";

export function convertRealmCurrency(amount: number, source: Realm, target: Realm): number {
  // საერთო კურსთან შეფარდებით ჯერ საწყის ერთეულს ვაბრუნებთ, შემდეგ სამიზნე კურსს ვამრავლებთ.
  if (!Number.isFinite(amount) || amount < 0 || source.multiplier <= 0) return 0;
  return (amount / source.multiplier) * target.multiplier;
}

export function formatRealmAmount(amount: number, realm: Realm): string {
  // შედეგს ორი ათწილადით და არჩეული რეგიონის ვალუტის ნიშნით ვაჩვენებთ.
  const formatted = new Intl.NumberFormat("en", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${realm.currencySymbol} ${formatted}`;
}
