import type { CouncilQuestion } from "../../types/support";

interface CouncilQuestionItemProps {
  question: CouncilQuestion;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}

export function CouncilQuestionItem({ question, isExpanded, onToggle }: CouncilQuestionItemProps) {
  const answerId = `council-answer-${question.id}`;

  return (
    <article className="border-b border-market-border last:border-b-0">
      <h3>
        <button
          type="button"
          aria-expanded={isExpanded}
          aria-controls={answerId}
          onClick={() => onToggle(question.id)}
          className="flex min-h-14 w-full items-center justify-between gap-3 py-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          <span className="min-w-0">
            <span className="block text-[9px] uppercase tracking-[0.14em] text-gold">{question.topic}</span>
            <span className="mt-1 block text-xs font-medium leading-5 text-market-ink">{question.question}</span>
          </span>
          <span aria-hidden="true" className={`shrink-0 font-display text-xl text-gold transition-transform duration-300 ${isExpanded ? "rotate-45" : "rotate-0"}`}>
            +
          </span>
        </button>
      </h3>
      <div
        id={answerId}
        aria-hidden={!isExpanded}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out motion-reduce:transition-none ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <p className="max-w-prose pb-4 pr-6 font-sans text-xs leading-6 text-market-muted">
            {question.answer}
          </p>
        </div>
      </div>
    </article>
  );
}
