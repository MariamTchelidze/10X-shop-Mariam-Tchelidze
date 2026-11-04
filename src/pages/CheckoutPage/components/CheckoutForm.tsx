// შეკვეთის საკონტაქტო და მისამართის ველებს კონტროლირებულ ფორმად აჩვენებს.
import type { FormEvent } from "react";
import type { CheckoutErrors, CheckoutValues } from "../../../types/checkout";

interface CheckoutFormProps {
  values: CheckoutValues;
  errors: CheckoutErrors;
  onFieldChange: (field: keyof CheckoutValues, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

interface CheckoutFieldProps {
  id: keyof CheckoutValues;
  label: string;
  value: string;
  error?: string;
  type?: "text" | "email";
  autoComplete: string;
  onChange: (value: string) => void;
}

function CheckoutField({
  id,
  label,
  value,
  error,
  type = "text",
  autoComplete,
  onChange,
}: CheckoutFieldProps) {
  // ველის ID-სთან შეხამებული error ID ეკრანის წამკითხველისთვის გამოიყენება.
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-xs uppercase tracking-[0.14em] text-market-muted">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-12 w-full border-b border-market-border bg-transparent px-1 text-sm text-market-ink outline-none transition-colors focus:border-market-ink"
      />
      {error && <p id={errorId} className="mt-2 text-sm text-error" role="alert">{error}</p>}
    </div>
  );
}

export function CheckoutForm({ values, errors, onFieldChange, onSubmit }: CheckoutFormProps) {
  // საერთო props-ის შემქმნელი თითოეული ველის მონაცემებს ფორმის მდგომარეობას უკავშირებს.
  const fieldProps = (id: keyof CheckoutValues, label: string, autoComplete: string, type?: "text" | "email") => ({
    id,
    label,
    autoComplete,
    type,
    value: values[id],
    error: errors[id],
    onChange: (value: string) => onFieldChange(id, value),
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <CheckoutField {...fieldProps("fullName", "Full name", "name")} />
      <CheckoutField {...fieldProps("email", "Email", "email", "email")} />
      <CheckoutField {...fieldProps("address", "Address", "street-address")} />
      <CheckoutField {...fieldProps("city", "City", "address-level2")} />
      <button
        type="submit"
        className="min-h-12 w-full bg-market-ink px-5 text-xs font-medium uppercase tracking-[0.14em] text-market-paper transition-colors hover:bg-market-muted focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-market-ink sm:w-auto sm:min-w-64"
      >
        Place order
      </button>
    </form>
  );
}
