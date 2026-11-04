// დახმარების თემებსა და გასაშლელ კითხვებს კატეგორიების მიხედვით აჩვენებს.
import { useState } from "react";
import type { FaqCategory } from "../../types/help";

const categories: FaqCategory[] = [
  {
    id: "couriers",
    title: "Shipping & Elven Couriers",
    intro: "The road from the Shire is long. Here is how delivery works in this storefront demo.",
    questions: [
      { id: "delivery-times", question: "How long will my delivery take?", answer: "The 3–5 Realm Days shown at checkout is an imaginative display estimate. This project does not dispatch real parcels or connect to a carrier." },
      { id: "tracking", question: "Where can I track an order?", answer: "Open My Account and choose My Purchases to see saved orders and their local status. Live carrier tracking is not connected." },
      { id: "delivery-address", question: "Can I change my delivery address?", answer: "You can add and edit saved addresses in My Account. Address changes do not update a real shipment because checkout is simulated." },
    ],
  },
  {
    id: "returns",
    title: "Artifact Returns & Refunds",
    intro: "Guidance for returning treasures and managing a refund request in the demo.",
    questions: [
      { id: "return-item", question: "How do I return an item?", answer: "Returns are not processed by this project. The customer-care links are illustrative, and no return label or parcel collection can be arranged here." },
      { id: "refund-request", question: "Can I submit a refund request?", answer: "The Refunds section in your profile saves a local request with bank details. It does not contact a bank or initiate a payment. Avoid entering real financial details." },
      { id: "guest-purchase", question: "Can I make or return a guest purchase?", answer: "A signed-in account is required to add an item to your bag and check out. Guest order lookup and guest returns are not available." },
    ],
  },
  {
    id: "lore",
    title: "Ring Lore & Product Specifications",
    intro: "Learn what the catalog can—and cannot—tell you about the treasures within.",
    questions: [
      { id: "authenticity", question: "Are these official or authenticated Middle-earth artifacts?", answer: "No. This is an educational storefront project with fantasy-inspired presentation. Listings are not verified, official, or licensed collectible products." },
      { id: "materials", question: "Where can I find an item's materials and dimensions?", answer: "Open a product card to see the information supplied with its listing. Detailed materials, sizing, and provenance may not be available in this demo catalog." },
      { id: "reviews", question: "Are product reviews real?", answer: "Reviews supplied by the product catalog are shown with the listing. Reviews submitted in the product page are saved locally in your browser for demonstration." },
    ],
  },
  {
    id: "account",
    title: "Account & Realm Security",
    intro: "Manage your profile and understand how account information is handled in this browser-based experience.",
    questions: [
      { id: "profile", question: "How do I update my profile or saved addresses?", answer: "Sign in and open My Account from the header. General Settings edits your name and email; My Addresses lets you add, edit, or remove destinations." },
      { id: "payment-cards", question: "Are my card details stored?", answer: "The profile demo saves only a cardholder name, expiry, and last four digits. It does not save the full card number or security code, and no payment is collected." },
      { id: "local-data", question: "Where is my profile and order data stored?", answer: "This demo keeps account, order, wishlist, and profile data in browser localStorage. It is not a secure production account system; use fictional details only." },
    ],
  },
];

export function HelpCenterPage() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(() => new Set());

  // Set საშუალებას გვაძლევს, რამდენიმე პასუხი ერთდროულად ღია დარჩეს.
  const toggleItem = (id: string) => {
    setExpandedItems((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // კატეგორიები და მათი შეკითხვები მონაცემებიდან ერთნაირი accordion-ებად იხატება.
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <header className="relative mb-10 overflow-hidden border border-gold/40 bg-market-surface px-5 py-10 sm:mb-14 sm:px-10 sm:py-14">
        <div aria-hidden="true" className="pointer-events-none absolute -right-12 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full border-[9px] border-gold/25 sm:right-8 sm:h-56 sm:w-56 sm:border-[12px]" />
        <p className="relative z-10 text-[10px] uppercase tracking-[0.18em] text-earth">A guide for travelers and treasure seekers</p>
        <h1 className="relative z-10 mt-4 max-w-3xl font-display text-3xl leading-tight text-market-ink sm:text-5xl">The Archives of Middle-earth: Help & Lore Center</h1>
        <p className="relative z-10 mt-4 max-w-2xl text-sm leading-6 text-market-muted sm:text-base">Answers to common questions, gathered for every road through the realm.</p>
      </header>

      <div className="space-y-12 sm:space-y-14">
        {categories.map((category) => (
          <section key={category.id} aria-labelledby={`${category.id}-heading`}>
            <div className="mb-5 border-b border-market-border pb-4">
              <h2 id={`${category.id}-heading`} className="font-display text-xl text-market-ink sm:text-2xl">{category.title}</h2>
              <p className="mt-2 text-sm leading-6 text-market-muted">{category.intro}</p>
            </div>
            <div className="divide-y divide-market-border border-y border-market-border">
              {category.questions.map((item) => {
                const isExpanded = expandedItems.has(item.id);
                const panelId = `answer-${item.id}`;
                return (
                  <article key={item.id}>
                    <h3>
                      <button
                        type="button"
                        id={`question-${item.id}`}
                        aria-expanded={isExpanded}
                        aria-controls={panelId}
                        onClick={() => toggleItem(item.id)}
                        className="flex min-h-14 w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium text-market-ink transition-colors hover:text-earth focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:text-base"
                      >
                        <span>{item.question}</span>
                        <span aria-hidden="true" className={`shrink-0 font-display text-xl text-gold transition-transform duration-300 ${isExpanded ? "rotate-45" : "rotate-0"}`}>+</span>
                      </button>
                    </h3>
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={`question-${item.id}`}
                      aria-hidden={!isExpanded}
                      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out motion-reduce:transition-none ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                    >
                      <div className="overflow-hidden">
                        <p className="max-w-3xl pb-5 pr-8 text-sm leading-7 text-market-muted">{item.answer}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
