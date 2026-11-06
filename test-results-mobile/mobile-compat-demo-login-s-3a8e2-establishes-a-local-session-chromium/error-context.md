# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mobile-compat.spec.ts >> demo login submits and establishes a local session
- Location: e2e\mobile-compat.spec.ts:116:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "http://127.0.0.1:4187/login", waiting until "load"

```

# Test source

```ts
  20  |   username: "mobile-check@example.test",
  21  |   fullName: "Mobile Check",
  22  |   firstName: "Mobile",
  23  |   lastName: "Check",
  24  |   email: "mobile-check@example.test",
  25  |   address: "1 Shire Lane",
  26  |   phone: "0000000000",
  27  |   isLoggedIn: true,
  28  | };
  29  | 
  30  | const savedCart = {
  31  |   items: [{
  32  |     productId: sampleProduct.id,
  33  |     title: sampleProduct.title,
  34  |     thumbnail: sampleProduct.thumbnail,
  35  |     price: sampleProduct.price,
  36  |     discountPercentage: sampleProduct.discountPercentage,
  37  |     stock: sampleProduct.stock,
  38  |     quantity: 1,
  39  |   }],
  40  |   promoCode: null,
  41  | };
  42  | 
  43  | async function prepareMobilePage(page: Page): Promise<void> {
  44  |   await page.setViewportSize({ width: 375, height: 812 });
  45  |   await page.addInitScript(({ user, cart }) => {
  46  |     localStorage.setItem("10x-shop-current-user", JSON.stringify(user));
  47  |     localStorage.setItem("lotr_cart", JSON.stringify(cart));
  48  |     localStorage.setItem("hasSeenQrModal", "true");
  49  |   }, { user: savedUser, cart: savedCart });
  50  | 
  51  |   await page.route("https://dummyjson.com/**", async (route) => {
  52  |     const pathname = new URL(route.request().url()).pathname;
  53  |     const payload = pathname === "/products/categories"
  54  |       ? [{ slug: "beauty", name: "Beauty", url: "https://dummyjson.com/products/category/beauty" }]
  55  |       : pathname === "/products/93"
  56  |         ? sampleProduct
  57  |         : { products: [sampleProduct], total: 1, skip: 0, limit: 12 };
  58  | 
  59  |     await route.fulfill({
  60  |       status: 200,
  61  |       contentType: "application/json",
  62  |       body: JSON.stringify(payload),
  63  |     });
  64  |   });
  65  | }
  66  | 
  67  | const pages = [
  68  |   { path: "/", slug: "catalog", heading: "Catalog" },
  69  |   { path: "/products/93", slug: "product", heading: "Green Chili Pepper" },
  70  |   { path: "/cart", slug: "cart", heading: "Your cart" },
  71  |   { path: "/checkout", slug: "checkout", heading: "Checkout" },
  72  |   { path: "/profile", slug: "profile", heading: "My account" },
  73  |   { path: "/login", slug: "login", heading: "Log in" },
  74  |   { path: "/this-route-does-not-exist", slug: "not-found", heading: "Page not found" },
  75  | ] as const;
  76  | 
  77  | for (const pageCase of pages) {
  78  |   test(`375px ${pageCase.slug} layout has no horizontal overflow`, async ({ page }, testInfo) => {
  79  |     await prepareMobilePage(page);
  80  |     await page.goto(pageCase.path);
  81  |     await expect(page.getByRole("heading", { name: pageCase.heading })).toBeVisible();
  82  |     await expect(page.getByRole("navigation", { name: "Primary mobile navigation" })).toBeVisible();
  83  | 
  84  |     const widths = await page.evaluate(() => ({
  85  |       viewport: window.innerWidth,
  86  |       document: document.documentElement.scrollWidth,
  87  |       body: document.body.scrollWidth,
  88  |     }));
  89  |     expect(widths.viewport).toBe(375);
  90  |     expect(widths.document).toBeLessThanOrEqual(widths.viewport);
  91  |     expect(widths.body).toBeLessThanOrEqual(widths.viewport);
  92  | 
  93  |     if (pageCase.slug === "catalog") {
  94  |       const obstructedFilters = await page.evaluate(() => {
  95  |         const nav = document.querySelector<HTMLElement>('nav[aria-label="Primary mobile navigation"]');
  96  |         if (!nav) return ["mobile navigation is missing"];
  97  |         const navRect = nav.getBoundingClientRect();
  98  |         return ["catalog-search", "catalog-category", "catalog-sort"].filter((id) => {
  99  |           const field = document.getElementById(id);
  100 |           if (!field) return true;
  101 |           const rect = field.getBoundingClientRect();
  102 |           return rect.bottom > navRect.top && rect.top < navRect.bottom;
  103 |         });
  104 |       });
  105 |       expect(obstructedFilters).toEqual([]);
  106 |     }
  107 | 
  108 |     await page.screenshot({
  109 |       path: resolve("docs/compat", `${testInfo.project.name === "chromium" ? "chrome" : "firefox"}-mobile-375-${pageCase.slug}.png`),
  110 |       fullPage: false,
  111 |       animations: "disabled",
  112 |     });
  113 |   });
  114 | }
  115 | 
  116 | test("demo login submits and establishes a local session", async ({ page }) => {
  117 |   page.on("console", (message) => console.log(`[browser:${message.type()}] ${message.text()}`));
  118 |   page.on("pageerror", (error) => console.log(`[browser error] ${error.message}`));
  119 |   await page.setViewportSize({ width: 375, height: 812 });
> 120 |   await page.goto("/login");
      |              ^ Error: page.goto: Test timeout of 30000ms exceeded.
  121 |   await page.locator("#email").fill("demo@example.com");
  122 |   await page.locator("#password").fill("realm123");
  123 |   await page.getByRole("button", { name: "Log in" }).click();
  124 | 
  125 |   const postSubmitState = await page.evaluate(() => ({
  126 |     url: window.location.href,
  127 |     savedUser: localStorage.getItem("10x-shop-current-user"),
  128 |     alerts: Array.from(document.querySelectorAll('[role="alert"]'), (node) => node.textContent),
  129 |   }));
  130 |   await expect(page, JSON.stringify(postSubmitState)).toHaveURL("http://127.0.0.1:4187/");
  131 |   const sessionWasSaved = await page.evaluate(() => {
  132 |     const value: unknown = JSON.parse(localStorage.getItem("10x-shop-current-user") ?? "null");
  133 |     return typeof value === "object" && value !== null && "isLoggedIn" in value && value.isLoggedIn === true;
  134 |   });
  135 |   expect(sessionWasSaved).toBe(true);
  136 | });
  137 | 
  138 | test("375px account drawer fills the viewport and prevents background scrolling", async ({ page }) => {
  139 |   await prepareMobilePage(page);
  140 |   await page.goto("/");
  141 |   await page.getByRole("button", { name: "Open account and settings" }).click();
  142 | 
  143 |   const drawer = page.getByRole("dialog", { name: "Account and settings" });
  144 |   await expect(drawer).toBeVisible();
  145 |   const dimensions = await drawer.evaluate((element) => {
  146 |     const rect = element.getBoundingClientRect();
  147 |     return { width: rect.width, height: rect.height, bodyOverflow: document.body.style.overflow };
  148 |   });
  149 |   expect(dimensions.width).toBe(375);
  150 |   expect(dimensions.height).toBe(812);
  151 |   expect(dimensions.bodyOverflow).toBe("hidden");
  152 | 
  153 |   await page.screenshot({
  154 |     path: resolve("docs/compat", `${test.info().project.name === "chromium" ? "chrome" : "firefox"}-mobile-375-account-menu.png`),
  155 |     fullPage: false,
  156 |     animations: "disabled",
  157 |   });
  158 | });
  159 | 
```