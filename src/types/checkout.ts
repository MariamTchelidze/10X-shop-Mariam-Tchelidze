// შეკვეთის ფორმაში გამოყენებულ ველებსა და demo გადახდის ვარიანტებს განსაზღვრავს.
export interface CheckoutValues {
  fullName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  paymentMethod: "mithril-card" | "shire-gate";
}
