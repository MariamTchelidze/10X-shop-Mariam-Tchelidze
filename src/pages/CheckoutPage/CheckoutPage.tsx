import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useRealm } from "../../context/RealmContext";
import { saveOrder } from "../../utils/orders";
import type { Order } from "../../types/order";

interface CheckoutValues {
  fullName: string;
  email: string;
  address: string;
  city: string;
}

interface CheckoutErrors {
  fullName?: string;
  email?: string;
  address?: string;
  city?: string;
}

const emptyValues: CheckoutValues = {
  fullName: "",
  email: "",
  address: "",
  city: "",
};

export function CheckoutPage() {
  const { items, subtotal } = useCart();
  const { user } = useAuth();
  const { formatCurrency } = useRealm();
  const navigate = useNavigate();
  const [values, setValues] = useState<CheckoutValues>(emptyValues);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  if (items.length === 0) {
    return <Navigate to="/cart" replace state={{ message: "Your cart is empty." }} />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const nextErrors: CheckoutErrors = {};
    const fullName = values.fullName.trim();
    const email = values.email.trim();
    const address = values.address.trim();
    const city = values.city.trim();

    if (fullName.length < 3) {
      nextErrors.fullName = "Full name must be at least 3 characters";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Please enter a valid email address";
    }
    if (address.length < 5) {
      nextErrors.address = "Address must be at least 5 characters";
    }
    if (!city) {
      nextErrors.city = "City is required";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const orderTotal = subtotal;
    const order: Order = {
      id: `MM-${Date.now().toString(36).toUpperCase()}`,
      username: user.username,
      date: new Date().toISOString(),
      items: items.map((item) => ({ ...item })),
      total: orderTotal,
      status: "Placed",
      subtotal,
      shipping: 0,
      taxes: 0,
      shippingAddress: { fullName, email, address, city },
      paymentMethod: "Demo checkout — no payment collected",
    };
    saveOrder(order);
    navigate("/order-success", { replace: true, state: { order } });
  };

  const updateField = (field: keyof CheckoutValues, value: string): void => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <h1 className="mb-8 border-b border-market-border pb-5 font-display text-3xl text-market-ink sm:mb-10 sm:text-4xl">
        Checkout
      </h1>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <CheckoutField
            id="fullName"
            label="Full name"
            value={values.fullName}
            error={errors.fullName}
            autoComplete="name"
            onChange={(value) => updateField("fullName", value)}
          />
          <CheckoutField
            id="email"
            label="Email"
            type="email"
            value={values.email}
            error={errors.email}
            autoComplete="email"
            onChange={(value) => updateField("email", value)}
          />
          <CheckoutField
            id="address"
            label="Address"
            value={values.address}
            error={errors.address}
            autoComplete="street-address"
            onChange={(value) => updateField("address", value)}
          />
          <CheckoutField
            id="city"
            label="City"
            value={values.city}
            error={errors.city}
            autoComplete="address-level2"
            onChange={(value) => updateField("city", value)}
          />
          <button
            type="submit"
            className="min-h-12 w-full bg-market-ink px-5 text-xs font-medium uppercase tracking-[0.14em] text-market-paper transition-colors hover:bg-market-muted focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-market-ink sm:w-auto sm:min-w-64"
          >
            Place order
          </button>
        </form>

        <aside className="h-fit border border-market-border p-5 sm:p-6">
          <h2 className="font-display text-2xl text-market-ink">Order summary</h2>
          <ul className="mt-5 space-y-3 border-b border-market-border pb-5">
            {items.map((item) => (
              <li key={item.productId} className="flex justify-between gap-4 text-sm">
                <span className="text-market-muted">{item.title} × {item.quantity}</span>
                <span className="shrink-0 text-market-ink">
                  {formatCurrency(item.price * (1 - item.discountPercentage / 100) * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between gap-4 text-sm text-market-muted">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="mt-4 flex justify-between gap-4 border-t border-market-border pt-4 text-sm font-medium text-market-ink">
            <span>Total</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
        </aside>
      </div>
    </main>
  );
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
