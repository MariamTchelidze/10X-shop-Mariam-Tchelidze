import { useState, type FormEvent } from "react";
import { useToast } from "../../context/ToastContext";

const STORAGE_KEY = "middle-earth-eagle-post";

interface SavedSubscription {
  email: string;
  subscribedAt: string;
}

function readSubscription(): SavedSubscription | null {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    if (typeof value === "object" && value !== null && "email" in value && typeof value.email === "string" && "subscribedAt" in value && typeof value.subscribedAt === "string") {
      return { email: value.email, subscribedAt: value.subscribedAt };
    }
  } catch {
    return null;
  }
  return null;
}

export function EaglePostPanel() {
  const savedSubscription = readSubscription();
  const [email, setEmail] = useState(savedSubscription?.email ?? "");
  const [isSubscribed, setIsSubscribed] = useState(Boolean(savedSubscription));
  const { addToast } = useToast();

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return;

    try {
      const subscription: SavedSubscription = { email: normalizedEmail, subscribedAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(subscription));
      setEmail(normalizedEmail);
      setIsSubscribed(true);
      addToast("YOUR SCROLL HAS BEEN CARRIED BY THE EAGLES", "success");
    } catch {
      addToast("THE SCROLL COULD NOT BE SAVED. PLEASE TRY AGAIN.", "error");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="font-display text-lg text-market-ink">Dispatch via Great Eagles</p>
        <p className="mt-1 text-sm leading-6 text-market-muted">Receive realm updates and secret scrolls.</p>
      </div>
      {isSubscribed ? (
        <div role="status" className="border border-gold/50 bg-market-surface p-4">
          <p className="font-display text-sm text-market-ink">Your scroll is in flight.</p>
          <p className="mt-2 break-all text-xs text-market-muted">Subscribed as {email}</p>
          <button type="button" onClick={() => setIsSubscribed(false)} className="mt-3 min-h-11 text-xs uppercase tracking-widest text-market-muted underline underline-offset-4 hover:text-market-ink">Change email</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <label htmlFor="eagle-post-email" className="sr-only">Realm email</label>
          <input
            id="eagle-post-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your realm email..."
            className="min-h-12 w-full border border-market-border bg-market-paper px-3 text-sm text-market-ink outline-none placeholder:text-market-muted focus:border-gold focus:ring-1 focus:ring-gold"
          />
          <button type="submit" className="min-h-12 w-full bg-market-ink px-4 text-xs font-medium uppercase tracking-[0.14em] text-market-paper transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">Dispatch</button>
        </form>
      )}
    </div>
  );
}
