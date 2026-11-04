// კალათის ჯამს, პრომოკოდსა და შეკვეთაზე გადასვლის ბმულს მართავს.
import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { useToast } from "../../../context/ToastContext";

interface CartSummaryProps {
  subtotal: number;
  discount: number;
  total: number;
  promoCode: string | null;
  onApplyPromoCode: (code: string) => boolean;
  onRemovePromoCode: () => void;
  formatCurrency: (amount: number) => string;
}

export function CartSummary({ subtotal, discount, total, promoCode, onApplyPromoCode, onRemovePromoCode, formatCurrency }: CartSummaryProps) {
  const { addToast } = useToast();
  const [promoInput, setPromoInput] = useState(promoCode ?? "");
  const [promoError, setPromoError] = useState("");

  const handleApplyPromoCode = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // მოქმედი კოდი CartContext-ში ინახება და Checkout-შიც იმავე ჯამს იყენებს.
    if (!onApplyPromoCode(promoInput)) {
      setPromoError("This promo code is not valid.");
      addToast("INVALID PROMO CODE", "error");
      return;
    }
    setPromoError("");
    addToast("PROMO CODE APPLIED (-10%)", "success");
  };

  return (
    <aside className="h-fit border border-market-border p-5 sm:p-6">
      <h2 className="font-display text-2xl text-market-ink">Order summary</h2>
      <div className="mt-6 flex justify-between gap-4 text-sm text-market-muted">
        <span>Subtotal</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>
      <form onSubmit={handleApplyPromoCode} className="mt-6">
        <label htmlFor="promo-code" className="mb-2 block text-xs uppercase tracking-[0.12em] text-market-muted">
          Promo code
        </label>
        <div className="flex min-w-0 gap-2">
          <input
            id="promo-code"
            name="promoCode"
            value={promoInput}
            onChange={(event) => {
              setPromoInput(event.target.value);
              setPromoError("");
            }}
            aria-invalid={promoError.length > 0}
            aria-describedby={promoError ? "promo-error" : undefined}
            placeholder="Enter code"
            className="min-h-11 min-w-0 flex-1 border border-market-border bg-primary px-3 text-sm uppercase text-primary placeholder:normal-case placeholder:text-market-muted focus:border-market-ink focus:outline-none"
          />
          <button
            type="submit"
            className="min-h-11 shrink-0 border border-market-ink px-4 text-xs font-medium uppercase tracking-[0.12em] text-market-ink transition-colors hover:bg-market-ink hover:text-market-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-market-ink"
          >
            Apply
          </button>
        </div>
        {promoError && <p id="promo-error" role="alert" className="mt-2 text-xs text-error">{promoError}</p>}
      </form>
      {promoCode && (
        <div className="mt-4 flex justify-between gap-4 text-sm text-market-muted">
          <span>Discount ({promoCode} −10%)</span>
          <span>−{formatCurrency(discount)}</span>
        </div>
      )}
      <div className="mt-4 flex justify-between gap-4 text-sm text-market-muted">
        <span>Shipping</span>
        <span>Complimentary</span>
      </div>
      <div className="mt-4 flex justify-between gap-4 border-t border-market-border pt-4 text-sm font-medium text-market-ink">
        <span>Total</span>
        <span>{formatCurrency(total)}</span>
      </div>
      {promoCode && (
        <button
          type="button"
          onClick={() => {
            onRemovePromoCode();
            setPromoInput("");
          }}
          className="mt-3 text-xs text-market-muted underline underline-offset-4 hover:text-market-ink"
        >
          Remove promo code
        </button>
      )}
      <Link
        to="/checkout"
        className="mt-6 flex min-h-12 items-center justify-center bg-market-ink px-5 text-center text-xs uppercase tracking-[0.12em] text-market-paper transition-colors hover:bg-market-muted focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-market-ink"
      >
        Proceed to checkout
      </Link>
    </aside>
  );
}
