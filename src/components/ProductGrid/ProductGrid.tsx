// პროდუქტების სიას ბარათების ადაპტირებულ ბადედ აწყობს.
import type { Product } from "../../types/product";
import { ProductCard } from "../ProductCard/ProductCard";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  // თითოეულ პროდუქტს სტაბილური ID-ით ვქმნით ცალკე ბარათად.
  return (
    <div className="grid grid-cols-1 gap-x-5 gap-y-10 min-[481px]:grid-cols-2 min-[768px]:grid-cols-3 min-[1025px]:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
