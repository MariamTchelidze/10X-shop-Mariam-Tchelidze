// პროდუქტის შეფასებებს ავტორით, ტექსტითა და თარიღით ჩამოთვლის.
import type { Review } from "../../types/product";
import { StarRating } from "./StarRating";
import { formatDate } from "../../utils/formatters";

interface ReviewListProps {
  reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  // ცარიელი სიისთვის ცალკე მდგომარეობას ვაჩვენებთ.
  if (reviews.length === 0) {
    return (
      <p className="border-y border-market-border py-6 text-sm text-market-muted">
        The tavern is quiet for now. Be the first traveler to leave a tale.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-market-border border-y border-market-border">
      {reviews.map((review, index) => (
        <li key={`${review.date}-${review.reviewerName}-${index}`} className="py-6 sm:py-7">
          <article className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-6">
            <div className="min-w-0">
              {review.title && (
                <h3 className="font-display text-lg text-market-ink">{review.title}</h3>
              )}
              <p className="mt-1 text-xs uppercase tracking-[0.12em] text-market-muted">
                {review.reviewerName || "A traveler"}
                {review.realm && <span> · {review.realm}</span>}
              </p>
              <p className="mt-3 font-sans text-sm leading-7 text-market-muted">
                {review.comment}
              </p>
            </div>
            <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-start">
              <StarRating rating={review.rating} />
              <time className="text-xs text-market-muted" dateTime={review.date}>
                {formatDate(review.date)}
              </time>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
