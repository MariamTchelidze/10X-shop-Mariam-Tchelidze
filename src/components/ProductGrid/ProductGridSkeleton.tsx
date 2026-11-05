const skeletonCards = Array.from({ length: 12 }, (_, index) => index);

// API-დან პასუხის მიღებამდე ბარათების სივრცეს წინასწარ ვზოგავთ.
export function ProductGridSkeleton() {
  return (
    <div role="status" aria-label="Loading products" aria-busy="true">
      <span className="sr-only">Loading products…</span>
      <div aria-hidden="true" className="grid grid-cols-1 gap-x-5 gap-y-10 min-[481px]:grid-cols-2 min-[768px]:grid-cols-3 min-[1025px]:grid-cols-4">
        {skeletonCards.map((card) => (
          <article key={card} className="min-w-0">
            <div className="aspect-[3/4] w-full animate-pulse bg-market-surface" />
            <div className="space-y-3 pt-4">
              <div className="h-4 w-4/5 animate-pulse bg-market-surface" />
              <div className="h-3 w-2/5 animate-pulse bg-market-surface" />
              <div className="h-4 w-1/3 animate-pulse bg-market-surface" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
