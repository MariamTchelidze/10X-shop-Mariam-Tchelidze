// 1. იმპორტები და ინტერფეისები (Imports & Interfaces)
import { useState } from "react";
import { councilQuestions } from "./councilQuestions";
import { CouncilQuestionItem } from "./CouncilQuestionItem";
import { ElvenLeafMark } from "./ElvenLeafMark";


/*
 * CouncilChatPanel კომპონენტის შემავალი პარამეტრების (Props) კონტრაქტი.
 * იღებს onClose ფუნქციას ჩათის პანელის დასახურად.
 */
interface CouncilChatPanelProps {
  onClose: () => void;
}

// 2. ძირითადი კომპონენტი და შიდა მდგომარეობა
export function CouncilChatPanel({ onClose }: CouncilChatPanelProps) {
  // ინახავს იმ მიმდინარე კითხვის ID-ს, რომელიც ამჟამად გახსნილია (თუ არცერთი არაა - null)
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  // 3. ლოგიკა / ჰენდლერები (Toggle Logic)
  //თუ იმავე კითხვას დააჭერ, იხურება (null), ხოლო სხვაზე დაჭერისას იხსნება ახალი.
  const toggleQuestion = (id: string) => {
    setExpandedQuestion((current) => current === id ? null : id);
  };

  // 4. ვიზუალური რენდერი (JSX UI Layout)
  return (
    <section className="overflow-hidden border border-gold/60 bg-market-paper text-market-ink shadow-2xl">
      {/* სათაურის ბლოკი (Header): ლოგო, სათაური და დახურვის ღილაკი */}
      <header className="flex items-start justify-between gap-3 border-b border-market-border bg-market-surface px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/60 text-gold">
            <ElvenLeafMark />
          </span>
          <div className="min-w-0">
            <h2 className="font-display text-sm uppercase tracking-[0.08em]">The Council of Elrond</h2>
            <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-market-muted">Guidance for your journey</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Council support"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center text-xl text-market-muted transition-colors hover:text-market-ink focus-visible:outline-2 focus-visible:outline-gold"
        >
          ×
        </button>
      </header>

      {/* ჩათის ძირითადი შიგთავსი და კითხვების სია */}
      <div className="px-4 sm:px-5">
        <p className="py-4 font-sans text-xs leading-6 text-market-muted">
          Choose a question and the council will share what is known.
        </p>

        {/* კითხვების დინამიური მასივის რენდერი .map()-ის გამოყენებით */}
        <div className="divide-y divide-market-border border-y border-market-border">
          {councilQuestions.map((question) => (
            <CouncilQuestionItem
              key={question.id}
              question={question}
              isExpanded={expandedQuestion === question.id}
              onToggle={toggleQuestion}
            />
          ))}
        </div>
        <p className="py-3 text-[9px] leading-4 text-market-muted">
          This assistant shares information about the storefront demo only.
        </p>
      </div>
    </section>
  );
}
