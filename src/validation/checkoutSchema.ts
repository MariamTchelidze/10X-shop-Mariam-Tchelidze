import * as Yup from "yup";

// Checkout-ში მხოლოდ demo გადახდის არჩევანია; რეალური ბარათის მონაცემები არ გროვდება.
export const checkoutSchema = Yup.object({
  fullName: Yup.string()
    .trim()
    .min(3, "Full name must be at least 3 characters.")
    .required("Full name is required."),
  email: Yup.string()
    .trim()
    .email("Please enter a valid email address.")
    .required("Email is required."),
  address: Yup.string()
    .trim()
    .min(5, "Address must be at least 5 characters.")
    .required("Address is required."),
  city: Yup.string().trim().required("City is required."),
  postalCode: Yup.string()
    .trim()
    .matches(/^[A-Za-z0-9][A-Za-z0-9 -]{1,10}[A-Za-z0-9]$/, "Enter a valid postal code.")
    .required("Postal code is required."),
  paymentMethod: Yup.string()
    .oneOf(["mithril-card", "shire-gate"], "Choose a payment method.")
    .required("Choose a payment method."),
});
