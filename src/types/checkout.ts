export interface CheckoutValues {
  fullName: string;
  email: string;
  address: string;
  city: string;
}

export type CheckoutErrors = Partial<Record<keyof CheckoutValues, string>>;
