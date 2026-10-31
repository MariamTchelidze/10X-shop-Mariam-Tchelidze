import { useEffect, useState, type FormEvent } from "react";
import type { Product, Review } from "../../../types/product";

interface ProductReviewsProps {
  product: Product;
}

function readSavedReviews(productId: number): Review[] {
  try {
    const saved: unknown = JSON.parse(
      localStorage.getItem(`10x-shop-reviews-${productId}`) ?? "[]",
    );
    return Array.isArray(saved) ? (saved as Review[]) : [];
  } catch {
    return [];
  }
}

export function ProductReviews({ product }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(product.reviews);
  const [reviewName, setReviewName] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  useEffect(() => {
    setReviews([...product.reviews, ...readSavedReviews(product.id)]);
    setReviewName("");
    setReviewComment("");
    setReviewRating(5);
  }, [product]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const reviewerName = reviewName.trim();
    const comment = reviewComment.trim();
    if (!reviewerName || comment.length < 10) return;

    const review: Review = {
      reviewerName,
      comment,
      rating: reviewRating,
      date: new Date().toISOString(),
    };
    const savedReviews = readSavedReviews(product.id);
    const nextSavedReviews = [...savedReviews, review];
    setReviews([...product.reviews, ...nextSavedReviews]);
    localStorage.setItem(
      `10x-shop-reviews-${product.id}`,
      JSON.stringify(nextSavedReviews),
    );
    setReviewName("");
    setReviewComment("");
    setReviewRating(5);
  };

  return (
    <section className="mt-14 border-t border-market-border pt-10 sm:mt-20" aria-labelledby="reviews-heading">
      <h2 id="reviews-heading" className="font-display text-2xl text-market-ink">
        Reviews <span className="font-sans text-sm text-market-muted">({reviews.length})</span>
      </h2>
      {reviews.length > 0 ? (
        <ul className="mt-6 divide-y divide-market-border">
          {reviews.map((review, index) => (
            <li key={`${review.date}-${index}`} className="py-5">
              <div className="flex flex-wrap justify-between gap-2">
                <span className="text-sm font-medium text-market-ink">{review.reviewerName}</span>
                <span className="text-sm text-market-muted" aria-label={`${review.rating} out of 5 stars`}>
                  {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-market-muted">{review.comment}</p>
              <time className="mt-2 block text-xs text-market-muted" dateTime={review.date}>
                {new Date(review.date).toLocaleDateString()}
              </time>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-sm text-market-muted">No reviews yet. Share the first impression.</p>
      )}

      <form onSubmit={handleSubmit} className="mt-8 grid gap-4 sm:max-w-xl">
        <h3 className="text-xs font-medium uppercase tracking-widest">Write a review</h3>
        <label className="grid gap-2 text-xs uppercase tracking-widest text-market-muted" htmlFor="review-name">
          Name
          <input id="review-name" required value={reviewName} onChange={(event) => setReviewName(event.target.value)} className="min-h-11 border border-market-border bg-primary px-3 text-sm normal-case tracking-normal text-primary" />
        </label>
        <label className="grid gap-2 text-xs uppercase tracking-widest text-market-muted" htmlFor="review-rating">
          Rating
          <select id="review-rating" value={reviewRating} onChange={(event) => setReviewRating(Number(event.target.value))} className="min-h-11 border border-market-border bg-primary px-3 text-sm tracking-normal text-primary">
            {[5, 4, 3, 2, 1].map((rating) => <option className="bg-primary text-primary" key={rating} value={rating}>{rating} / 5</option>)}
          </select>
        </label>
        <label className="grid gap-2 text-xs uppercase tracking-widest text-market-muted" htmlFor="review-comment">
          Review
          <textarea id="review-comment" required minLength={10} rows={4} value={reviewComment} onChange={(event) => setReviewComment(event.target.value)} className="min-h-24 resize-y border border-market-border bg-primary px-3 py-2 text-sm normal-case tracking-normal text-primary" />
        </label>
        <button type="submit" className="min-h-12 bg-market-ink px-6 text-xs uppercase tracking-widest text-market-paper sm:w-fit">
          Submit review
        </button>
      </form>
    </section>
  );
}
