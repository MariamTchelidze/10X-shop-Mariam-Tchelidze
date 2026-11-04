// შესული მომხმარებლისთვის ახალი შეფასების ფორმას ამოწმებს და აგზავნის.
import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import type { Review } from "../../types/product";
import { StarRating } from "./StarRating";

type NewReview = Omit<Review, "date">;

interface ReviewFormProps {
  isLoggedIn: boolean;
  reviewerName: string;
  onSubmit: (review: NewReview) => void;
}

const fieldClass = "min-h-12 w-full border border-market-border bg-primary px-3 text-sm text-primary outline-none transition-colors placeholder:text-market-muted focus:border-gold";

export function ReviewForm({ isLoggedIn, reviewerName, onSubmit }: ReviewFormProps) {
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [realm, setRealm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // ველების გასუფთავებულ მნიშვნელობებს ვამოწმებთ; შეცდომისას შეყვანილ ტექსტს ვინარჩუნებთ.
    const normalizedTitle = title.trim();
    const normalizedComment = comment.trim();
    const normalizedRealm = realm.trim();

    if (!isLoggedIn) {
      setError("Sign in before leaving a tavern tale.");
      return;
    }
    if (!normalizedTitle) {
      setError("Give your tale a title.");
      return;
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      setError("Choose a star rating from 1 to 5.");
      return;
    }
    if (normalizedComment.length < 10) {
      setError("Your tale must be at least 10 characters long.");
      return;
    }
    if (!normalizedRealm) {
      setError("Add your traveller title or realm.");
      return;
    }

    onSubmit({
      title: normalizedTitle,
      rating,
      comment: normalizedComment,
      reviewerName,
      realm: normalizedRealm,
    });
    setTitle("");
    setRating(5);
    setComment("");
    setRealm("");
    setError("");
  };

  if (!isLoggedIn) {
    // სტუმარს ფორმის ნაცვლად ანგარიშზე შესვლის მოქმედებას ვთავაზობთ.
    return (
      <div className="border border-market-border bg-market-surface p-5 sm:p-6">
        <h3 className="font-display text-lg text-market-ink">Join the travelers’ table</h3>
        <p className="mt-2 text-sm leading-6 text-market-muted">
          Sign in to share your own tale about this treasure.
        </p>
        <Link
          to="/login"
          className="mt-4 inline-flex min-h-11 items-center bg-market-ink px-5 text-xs uppercase tracking-[0.12em] text-market-paper transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          Sign in to write a review
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 border border-market-border bg-market-surface p-5 sm:p-7">
      <div>
        <h3 className="font-display text-xl text-market-ink">Leave a tavern tale</h3>
        <p className="mt-1 text-xs text-market-muted">Your name will appear as {reviewerName}.</p>
      </div>

      <label htmlFor="tavern-review-title" className="grid gap-2 text-[10px] uppercase tracking-[0.14em] text-market-muted">
        Tale title
        <input id="tavern-review-title" name="title" required maxLength={100} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="A treasure worth the journey" className={fieldClass} />
      </label>

      <fieldset className="grid gap-2">
        <legend className="text-[10px] uppercase tracking-[0.14em] text-market-muted">Star rating</legend>
        <StarRating rating={rating} onChange={setRating} label="Choose a star rating" />
      </fieldset>

      <label htmlFor="tavern-review-comment" className="grid gap-2 text-[10px] uppercase tracking-[0.14em] text-market-muted">
        Your tale
        <textarea id="tavern-review-comment" name="comment" required minLength={10} rows={5} value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Tell fellow travelers what you discovered..." className={`${fieldClass} min-h-32 resize-y py-3 font-sans leading-6`} />
      </label>

      <label htmlFor="tavern-review-realm" className="grid gap-2 text-[10px] uppercase tracking-[0.14em] text-market-muted">
        Traveller title / realm
        <input id="tavern-review-realm" name="realm" required maxLength={80} value={realm} onChange={(event) => setRealm(event.target.value)} placeholder="Strider from Bree" className={fieldClass} />
      </label>

      {error && <p role="alert" className="text-sm text-error">{error}</p>}
      <button type="submit" className="min-h-12 bg-market-ink px-6 text-xs font-medium uppercase tracking-[0.14em] text-market-paper transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold sm:w-fit">
        Share your tale
      </button>
    </form>
  );
}
