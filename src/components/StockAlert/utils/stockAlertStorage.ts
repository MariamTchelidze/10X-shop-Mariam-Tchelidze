const STOCK_ALERTS_KEY = "middle-market-stock-alerts";

type StockAlertsByProduct = Record<string, string[]>;

function readAllStockAlerts(): StockAlertsByProduct {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STOCK_ALERTS_KEY) ?? "{}");
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return {};

    return Object.fromEntries(
      Object.entries(parsed).filter(
        ([, emails]) => Array.isArray(emails) && emails.every((email) => typeof email === "string"),
      ),
    ) as StockAlertsByProduct;
  } catch {
    return {};
  }
}

export function getStockAlertEmails(productId: number): string[] {
  return readAllStockAlerts()[String(productId)] ?? [];
}

export function subscribeToStockAlert(productId: number, email: string): void {
  const normalizedEmail = email.trim().toLowerCase();
  const subscriptions = readAllStockAlerts();
  const productKey = String(productId);
  const currentEmails = subscriptions[productKey] ?? [];

  if (currentEmails.some((savedEmail) => savedEmail.toLowerCase() === normalizedEmail)) return;

  subscriptions[productKey] = [...currentEmails, normalizedEmail];
  localStorage.setItem(STOCK_ALERTS_KEY, JSON.stringify(subscriptions));
}
