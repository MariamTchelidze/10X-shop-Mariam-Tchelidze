import { useState, type FormEvent } from "react";

const SUBSCRIPTION_KEY = "middle-market-eagle-post-email";

function readSubscription(): string {
  try {
    return localStorage.getItem(SUBSCRIPTION_KEY) ?? "";
  } catch {
    return "";
  }
}

interface EaglePostPanelProps {
  onClose: () => void;
}

export function EaglePostPanel({ onClose }: EaglePostPanelProps) {
  const [email, setEmail] = useState("");
  const [subscribedEmail, setSubscribedEmail] = useState(readSubscription);

  const handleSubscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return;
    try {
      localStorage.setItem(SUBSCRIPTION_KEY, normalizedEmail);
    } catch {
      // Keep the current-session confirmation if browser storage is unavailable.
    }
    setSubscribedEmail(normalizedEmail);
  };

  return (
    <section className="border border-gold/60 bg-market-paper text-market-ink shadow-2xl">
      <header className="flex items-start justify-between gap-4 border-b border-market-border px-4 py-4 sm:px-5">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gold/60 text-gold"><EagleMark /></span>
          <div>
            <h2 className="font-display text-sm uppercase tracking-[0.1em]">Eagle Post</h2>
            <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-market-muted">Dispatch via Great Eagles</p>
          </div>
        </div>
        <button type="button" onClick={onClose} aria-label="Close Eagle Post" className="inline-flex h-8 w-8 shrink-0 items-center justify-center text-xl text-market-muted hover:text-market-ink focus-visible:outline-2 focus-visible:outline-gold">×</button>
      </header>

      <div className="p-4 sm:p-5">
        {subscribedEmail ? (
          <div role="status" className="py-2">
            <p className="font-display text-base text-gold">Your scroll has been carried by the Eagles!</p>
            <p className="mt-2 break-all text-xs text-market-muted">Dispatches will find {subscribedEmail}.</p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm leading-6 text-market-muted">Receive realm updates &amp; secret scrolls.</p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2 sm:flex-row">
              <label htmlFor="eagle-post-email" className="sr-only">Your realm email</label>
              <input id="eagle-post-email" type="email" name="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter your realm email..." className="min-h-11 min-w-0 flex-1 border border-market-border bg-primary px-3 text-sm text-primary outline-none placeholder:text-market-muted focus:border-gold" />
              <button type="submit" className="min-h-11 shrink-0 bg-market-ink px-5 text-[10px] font-medium uppercase tracking-[0.14em] text-market-paper transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">Dispatch</button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}

export function EagleMark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11c4.4.3 7.4 2.1 10.1 5.3L16 20l2.9-3.7C21.6 13.1 24.6 11.3 29 11c-3.2 2.2-5.3 4.5-7.2 7.6L19 23h-6l-2.8-4.4C8.3 15.5 6.2 13.2 3 11Z" />
      <path d="M9 13.5 16 21l7-7.5M12 16l4 7 4-7" />
    </svg>
  );
}
