import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useRealm } from "../../context/RealmContext";
import { useInventory } from "../../context/InventoryContext";
import type { Order } from "../../types/order";
import { saveOrder } from "../../utils/orders";
import { CheckoutForm } from "./components/CheckoutForm";
import { OrderSummary } from "./components/OrderSummary";
import type { CheckoutErrors, CheckoutValues } from "../../types/checkout";

const emptyValues: CheckoutValues = {
  fullName: "",
  email: "",
  address: "",
  city: "",
};

export function CheckoutPage() {
  const { items, subtotal } = useCart();
  const { user } = useAuth();
  const { decrementStock } = useInventory();
  const { formatCurrency } = useRealm();
  const navigate = useNavigate();
  const [values, setValues] = useState<CheckoutValues>(emptyValues);
  const [errors, setErrors] = useState<CheckoutErrors>({});

  if (items.length === 0) {
    return <Navigate to="/cart" replace state={{ message: "Your cart is empty." }} />;
  }

  const updateField = (field: keyof CheckoutValues, value: string): void => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const fullName = values.fullName.trim();
    const email = values.email.trim();
    const address = values.address.trim();
    const city = values.city.trim();
    const nextErrors: CheckoutErrors = {};

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
    if (Object.keys(nextErrors).length > 0) return;

    const order: Order = {
      id: `MM-${Date.now().toString(36).toUpperCase()}`,
      username: user.username,
      date: new Date().toISOString(),
      items: items.map((item) => ({ ...item })),
      total: subtotal,
      status: "Placed",
      subtotal,
      shipping: 0,
      taxes: 0,
      shippingAddress: { fullName, email, address, city },
      paymentMethod: "Demo checkout — no payment collected",
    };
    saveOrder(order);
    decrementStock(items);
    navigate("/order-success", { replace: true, state: { order } });
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <h1 className="mb-8 border-b border-market-border pb-5 font-display text-3xl text-market-ink sm:mb-10 sm:text-4xl">
        Checkout
      </h1>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
        <CheckoutForm
          values={values}
          errors={errors}
          onFieldChange={updateField}
          onSubmit={handleSubmit}
        />
        <OrderSummary items={items} subtotal={subtotal} formatCurrency={formatCurrency} />
      </div>
    </main>
  );
}
