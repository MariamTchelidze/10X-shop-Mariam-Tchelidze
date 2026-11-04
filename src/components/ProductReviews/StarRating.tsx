// ვარსკვლავების შეფასებას აჩვენებს ან მომხმარებელს არჩევინებს.
interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  label?: string;
}

export function StarRating({ rating, onChange, label = "Rating" }: StarRatingProps) {
  // onChange-ის გარეშე ვარსკვლავები მხოლოდ შეფასებას აჩვენებს; callback-ით კი არჩევადია.
  if (!onChange) {
    return (
      <span role="img" aria-label={`${rating} out of 5 stars`} className="inline-flex gap-1 text-gold">
        {Array.from({ length: 5 }, (_, index) => (
          <span key={index} className={index < rating ? "text-gold" : "text-market-border"}>
            ★
          </span>
        ))}
      </span>
    );
  }

  return (
    <div role="radiogroup" aria-label={label} className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, index) => {
        const value = index + 1;
        const isSelected = value === rating;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={`${value} ${value === 1 ? "star" : "stars"}`}
            onClick={() => onChange(value)}
            className={`inline-flex min-h-11 min-w-9 items-center justify-center text-2xl transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold ${value <= rating ? "text-gold" : "text-market-border hover:text-gold/70"}`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
