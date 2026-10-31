import type { CouncilQuestion } from "../../types/support";

export const councilQuestions: CouncilQuestion[] = [
  {
    id: "delivery-time",
    topic: "Shipping & couriers",
    question: "How long will a delivery take?",
    answer: "The 3–5 Realm Days shown in this demo is an imaginative estimate. No parcel is dispatched and no carrier is connected.",
  },
  {
    id: "order-tracking",
    topic: "Shipping & couriers",
    question: "Where can I follow my order?",
    answer: "Open My Account and choose My Purchases to review saved orders and their local status. Live courier tracking is not available.",
  },
  {
    id: "artifact-returns",
    topic: "Returns & refunds",
    question: "How do I return an artifact?",
    answer: "Returns are not processed in this project. The Refunds section can save a local request, but it does not contact a bank or issue money.",
  },
  {
    id: "authenticity",
    topic: "Artifact lore",
    question: "Are these authentic Middle-earth artifacts?",
    answer: "The catalog is an educational storefront with fantasy-inspired presentation. Items are not verified or official collectibles.",
  },
  {
    id: "materials",
    topic: "Artifact lore",
    question: "Where can I learn about an artifact?",
    answer: "Open its product page for the description and details supplied with that listing. Provenance and material information may be limited.",
  },
];
