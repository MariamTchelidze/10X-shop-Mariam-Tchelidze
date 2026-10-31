import { useRef, useState } from "react";
import type { AuthUser } from "../../types/user";
import type { Order } from "../../types/order";
import { readOrders } from "../../utils/orders";
import type {
  CardFormValues,
  ProfileAddress,
  ProfileAddressForm,
  RefundFormValues,
  RefundRequest,
  SavedCard,
} from "./profileTypes";

const emptyAddress: ProfileAddressForm = {
  country: "",
  city: "",
  street: "",
  postalCode: "",
};

const emptyRefund: RefundFormValues = {
  bankName: "",
  accountHolder: "",
  iban: "",
};

const emptyCard: CardFormValues = {
  holder: "",
  number: "",
  expiry: "",
};

function readSaved<T>(key: string): T[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(value) ? (value as T[]) : [];
  } catch {
    return [];
  }
}

interface UseProfileManagementOptions {
  user: AuthUser;
  updateProfile: (details: Pick<AuthUser, "fullName" | "email" | "address">) => void;
}

export function useProfileManagement({ user, updateProfile }: UseProfileManagementOptions) {
  const storagePrefixRef = useRef(`middle-market-${user.username || user.email}`);
  const storagePrefix = storagePrefixRef.current;
  const [name, setName] = useState(user.fullName || user.username);
  const [email, setEmail] = useState(user.email);
  const [addresses, setAddresses] = useState<ProfileAddress[]>(() =>
    readSaved<ProfileAddress>(`${storagePrefix}-addresses`),
  );
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>(() =>
    readSaved<RefundRequest>(`${storagePrefix}-refunds`),
  );
  const [cards, setCards] = useState<SavedCard[]>(() =>
    readSaved<SavedCard>(`${storagePrefix}-cards`),
  );
  const [orders] = useState<Order[]>(() =>
    readOrders().filter((order) => order.username === user.username),
  );
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState<ProfileAddressForm>(emptyAddress);
  const [refundForm, setRefundForm] = useState<RefundFormValues>(emptyRefund);
  const [cardForm, setCardForm] = useState<CardFormValues>(emptyCard);
  const [notice, setNotice] = useState("");

  const saveAddresses = (next: ProfileAddress[]) => {
    setAddresses(next);
    localStorage.setItem(`${storagePrefix}-addresses`, JSON.stringify(next));
  };

  const saveRefundRequests = (next: RefundRequest[]) => {
    setRefundRequests(next);
    localStorage.setItem(`${storagePrefix}-refunds`, JSON.stringify(next));
  };

  const saveCards = (next: SavedCard[]) => {
    setCards(next);
    localStorage.setItem(`${storagePrefix}-cards`, JSON.stringify(next));
  };

  const saveProfile = () => {
    updateProfile({
      fullName: name.trim(),
      email: email.trim(),
      address: user.address,
    });
    setNotice("Your profile has been saved.");
  };

  const updateAddressField = (field: keyof ProfileAddressForm, value: string) => {
    setAddressForm((current) => ({ ...current, [field]: value }));
  };

  const saveAddress = () => {
    const wasEditing = editingAddressId !== null;
    const next = wasEditing
      ? addresses.map((address) =>
          address.id === editingAddressId ? { ...address, ...addressForm } : address,
        )
      : [...addresses, { id: `address-${Date.now()}`, ...addressForm }];
    saveAddresses(next);
    setAddressForm(emptyAddress);
    setEditingAddressId(null);
    setNotice(wasEditing ? "Address updated." : "Address added.");
  };

  const editAddress = (address: ProfileAddress) => {
    setEditingAddressId(address.id);
    setAddressForm({
      country: address.country,
      city: address.city,
      street: address.street,
      postalCode: address.postalCode,
    });
    setNotice("");
  };

  const removeAddress = (id: string) => {
    saveAddresses(addresses.filter((address) => address.id !== id));
    setNotice("Address removed.");
  };

  const cancelAddressEdit = () => {
    setEditingAddressId(null);
    setAddressForm(emptyAddress);
  };

  const updateRefundField = (field: keyof RefundFormValues, value: string) => {
    setRefundForm((current) => ({ ...current, [field]: value }));
  };

  const submitRefundRequest = () => {
    const request: RefundRequest = {
      id: `refund-${Date.now()}`,
      ...refundForm,
      submittedAt: new Date().toISOString(),
      status: "Submitted",
    };
    saveRefundRequests([request, ...refundRequests]);
    setRefundForm(emptyRefund);
    setNotice("Refund request submitted.");
  };

  const updateCardField = (field: keyof CardFormValues, value: string) => {
    setCardForm((current) => ({ ...current, [field]: value }));
  };

  const saveCard = () => {
    const digits = cardForm.number.replace(/\D/g, "");
    if (digits.length < 12 || digits.length > 19) {
      setNotice("Enter a valid card number (12–19 digits).");
      return;
    }

    const card: SavedCard = {
      id: `card-${Date.now()}`,
      holder: cardForm.holder.trim(),
      lastFour: digits.slice(-4),
      expiry: cardForm.expiry,
    };
    saveCards([card, ...cards]);
    setCardForm(emptyCard);
    setNotice("Masked card reference saved.");
  };

  const removeCard = (id: string) => {
    saveCards(cards.filter((card) => card.id !== id));
    setNotice("Card reference removed.");
  };

  return {
    name,
    setName,
    email,
    setEmail,
    saveProfile,
    addresses,
    addressForm,
    editingAddressId,
    updateAddressField,
    saveAddress,
    editAddress,
    removeAddress,
    cancelAddressEdit,
    orders,
    refundRequests,
    refundForm,
    updateRefundField,
    submitRefundRequest,
    cards,
    cardForm,
    updateCardField,
    saveCard,
    removeCard,
    notice,
    clearNotice: () => setNotice(""),
  };
}
