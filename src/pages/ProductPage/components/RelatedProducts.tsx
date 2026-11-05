// იმავე კატეგორიის მსგავს პროდუქტებს იტვირთავს და აჩვენებს.
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { fetchProducts } from "../../../api/products";
import { useRealm } from "../../../context/RealmContext";
import type { Product } from "../../../types/product";
import { discountedPrice } from "../../../utils/product";
import { ProductImage } from "../../../components/ProductImage/ProductImage";

interface RelatedProductsProps {
  product: Product;
}

export function RelatedProducts({ product }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const { formatCurrency } = useRealm();

  useEffect(() => {
        // კატეგორიის შეცვლისას ძველ შედეგებს ვშლით და წინა მოთხოვნას ვაუქმებთ.
    const controller = new AbortController();
    setProducts([]);

    void fetchProducts(
      { q: "", category: product.category, sort: "", page: 1 },
      controller.signal,
    )
      .then((response) => {
        if (!controller.signal.aborted) {
                    // მიმდინარე პროდუქტს ვფილტრავთ და მაქსიმუმ ოთხ მსგავს პროდუქტს ვტოვებთ.
          setProducts(
            response.products.filter((entry) => entry.id !== product.id).slice(0, 4),
          );
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setProducts([]);
      });

    return () => controller.abort();
  }, [product.category, product.id]);

  if (products.length === 0) return null;

  return (
    <section className="mt-14 border-t border-market-border pt-10 sm:mt-20" aria-labelledby="related-heading">
      <h2 id="related-heading" className="font-display text-2xl text-market-ink">You may also like</h2>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
        {products.map((related) => (
          <Link key={related.id} to={`/products/${related.id}`} className="group min-w-0">
            <ProductImage src={related.thumbnail} alt={related.title} loading="lazy" width={600} height={800} className="aspect-[3/4] w-full bg-market-surface object-cover" />
            <h3 className="mt-3 truncate text-xs text-market-ink group-hover:underline">{related.title}</h3>
            <p className="mt-1 text-xs text-market-muted">
              {formatCurrency(discountedPrice(related.price, related.discountPercentage))}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
