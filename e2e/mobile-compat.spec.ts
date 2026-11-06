import { expect, test, type Page } from "@playwright/test";
import { resolve } from "node:path";

const sampleProduct = {
  id: 93,
  title: "Green Chili Pepper",
  description: "A bright green pepper from the Shire market.",
  category: "beauty",
  brand: "Middle-earth Market",
  price: 9.99,
  discountPercentage: 10,
  rating: 4.5,
  stock: 8,
  thumbnail: "/images/Logo-optimized.png",
  images: ["/images/Logo-optimized.png"],
  reviews: [],
};

const savedUser = {
  username: "mobile-check@example.test",
  fullName: "Mobile Check",
  firstName: "Mobile",
  lastName: "Check",
  email: "mobile-check@example.test",
  address: "1 Shire Lane",
  phone: "0000000000",
  isLoggedIn: true,
};

const savedCart = {
  items: [{
    productId: sampleProduct.id,
    title: sampleProduct.title,
    thumbnail: sampleProduct.thumbnail,
    price: sampleProduct.price,
    discountPercentage: sampleProduct.discountPercentage,
    stock: sampleProduct.stock,
    quantity: 1,
  }],
  promoCode: null,
};

async function prepareMobilePage(page: Page): Promise<void> {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.addInitScript(({ user, cart }) => {
    localStorage.setItem("10x-shop-current-user", JSON.stringify(user));
    localStorage.setItem("lotr_cart", JSON.stringify(cart));
    localStorage.setItem("hasSeenQrModal", "true");
  }, { user: savedUser, cart: savedCart });

  await page.route("https://dummyjson.com/**", async (route) => {
    const pathname = new URL(route.request().url()).pathname;
    const payload = pathname === "/products/categories"
      ? [{ slug: "beauty", name: "Beauty", url: "https://dummyjson.com/products/category/beauty" }]
      : pathname === "/products/93"
        ? sampleProduct
        : { products: [sampleProduct], total: 1, skip: 0, limit: 12 };

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(payload),
    });
  });
}

const pages = [
  { path: "/", slug: "catalog", heading: "Catalog" },
  { path: "/products/93", slug: "product", heading: "Green Chili Pepper" },
  { path: "/cart", slug: "cart", heading: "Your cart" },
  { path: "/checkout", slug: "checkout", heading: "Checkout" },
  { path: "/profile", slug: "profile", heading: "My account" },
  { path: "/login", slug: "login", heading: "Log in" },
  { path: "/this-route-does-not-exist", slug: "not-found", heading: "Page not found" },
] as const;

for (const pageCase of pages) {
  test(`375px ${pageCase.slug} layout has no horizontal overflow`, async ({ page }, testInfo) => {
    await prepareMobilePage(page);
    await page.goto(pageCase.path);
    await expect(page.getByRole("heading", { name: pageCase.heading })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Primary mobile navigation" })).toBeVisible();

    const widths = await page.evaluate(() => ({
      viewport: window.innerWidth,
      document: document.documentElement.scrollWidth,
      body: document.body.scrollWidth,
    }));
    expect(widths.viewport).toBe(375);
    expect(widths.document).toBeLessThanOrEqual(widths.viewport);
    expect(widths.body).toBeLessThanOrEqual(widths.viewport);

    if (pageCase.slug === "catalog") {
      const obstructedFilters = await page.evaluate(() => {
        const nav = document.querySelector<HTMLElement>('nav[aria-label="Primary mobile navigation"]');
        if (!nav) return ["mobile navigation is missing"];
        const navRect = nav.getBoundingClientRect();
        return ["catalog-search", "catalog-category", "catalog-sort"].filter((id) => {
          const field = document.getElementById(id);
          if (!field) return true;
          const rect = field.getBoundingClientRect();
          return rect.bottom > navRect.top && rect.top < navRect.bottom;
        });
      });
      expect(obstructedFilters).toEqual([]);
    }

    await page.screenshot({
      path: resolve("docs/compat", `${testInfo.project.name === "chromium" ? "chrome" : "firefox"}-mobile-375-${pageCase.slug}.png`),
      fullPage: false,
      animations: "disabled",
    });
  });
}

test("demo login submits and establishes a local session", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/login");
  await page.locator("#email").fill("demo@example.com");
  await page.locator("#password").fill("realm123");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL("http://127.0.0.1:4187/");
  const sessionWasSaved = await page.evaluate(() => {
    const value: unknown = JSON.parse(localStorage.getItem("10x-shop-current-user") ?? "null");
    return typeof value === "object" && value !== null && "isLoggedIn" in value && value.isLoggedIn === true;
  });
  expect(sessionWasSaved).toBe(true);
});

test("375px account drawer fills the viewport and prevents background scrolling", async ({ page }) => {
  await prepareMobilePage(page);
  await page.goto("/");
  await page.getByRole("button", { name: "Open account and settings" }).click();

  const drawer = page.getByRole("dialog", { name: "Account and settings" });
  await expect(drawer).toBeVisible();
  const dimensions = await drawer.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return { width: rect.width, height: rect.height, bodyOverflow: document.body.style.overflow };
  });
  expect(dimensions.width).toBe(375);
  expect(dimensions.height).toBe(812);
  expect(dimensions.bodyOverflow).toBe("hidden");

  await page.screenshot({
    path: resolve("docs/compat", `${test.info().project.name === "chromium" ? "chrome" : "firefox"}-mobile-375-account-menu.png`),
    fullPage: false,
    animations: "disabled",
  });
});
