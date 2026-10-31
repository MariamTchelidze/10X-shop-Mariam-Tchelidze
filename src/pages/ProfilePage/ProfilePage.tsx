import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import type { Order } from "../../types/order";
import { readOrders } from "../../utils/orders";
import { formatPrice } from "../../utils/product";

type ProfileSection = "general" | "addresses" | "purchases" | "refunds" | "cards";

interface Address {
  id: string;
  country: string;
  city: string;
  street: string;
  postalCode: string;
}

interface RefundRequest {
  id: string;
  bankName: string;
  accountHolder: string;
  iban: string;
  submittedAt: string;
  status: "Submitted";
}

interface SavedCard {
  id: string;
  holder: string;
  lastFour: string;
  expiry: string;
}

function readSaved<T>(key: string): T[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(value) ? value as T[] : [];
  } catch {
    return [];
  }
}

function SectionPanel({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return (
    <section className="min-w-0" aria-labelledby="profile-section-title">
      <p className="text-[10px] uppercase tracking-[0.18em] text-gold">Middle-earth Market · Account</p>
      <h2 id="profile-section-title" className="mt-3 border-b border-market-border pb-5 font-display text-2xl text-market-ink sm:text-3xl">{title}</h2>
      <p className="mt-5 text-sm leading-6 text-market-muted">{intro}</p>
      <div className="mt-7">{children}</div>
    </section>
  );
}

function fieldClass(): string {
  return "min-h-12 w-full border-b border-market-border bg-transparent px-1 text-sm text-market-ink outline-none transition-colors placeholder:text-market-muted focus:border-gold";
}

export function ProfilePage() {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<ProfileSection>("general");
  const storagePrefixRef = useRef(`middle-market-${user.username || user.email}`);
  const storagePrefix = storagePrefixRef.current;
  const [details, setDetails] = useState({ name: user.fullName || user.username, email: user.email, address: user.address });
  const [addresses, setAddresses] = useState<Address[]>(() => readSaved<Address>(`${storagePrefix}-addresses`));
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>(() => readSaved<RefundRequest>(`${storagePrefix}-refunds`));
  const [cards, setCards] = useState<SavedCard[]>(() => readSaved<SavedCard>(`${storagePrefix}-cards`));
  const [orders] = useState<Order[]>(() => readOrders().filter((order) => order.username === user.username));
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState<Omit<Address, "id">>({ country: "", city: "", street: "", postalCode: "" });
  const [refundForm, setRefundForm] = useState({ bankName: "", accountHolder: "", iban: "" });
  const [cardForm, setCardForm] = useState({ holder: "", number: "", expiry: "" });
  const [notice, setNotice] = useState("");

  const saveAddresses = (next: Address[]) => {
    setAddresses(next);
    localStorage.setItem(`${storagePrefix}-addresses`, JSON.stringify(next));
  };
  const saveRefunds = (next: RefundRequest[]) => {
    setRefundRequests(next);
    localStorage.setItem(`${storagePrefix}-refunds`, JSON.stringify(next));
  };
  const saveCards = (next: SavedCard[]) => {
    setCards(next);
    localStorage.setItem(`${storagePrefix}-cards`, JSON.stringify(next));
  };

  const handleProfileSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateProfile({ fullName: details.name.trim(), email: details.email.trim(), address: user.address });
    setNotice("Your profile has been saved.");
  };

  const handleAddressSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = editingAddressId
      ? addresses.map((address) => address.id === editingAddressId ? { ...address, ...addressForm } : address)
      : [...addresses, { id: `address-${Date.now()}`, ...addressForm }];
    saveAddresses(next);
    setAddressForm({ country: "", city: "", street: "", postalCode: "" });
    setEditingAddressId(null);
    setNotice(editingAddressId ? "Address updated." : "Address added.");
  };

  const beginAddressEdit = (address: Address) => {
    setEditingAddressId(address.id);
    setAddressForm({ country: address.country, city: address.city, street: address.street, postalCode: address.postalCode });
    setNotice("");
  };

  const handleRefundSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const request: RefundRequest = { id: `refund-${Date.now()}`, ...refundForm, submittedAt: new Date().toISOString(), status: "Submitted" };
    saveRefunds([request, ...refundRequests]);
    setRefundForm({ bankName: "", accountHolder: "", iban: "" });
    setNotice("Refund request submitted.");
  };

  const handleCardSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const digits = cardForm.number.replace(/\D/g, "");
    if (digits.length < 12 || digits.length > 19) {
      setNotice("Enter a valid card number (12–19 digits).");
      return;
    }
    const card: SavedCard = { id: `card-${Date.now()}`, holder: cardForm.holder.trim(), lastFour: digits.slice(-4), expiry: cardForm.expiry };
    saveCards([card, ...cards]);
    setCardForm({ holder: "", number: "", expiry: "" });
    setNotice("Masked card reference saved.");
  };

  const handleSignOut = () => {
    logout();
    navigate("/", { replace: true });
  };

  const navItems: { id: ProfileSection | "signout"; label: string; action?: () => void }[] = [
    { id: "general", label: "General settings" },
    { id: "addresses", label: "My addresses" },
    { id: "purchases", label: "My purchases" },
    { id: "refunds", label: "Refunds" },
    { id: "cards", label: "My cards" },
    { id: "signout", label: "Sign out", action: handleSignOut },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <h1 className="mb-8 font-display text-3xl text-market-ink sm:mb-10 sm:text-4xl">My account</h1>
      <div className="grid gap-8 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14">
        <aside className="h-fit md:sticky md:top-28">
          <p className="mb-3 hidden text-[10px] uppercase tracking-[0.16em] text-market-muted md:block">Account menu</p>
          <nav aria-label="Profile sections" className="flex gap-2 overflow-x-auto border-b border-market-border pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-col md:gap-0 md:overflow-visible md:border-b-0 md:border-t md:pb-0">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={item.action ?? (() => { setActiveSection(item.id as ProfileSection); setNotice(""); })}
                aria-current={activeSection === item.id ? "page" : undefined}
                className={`min-h-11 shrink-0 border-b-2 px-3 text-left text-[10px] uppercase tracking-[0.1em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold md:w-full md:border-b md:border-l-2 md:border-r-0 md:border-t-0 md:px-4 md:text-xs ${activeSection === item.id ? "border-gold bg-market-surface text-market-ink" : "border-transparent text-market-muted hover:text-market-ink"} ${item.id === "signout" ? "md:mt-4 md:border-t md:border-market-border" : ""}`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="min-w-0">
          {activeSection === "general" && <SectionPanel title="General settings" intro="Manage your personal details for your journey through the realm.">
            <form onSubmit={handleProfileSubmit} className="grid gap-6 sm:max-w-xl">
              <label className="grid gap-2 text-[10px] uppercase tracking-[0.14em] text-market-muted" htmlFor="profile-name">Full name<input id="profile-name" required value={details.name} onChange={(event) => setDetails((current) => ({ ...current, name: event.target.value }))} className={fieldClass()} /></label>
              <label className="grid gap-2 text-[10px] uppercase tracking-[0.14em] text-market-muted" htmlFor="profile-email">Email<input id="profile-email" required type="email" value={details.email} onChange={(event) => setDetails((current) => ({ ...current, email: event.target.value }))} className={fieldClass()} /></label>
              <button type="submit" className="min-h-12 bg-market-ink px-7 text-xs uppercase tracking-[0.14em] text-market-paper transition-opacity hover:opacity-80 sm:w-fit">Save changes</button>
            </form>
          </SectionPanel>}

          {activeSection === "addresses" && <SectionPanel title="My addresses" intro="Keep delivery destinations close at hand.">
            {addresses.length > 0 && <ul className="mb-8 grid gap-3 sm:grid-cols-2">{addresses.map((address) => <li key={address.id} className="border border-market-border p-4"><p className="text-sm font-medium text-market-ink">{address.street}</p><p className="mt-2 text-xs leading-5 text-market-muted">{address.city}, {address.postalCode}<br />{address.country}</p><div className="mt-4 flex gap-4 text-[10px] uppercase tracking-widest"><button type="button" onClick={() => beginAddressEdit(address)} className="text-market-ink underline underline-offset-4">Edit</button><button type="button" onClick={() => { saveAddresses(addresses.filter((item) => item.id !== address.id)); setNotice("Address removed."); }} className="text-market-muted underline underline-offset-4">Remove</button></div></li>)}</ul>}
            <form onSubmit={handleAddressSubmit} className="grid gap-5 sm:max-w-xl sm:grid-cols-2">
              {(["country", "city", "street", "postalCode"] as const).map((field) => <label key={field} htmlFor={`address-${field}`} className="grid gap-2 text-[10px] uppercase tracking-[0.14em] text-market-muted">{field === "postalCode" ? "Postal code" : field}<input id={`address-${field}`} required value={addressForm[field]} onChange={(event) => setAddressForm((current) => ({ ...current, [field]: event.target.value }))} className={fieldClass()} /></label>)}
              <div className="flex flex-wrap gap-3 sm:col-span-2"><button type="submit" className="min-h-12 bg-market-ink px-7 text-xs uppercase tracking-[0.14em] text-market-paper">{editingAddressId ? "Update address" : "Add address"}</button>{editingAddressId && <button type="button" onClick={() => { setEditingAddressId(null); setAddressForm({ country: "", city: "", street: "", postalCode: "" }); }} className="min-h-12 px-4 text-xs uppercase tracking-widest text-market-muted">Cancel</button>}</div>
            </form>
          </SectionPanel>}

          {activeSection === "purchases" && <SectionPanel title="My purchases" intro="Review placed orders and their latest saved status.">
            {orders.length === 0 ? <p className="border border-market-border p-5 text-sm text-market-muted">No purchases are recorded yet. <Link to="/" className="text-market-ink underline underline-offset-4">Browse the market</Link></p> : <ul className="divide-y divide-market-border border-y border-market-border">{orders.map((order) => <li key={order.id} className="flex flex-wrap items-center justify-between gap-4 py-4"><div><p className="text-xs uppercase tracking-widest text-market-ink">{order.id}</p><p className="mt-1 text-xs text-market-muted">{new Date(order.date).toLocaleDateString()} · {order.items.length} line items</p></div><div className="flex items-center gap-4"><span className="border border-gold px-3 py-1 text-[10px] uppercase tracking-widest">{order.status}</span><span className="text-sm">{formatPrice(order.total)}</span></div></li>)}</ul>}
            <Link to="/orders" className="mt-5 inline-flex min-h-10 items-center text-xs uppercase tracking-widest text-market-muted underline underline-offset-4">Open order history</Link>
          </SectionPanel>}

          {activeSection === "refunds" && <SectionPanel title="Refunds" intro="Submit bank details for a refund request. Requests are saved locally for this demo.">
            <form onSubmit={handleRefundSubmit} className="grid gap-5 sm:max-w-xl">
              <label htmlFor="refund-bank" className="grid gap-2 text-[10px] uppercase tracking-[0.14em] text-market-muted">Bank name<input id="refund-bank" required value={refundForm.bankName} onChange={(event) => setRefundForm((current) => ({ ...current, bankName: event.target.value }))} className={fieldClass()} /></label>
              <label htmlFor="refund-holder" className="grid gap-2 text-[10px] uppercase tracking-[0.14em] text-market-muted">Account holder<input id="refund-holder" required value={refundForm.accountHolder} onChange={(event) => setRefundForm((current) => ({ ...current, accountHolder: event.target.value }))} className={fieldClass()} /></label>
              <label htmlFor="refund-iban" className="grid gap-2 text-[10px] uppercase tracking-[0.14em] text-market-muted">IBAN<input id="refund-iban" required minLength={15} value={refundForm.iban} onChange={(event) => setRefundForm((current) => ({ ...current, iban: event.target.value.toUpperCase() }))} className={fieldClass()} /></label>
              <button type="submit" className="min-h-12 bg-market-ink px-7 text-xs uppercase tracking-[0.14em] text-market-paper sm:w-fit">Submit refund request</button>
            </form>
            {refundRequests.length > 0 && <ul className="mt-8 divide-y divide-market-border border-y border-market-border">{refundRequests.map((request) => <li key={request.id} className="flex flex-wrap justify-between gap-3 py-4 text-xs"><span className="text-market-ink">{request.bankName} · {request.iban.slice(-4).padStart(request.iban.length, "•")}</span><span className="text-market-muted">{new Date(request.submittedAt).toLocaleDateString()} · {request.status}</span></li>)}</ul>}
          </SectionPanel>}

          {activeSection === "cards" && <SectionPanel title="My cards" intro="Manage masked card references for this local checkout demo. Full card numbers and security codes are never saved.">
            {cards.length > 0 && <ul className="mb-8 grid gap-3 sm:grid-cols-2">{cards.map((card) => <li key={card.id} className="border border-market-border bg-market-surface p-5"><p className="font-display text-sm text-market-ink">•••• •••• •••• {card.lastFour}</p><p className="mt-3 text-xs uppercase tracking-widest text-market-muted">{card.holder}</p><p className="mt-1 text-xs text-market-muted">Expires {card.expiry}</p><button type="button" onClick={() => { saveCards(cards.filter((item) => item.id !== card.id)); setNotice("Card reference removed."); }} className="mt-4 text-[10px] uppercase tracking-widest text-market-muted underline underline-offset-4">Remove</button></li>)}</ul>}
            <form onSubmit={handleCardSubmit} className="grid gap-5 sm:max-w-xl">
              <label htmlFor="card-holder" className="grid gap-2 text-[10px] uppercase tracking-[0.14em] text-market-muted">Cardholder name<input id="card-holder" autoComplete="cc-name" required value={cardForm.holder} onChange={(event) => setCardForm((current) => ({ ...current, holder: event.target.value }))} className={fieldClass()} /></label>
              <label htmlFor="card-number" className="grid gap-2 text-[10px] uppercase tracking-[0.14em] text-market-muted">Card number<input id="card-number" inputMode="numeric" autoComplete="cc-number" required value={cardForm.number} onChange={(event) => setCardForm((current) => ({ ...current, number: event.target.value }))} className={fieldClass()} /></label>
              <label htmlFor="card-expiry" className="grid gap-2 text-[10px] uppercase tracking-[0.14em] text-market-muted">Expiry<input id="card-expiry" placeholder="MM/YY" autoComplete="cc-exp" required pattern="(0[1-9]|1[0-2])/[0-9]{2}" value={cardForm.expiry} onChange={(event) => setCardForm((current) => ({ ...current, expiry: event.target.value }))} className={fieldClass()} /></label>
              <button type="submit" className="min-h-12 bg-market-ink px-7 text-xs uppercase tracking-[0.14em] text-market-paper sm:w-fit">Save card reference</button>
            </form>
          </SectionPanel>}
          {notice && <p role="status" className="mt-5 text-sm text-forest">{notice}</p>}
        </div>
      </div>
    </main>
  );
}
