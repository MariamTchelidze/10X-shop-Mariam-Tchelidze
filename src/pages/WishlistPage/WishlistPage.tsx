import { Link } from "react-router-dom";
import { ProductGrid } from "../../components/ProductGrid/ProductGrid";
import { useWishlist } from "../../context/WishlistContext";

export function WishlistPage() {
  const { items } = useWishlist();

  if (items.length === 0) {
    return (
      <main className="mx-auto flex min-h-[55vh] max-w-7xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-[10px] uppercase tracking-[0.2em] text-gold">Treasures saved for another day</p>
        <h1 className="mt-4 font-display text-3xl text-market-ink sm:text-4xl">Your wishlist is empty</h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-market-muted">Follow your favorite finds through the realm and keep them close here.</p>
        <Link to="/" className="mt-7 inline-flex min-h-12 items-center bg-market-ink px-8 text-xs uppercase tracking-[0.14em] text-market-paper transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold">Browse the market</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-market-border pb-5 sm:mb-10">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-gold">Treasures saved for another day</p>
          <h1 className="mt-2 font-display text-3xl text-market-ink sm:text-4xl">My wishlist</h1>
        </div>
        <p className="text-xs uppercase tracking-widest text-market-muted">{items.length} {items.length === 1 ? "treasure" : "treasures"}</p>
      </header>
      <ProductGrid products={items} />
    </main>
  );
}
