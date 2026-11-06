// მიწოდების ფორმას Formik-ის საერთო მდგომარეობასა და ვალიდაციასთან აკავშირებს.
import type { FormikProps } from "formik";
import type { CheckoutValues } from "../../../types/checkout";

interface CheckoutFormProps {
  formik: FormikProps<CheckoutValues>;
  submitError?: string;
}

type TextFieldName = "fullName" | "email" | "address" | "city" | "postalCode";

interface CheckoutFieldProps {
  formik: FormikProps<CheckoutValues>;
  id: TextFieldName;
  label: string;
  autoComplete: string;
  type?: "text" | "email";
}

function CheckoutField({ formik, id, label, autoComplete, type = "text" }: CheckoutFieldProps) {
  // ველის ID-სთან შეხამებული error ID ეკრანის წამკითხველისთვის გამოიყენება.
  const errorId = `${id}-error`;
  const error = formik.touched[id] ? formik.errors[id] : undefined;

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-xs uppercase tracking-[0.14em] text-market-muted">{label}</label>
      <input
        id={id}
        name={id}
        type={type}
        value={formik.values[id]}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={`min-h-12 w-full border-b bg-transparent px-1 text-sm text-market-ink outline-none transition-colors focus:border-market-ink ${error ? "border-red-500 ring-1 ring-red-500" : "border-market-border"}`}
      />
      {error && <p id={errorId} className="mt-2 text-sm text-error" role="alert">{error}</p>}
    </div>
  );
}

export function CheckoutForm({ formik, submitError }: CheckoutFormProps) {
  // გადახდის არჩევანი დემოა და რეალურ ბარათის ნომერს ან უსაფრთხოების კოდს არ ითხოვს.
  const paymentError = formik.touched.paymentMethod ? formik.errors.paymentMethod : undefined;

  return (
    <form onSubmit={formik.handleSubmit} noValidate className="space-y-6">
      <CheckoutField formik={formik} id="fullName" label="Full name" autoComplete="name" />
      <CheckoutField formik={formik} id="email" label="Email" autoComplete="email" type="email" />
      <CheckoutField formik={formik} id="address" label="Address" autoComplete="street-address" />
      <div className="grid min-w-0 gap-6 sm:grid-cols-2">
        <CheckoutField formik={formik} id="city" label="City" autoComplete="address-level2" />
        <CheckoutField formik={formik} id="postalCode" label="Postal code" autoComplete="postal-code" />
      </div>
      <div>
        <label htmlFor="paymentMethod" className="mb-2 block text-xs uppercase tracking-[0.14em] text-market-muted">Payment method</label>
        <select
          id="paymentMethod"
          name="paymentMethod"
          value={formik.values.paymentMethod}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          aria-invalid={Boolean(paymentError)}
          aria-describedby={paymentError ? "paymentMethod-error" : undefined}
          className={`min-h-12 w-full border-b bg-primary px-1 text-sm text-primary outline-none transition-colors focus:border-market-ink ${paymentError ? "border-red-500 ring-1 ring-red-500" : "border-market-border"}`}
        >
          <option value="mithril-card">Mithril card (demo)</option>
          <option value="shire-gate">Pay at the Shire gate (demo)</option>
        </select>
        {paymentError && <p id="paymentMethod-error" className="mt-2 text-sm text-error" role="alert">{paymentError}</p>}
        <p className="mt-2 text-xs leading-5 text-market-muted">Demo checkout only. No real payment details are collected.</p>
      </div>
      {submitError && <p role="alert" className="text-sm text-error">{submitError}</p>}
      <button
        type="submit"
        disabled={formik.isSubmitting}
        className="min-h-12 w-full bg-market-ink px-5 text-xs font-medium uppercase tracking-[0.14em] text-market-paper transition-colors hover:bg-market-muted focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-market-ink disabled:cursor-wait disabled:opacity-60 sm:w-auto sm:min-w-64"
      >
        {formik.isSubmitting ? "Placing order…" : "Place order"}
      </button>
    </form>
  );
}
