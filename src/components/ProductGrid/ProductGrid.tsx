// პროდუქტების სიას ბარათების ადაპტირებულ ბადედ აწყობს.
import type { Product } from "../../types/product";
import { ProductCard } from "../ProductCard/ProductCard";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  // თითოეულ პროდუქტს სტაბილური ID-ით ვქმნით ცალკე ბარათად.
  return (
    <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
