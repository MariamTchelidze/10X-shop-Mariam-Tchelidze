import assert from "node:assert/strict";
import test from "node:test";
import { fetchProductById, fetchProducts } from "../src/api/products.ts";
import { calculateCartTotals, normalizePromoCode } from "../src/utils/cart.ts";
import { getStockStatus, lineTotal } from "../src/utils/product.ts";
import { getOrderStatus } from "../src/utils/orders.ts";

const product = (id, price, rating = 4) => ({
  id,
  title: `Artifact ${id}`,
  description: "A sample artifact.",
  category: "collectibles",
  price,
  discountPercentage: 0,
  rating,
  stock: 5,
  thumbnail: `https://example.test/${id}.jpg`,
  images: [`https://example.test/${id}.jpg`],
  reviews: [],
});

const savedFetch = globalThis.fetch;

test.afterEach(() => {
  globalThis.fetch = savedFetch;
});

test("catalog requests preserve search, category, sort, and pagination parameters", async () => {
  let requestedUrl = "";
  const responseProducts = [product(1, 30), product(2, 10)];
  globalThis.fetch = async (input) => {
    requestedUrl = String(input);
    return new globalThis.Response(JSON.stringify({ products: responseProducts, total: 24, skip: 12, limit: 12 }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };

  const result = await fetchProducts({ q: "ring", category: "collectibles", sort: "price-asc", page: 2 });
  const url = new globalThis.URL(requestedUrl);

  assert.equal(url.pathname, "/products/search");
  assert.equal(url.searchParams.get("q"), "ring");
  assert.equal(url.searchParams.get("limit"), "12");
  assert.equal(url.searchParams.get("skip"), "12");
  assert.equal(url.searchParams.get("sortBy"), "price");
  assert.equal(url.searchParams.get("order"), "asc");
  assert.deepEqual(result.products.map((item) => item.price), [10, 30]);
});

test("category catalog uses the category endpoint and keeps API sorting deterministic", async () => {
  let requestedUrl = "";
  globalThis.fetch = async (input) => {
    requestedUrl = String(input);
    return new globalThis.Response(JSON.stringify({ products: [product(1, 20), product(2, 10)], total: 2, skip: 0, limit: 12 }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };

  const result = await fetchProducts({ q: "", category: "home-decoration", sort: "price-desc", page: 1 });

  assert.equal(new globalThis.URL(requestedUrl).pathname, "/products/category/home-decoration");
  assert.deepEqual(result.products.map((item) => item.price), [20, 10]);
});

test("missing product IDs resolve to null instead of a broken detail record", async () => {
  globalThis.fetch = async () => new globalThis.Response("{}", { status: 404 });
  assert.equal(await fetchProductById(9999), null);
});

test("promo codes normalize safely and cart totals include the expected discount", () => {
  const items = [
    { productId: 1, title: "Ring", thumbnail: "ring.jpg", price: 100, discountPercentage: 10, stock: 3, quantity: 2 },
    { productId: 2, title: "Map", thumbnail: "map.jpg", price: 20, discountPercentage: 0, stock: 3, quantity: 1 },
  ];

  assert.equal(normalizePromoCode(" 10x10 "), "10X10");
  assert.equal(normalizePromoCode("TEN"), null);
  assert.deepEqual(calculateCartTotals(items, "10X10"), { subtotal: 200, discount: 20, total: 180 });
  assert.equal(lineTotal(100, 10, 2), 180);
});

test("stock labels cover available, low, and empty inventory", () => {
  assert.equal(getStockStatus(8).message, "In stock");
  assert.equal(getStockStatus(3).message, "Only 3 left!");
  assert.equal(getStockStatus(0).message, "Out of stock");
});

test("order timeline transitions are deterministic at each documented interval", () => {
  const order = { date: "2026-11-01T12:00:00.000Z" };
  const placedAt = Date.parse(order.date);

  assert.equal(getOrderStatus(order, placedAt + 59_999), "Processing");
  assert.equal(getOrderStatus(order, placedAt + 60_000), "Shipped");
  assert.equal(getOrderStatus(order, placedAt + 180_000), "Delivered");
});
