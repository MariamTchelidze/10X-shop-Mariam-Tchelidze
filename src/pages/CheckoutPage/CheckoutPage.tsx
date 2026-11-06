// შეკვეთის ფორმას ვალიდაციას უკეთებს, შეკვეთას ინახავს და მარაგს ამცირებს.
import { useRef, useState } from "react";
import { useFormik } from "formik";
import { Navigate, useNavigate } from "react-router";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useRealm } from "../../context/RealmContext";
import { useInventory } from "../../context/InventoryContext";
import type { CheckoutValues } from "../../types/checkout";
import type { Order } from "../../types/order";
import { createOrderId, saveOrder } from "../../utils/orders";
import { checkoutSchema } from "../../validation/checkoutSchema";
import { CheckoutForm } from "./components/CheckoutForm";
import { OrderSummary } from "./components/OrderSummary";

const emptyValues: CheckoutValues = {
  fullName: "",
  email: "",
  address: "",
  city: "",
  postalCode: "",
  paymentMethod: "mithril-card",
};

export function CheckoutPage() {
  const { items, subtotal, discount, total, promoCode } = useCart();
  const { user } = useAuth();
  const { decrementStock } = useInventory();
  const { formatPrice } = useRealm();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string>();
  const submissionLock = useRef(false);

  const formik = useFormik<CheckoutValues>({
    initialValues: emptyValues,
    validationSchema: checkoutSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values, helpers) => {
      if (submissionLock.current) return;
      submissionLock.current = true;
      setSubmitError(undefined);

      // შეკვეთის ჯამში CartContext-ის promo ფასდაკლებაც შედის.
      const order: Order = {
        id: createOrderId(),
        username: user.username,
        date: new Date().toISOString(),
        items: items.map((item) => ({ ...item })),
        total,
        subtotal,
        discount,
        promoCode,
        shipping: 0,
        taxes: 0,
        shippingAddress: {
          fullName: values.fullName.trim(),
          email: values.email.trim(),
          address: values.address.trim(),
          city: values.city.trim(),
          postalCode: values.postalCode.trim(),
        },
        paymentMethod: values.paymentMethod === "mithril-card"
          ? "Mithril card (demo) — no payment collected"
          : "Pay at the Shire gate (demo) — no payment collected",
      };

      if (!saveOrder(order)) {
        submissionLock.current = false;
        setSubmitError("Unable to save your order in browser storage. Please try again.");
        helpers.setSubmitting(false);
        return;
      }

      decrementStock(items);
      navigate("/order-success", { replace: true, state: { order } });
    },
  });

  if (items.length === 0) {
    // უშინაარსო შეკვეთის თავიდან ასაცილებლად ცარიელი კალათა უკან გადადის.
    return <Navigate to="/cart" replace state={{ message: "Your cart is empty." }} />;
  }

  return (
    <main className="mx-auto w-full min-w-0 max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <h1 className="mb-8 border-b border-market-border pb-5 font-display text-3xl text-market-ink sm:mb-10 sm:text-4xl">
        Checkout
      </h1>
      <div className="grid min-w-0 gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
        <CheckoutForm formik={formik} submitError={submitError} />
        <OrderSummary
          items={items}
          subtotal={subtotal}
          discount={discount}
          total={total}
          promoCode={promoCode}
          formatPrice={formatPrice}
        />
      </div>
    </main>
  );
}
