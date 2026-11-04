// პროფილის სექციების, მისამართების, დაბრუნებისა და ბარათის ტიპებს განსაზღვრავს.
export type ProfileSectionId = "general" | "addresses" | "purchases" | "refunds" | "cards";

export interface ProfileAddress {
  id: string;
  country: string;
  city: string;
  street: string;
  postalCode: string;
}

export type ProfileAddressForm = Omit<ProfileAddress, "id">;

export interface RefundRequest {
  id: string;
  bankName: string;
  accountHolder: string;
  iban: string;
  submittedAt: string;
  status: "Submitted";
}

export interface SavedCard {
  id: string;
  holder: string;
  lastFour: string;
  expiry: string;
}

export type RefundFormValues = Pick<RefundRequest, "bankName" | "accountHolder" | "iban">;

export interface CardFormValues {
  holder: string;
  number: string;
  expiry: string;
}
