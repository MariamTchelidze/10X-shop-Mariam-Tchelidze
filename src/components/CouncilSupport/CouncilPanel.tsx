import { useState } from "react";
import type { CouncilQuestion } from "../../types/support";

const questions: CouncilQuestion[] = [
  { id: "delivery", topic: "Shipping", question: "How long will my order take?", answer: "The displayed estimate is 3–5 Realm Days. This storefront is a demo, so no parcel or carrier tracking is created." },
  { id: "tracking", topic: "Shipping", question: "Where can I follow a delivery?", answer: "Demo orders appear in My Purchases under your profile. Live courier tracking is not connected." },
  { id: "returns", topic: "Returns", question: "How do I return an artifact?", answer: "This project simulates shopping only. You can review the Returns help page for the example store policy; no real return is submitted." },
  { id: "guest-return", topic: "Returns", question: "Can a guest request a return?", answer: "The return-as-guest help page explains the sample flow. Orders in this demo are stored locally in the browser." },
  { id: "materials", topic: "Artifact lore", question: "Are the artifact materials authentic?", answer: "Product descriptions and availability come from DummyJSON sample data. Middle-earth names and lore are editorial presentation, not a claim of official licensed artifacts." },
  { id: "account", topic: "Account", question: "Are my account and payment details secure?", answer: "Accounts are a local learning demo stored in this browser. Checkout collects no payment, so do not enter real passwords or sensitive personal information." },
];

export function CouncilPanel() {
  const [selectedQuestion, setSelectedQuestion] = useState<CouncilQuestion | null>(null);

  return (
    <div className="space-y-4">
      <div>
        <p className="font-display text-lg text-market-ink">The Council of Elrond</p>
        <p className="mt-1 text-sm leading-6 text-market-muted">Choose a matter for the council to consider.</p>
      </div>
      {selectedQuestion && (
        <div className="border border-gold/50 bg-market-surface p-4" aria-live="polite">
          <p className="text-[10px] uppercase tracking-[0.16em] text-gold">{selectedQuestion.topic}</p>
          <p className="mt-2 font-display text-sm text-market-ink">{selectedQuestion.question}</p>
          <p className="mt-2 text-sm leading-6 text-market-muted">{selectedQuestion.answer}</p>
        </div>
      )}
      <div className="grid gap-2" aria-label="Questions for the Council">
        {questions.map((question) => (
          <button
            key={question.id}
            type="button"
            aria-pressed={selectedQuestion?.id === question.id}
            onClick={() => setSelectedQuestion(question)}
            className={`min-h-11 border px-3 py-2 text-left text-xs leading-5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${selectedQuestion?.id === question.id ? "border-gold bg-market-surface text-market-ink" : "border-market-border text-market-muted hover:text-market-ink"}`}
          >
            {question.question}
          </button>
        ))}
      </div>
      <p className="text-[10px] leading-5 text-market-muted">The Council uses prepared answers; it is not a live AI service.</p>
    </div>
  );
}
