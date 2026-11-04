// 1. ტიპების იმპორტი (Type Imports)
import type { CouncilQuestion } from "../../types/support";
/*
  * CouncilQuestionItem კომპონენტის შემავალი პარამეტრების (Props) ინტერფეისი.
  * განსაზღვრავს კითხვის ობიექტს, მისი გაშლის სტატუსს და გადართვის ფუნქციას.
*/
interface CouncilQuestionItemProps {
  question: CouncilQuestion;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}

// 2. ძირითადი კომპონენტი (CouncilQuestionItem)
export function CouncilQuestionItem({ question, isExpanded, onToggle }: CouncilQuestionItemProps) {
  // უნიკალური აიდის გენერაცია აკუსტიკური და ხელმისაწვდომობის (Accessibility) კონტროლისთვის.
  const answerId = `council-answer-${question.id}`;

  // 3. ვიზუალური რენდერი (JSX UI Layout)
  return (
    <article className="border-b border-market-border last:border-b-0">
      {/* სათაურის ბლოკი, სადაც მოთავსებულია კითხვის ღილაკი. */}
      <h3>
        <button
          type="button"
          aria-expanded={isExpanded}
          aria-controls={answerId}
          onClick={() => onToggle(question.id)}
          className="flex min-h-14 w-full items-center justify-between gap-3 py-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          {/* კითხვის თემატიკა და ძირითადი ტექსტი. */}
          <span className="min-w-0">
            <span className="block text-[9px] uppercase tracking-[0.14em] text-gold">{question.topic}</span>
            <span className="mt-1 block text-xs font-medium leading-5 text-market-ink">{question.question}</span>
          </span>
          {/* პლუსის ნიშანი, რომელიც იცვლის მიმართულებას (ბრუნავს) გახსნილ მდგომარეობაში. */}
          <span aria-hidden="true" className={`shrink-0 font-display text-xl text-gold transition-transform duration-300 ${isExpanded ? "rotate-45" : "rotate-0"}`}>
            +
          </span>
        </button>
      </h3>
      {/* პასუხის გამოსაჩენი ანიმაციური კონტეინერი, რომელიც იშლება და იკეცება დინამიკურად. */}
      <div
        id={answerId}
        aria-hidden={!isExpanded}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out motion-reduce:transition-none ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        {/* შიდა დამცავი კონტეინერი ტექსტის შეუფერხებელი ანიმაციისთვის. */}
        <div className="overflow-hidden">
          {/* თავად პასუხის ტექსტი სარჩევიდან. */}
          <p className="max-w-prose pb-4 pr-6 font-sans text-xs leading-6 text-market-muted">
            {question.answer}
          </p>
        </div>
      </div>
    </article>
  );
}
