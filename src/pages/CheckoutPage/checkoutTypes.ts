export interface CheckoutValues {
  fullName: string;
  email: string;
  address: string;
  city: string;
}

export interface CheckoutErrors {
  fullName?: string;
  email?: string;
  address?: string;
  city?: string;
}
