import { useState, type FormEvent } from "react";
import { getStockAlertEmails, subscribeToStockAlert } from "./utils/stockAlertStorage";

interface StockAlertFormProps {
  productId: number;
  productTitle: string;
}

type FormStatus = "editing" | "saved";

export function StockAlertForm({ productId, productTitle }: StockAlertFormProps) {
  const [savedEmail] = useState(() => {
    const savedEmails = getStockAlertEmails(productId);
    return savedEmails[savedEmails.length - 1] ?? "";
  });
  const [email, setEmail] = useState(savedEmail);
  const [status, setStatus] = useState<FormStatus>(savedEmail ? "saved" : "editing");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError("Enter your email address to receive a raven's message.");
      return;
    }

    try {
      subscribeToStockAlert(productId, normalizedEmail);
      setEmail(normalizedEmail);
      setStatus("saved");
      setError("");
    } catch {
      setError("Your alert could not be saved. Please try again.");
    }
  };

  if (status === "saved") {
    return (
      <div role="status" className="border border-gold/50 bg-market-surface p-5 sm:p-6">
        <p className="text-[10px] uppercase tracking-[0.16em] text-gold">Raven dispatch confirmed</p>
        <h3 className="mt-3 font-display text-xl text-market-ink">You are on the watch list</h3>
        <p className="mt-2 break-all text-sm leading-6 text-market-muted">
          A raven will carry word when <span className="text-market-ink">{productTitle}</span> returns. Dispatch to {email}.
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("editing");
            setEmail("");
          }}
          className="mt-4 min-h-10 text-xs uppercase tracking-[0.12em] text-market-muted underline underline-offset-4 transition-colors hover:text-market-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm leading-6 text-market-muted">
        Leave your realm email. A raven will bring word when this treasure returns.
      </p>
      <label htmlFor={`stock-alert-email-${productId}`} className="grid gap-2 text-[10px] uppercase tracking-[0.14em] text-market-muted">
        Realm email
        <input
          id={`stock-alert-email-${productId}`}
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setError("");
          }}
          placeholder="you@middleearth.com"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `stock-alert-error-${productId}` : undefined}
          className="min-h-12 w-full border border-market-border bg-primary px-3 text-sm text-primary outline-none transition-colors placeholder:text-market-muted focus:border-gold"
        />
      </label>
      {error && <p id={`stock-alert-error-${productId}`} role="alert" className="text-sm text-error">{error}</p>}
      <button
        type="submit"
        className="min-h-12 w-full bg-market-ink px-5 text-xs font-medium uppercase tracking-[0.14em] text-market-paper transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
      >
        Send a Raven
      </button>
    </form>
  );
}
