// პროდუქტის შეფასებებს ინახავს და შეფასების სიასა და ფორმას აერთიანებს.
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import type { Product, Review } from "../../types/product";
import { ReviewForm } from "./ReviewForm";
import { ReviewList } from "./ReviewList";

interface ProductReviewsContainerProps {
  product: Product;
}

function readSavedReviews(productId: number): Review[] {
  // თითოეული პროდუქტის შეფასებას ცალკე გასაღებით ვკითხულობთ და არასწორ მონაცემებს ვფილტრავთ.
  try {
    const value: unknown = JSON.parse(
      localStorage.getItem(`10x-shop-reviews-${productId}`) ?? "[]",
    );
    if (!Array.isArray(value)) return [];
    return value.filter(isReview);
  } catch {
    return [];
  }
}

function isReview(value: unknown): value is Review {
  if (typeof value !== "object" || value === null) return false;
  return (
    "rating" in value && typeof value.rating === "number" &&
    "comment" in value && typeof value.comment === "string" &&
    "date" in value && typeof value.date === "string" &&
    "reviewerName" in value && typeof value.reviewerName === "string"
  );
}

export function ProductReviewsContainer({ product }: ProductReviewsContainerProps) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [savedReviews, setSavedReviews] = useState<Review[]>(() =>
    readSavedReviews(product.id),
  );
  const reviewerName = user.fullName.trim() || user.email || user.username || "Traveler";
  const reviews = [...product.reviews, ...savedReviews];

  useEffect(() => {
    // სხვა პროდუქტის გახსნისას შესაბამისი ID-ით შენახულ შეფასებებს ვტვირთავთ.
    setSavedReviews(readSavedReviews(product.id));
  }, [product.id]);

  const handleReviewSubmit = (review: Omit<Review, "date">) => {
    // ახალ შეფასებას თარიღს ვუმატებთ და ამ პროდუქტის სიაში ვინახავთ.
    const nextReview: Review = { ...review, date: new Date().toISOString() };
    const nextReviews = [...savedReviews, nextReview];
    setSavedReviews(nextReviews);
    localStorage.setItem(`10x-shop-reviews-${product.id}`, JSON.stringify(nextReviews));
    addToast("YOUR TAVERN TALE HAS BEEN RECORDED", "success");
  };

  return (
    <section className="mt-14 border-t border-market-border pt-10 sm:mt-20" aria-labelledby="tavern-tales-heading">
      <header className="mb-7 sm:mb-9">
        <p className="text-[10px] uppercase tracking-[0.18em] text-gold">Voices from across the realm</p>
        <h2 id="tavern-tales-heading" className="mt-3 font-display text-2xl text-market-ink sm:text-3xl">
          Tavern Tales &amp; Lore Reviews
          <span className="ml-2 font-sans text-sm text-market-muted">({reviews.length})</span>
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-market-muted">
          Notes left by travelers who have encountered this treasure along the road.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:gap-12">
        <ReviewList reviews={reviews} />
        <ReviewForm
          isLoggedIn={user.isLoggedIn}
          reviewerName={reviewerName}
          onSubmit={handleReviewSubmit}
        />
      </div>
    </section>
  );
}
