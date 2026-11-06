import { expect, test } from "@playwright/test";

const DEMO_URL =
  "https://treasures-of-middle-earth-git-main-mariam-tchelidze-s-projects.vercel.app/?page=1";

test("records a catalog-to-order demo journey", async ({ page }) => {
  test.setTimeout(180_000);

  // დესკტოპის QR ფანჯარას დემოს დაწყებისთანავე ვხურავთ.
  await page.goto(DEMO_URL, { waitUntil: "domcontentloaded" });
  const continueOnDesktop = page.getByRole("button", { name: "Continue on the desktop." });
  if (await continueOnDesktop.isVisible().catch(() => false)) {
    await continueOnDesktop.click();
  }
  await page.waitForTimeout(900);
  await expect(page.getByRole("heading", { name: "Catalog" })).toBeVisible();

  // კატალოგს ვათვალიერებთ და ძიების 400 ms დაყოვნებას ვიდეოშიც ვაჩვენებთ.
  await page.evaluate(() => window.scrollTo({ top: 480, behavior: "smooth" }));
  await page.waitForTimeout(700);
  const searchInput = page.locator("#catalog-search");
  await searchInput.scrollIntoViewIfNeeded();
  await searchInput.fill("phone");
  await page.waitForTimeout(700);
  await expect(page).toHaveURL(/q=phone/);

  // საძიებო ტექსტის შემდეგ კატეგორიას ვირჩევთ; აპი ამ დროს ძიებას ასუფთავებს.
  const categorySelect = page.locator("#catalog-category");
  await expect(categorySelect).toBeEnabled();
  const categorySlug = await categorySelect.locator("option").nth(1).getAttribute("value");
  if (!categorySlug) {
    throw new Error("The catalog has no available category option.");
  }
  await categorySelect.selectOption(categorySlug);
  await page.waitForTimeout(900);
  await expect(page).toHaveURL(/category=/);

  // პირველ კატეგორიის პროდუქტს ვხსნით დეტალურ გვერდზე.
  const firstProductLink = page.locator("main article a[href^='/products/']").first();
  await expect(firstProductLink).toBeVisible();
  await firstProductLink.click();
  await expect(page).toHaveURL(/\/products\/\d+/);
  await page.waitForTimeout(700);

  // რაოდენობას ვზრდით, პროდუქტს ჩანთაში ვამატებთ და კალათას ვხსნით.
  const increaseQuantity = page.getByRole("button", { name: "Increase quantity" });
  await expect(increaseQuantity).toBeEnabled();
  await increaseQuantity.click();
  await page.waitForTimeout(350);
  await page.getByRole("button", { name: "Add to cart" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Added to cart." })).toBeVisible();
  await page.waitForTimeout(700);
  await page.getByRole("link", { name: /^Cart/ }).click();
  await expect(page.getByRole("heading", { name: "Your cart" })).toBeVisible();
  await page.waitForTimeout(800);

  // სტუმრის Checkout-ზე გადასვლა Login-ზე გადაამისამართებს.
  await page.getByRole("link", { name: "Proceed to checkout" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.waitForTimeout(700);

  // დემო შესვლა იყენებს სასწავლო აპის ლოკალურ ანგარიშის ნაკადს.
  await page.locator("#email").fill("demo@example.com");
  await page.locator("#password").fill("realm123");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/checkout$/);
  await page.waitForTimeout(700);

  // ვავსებთ მხოლოდ დემო checkout-ის საკონტაქტო ველებს; გადახდა არ სრულდება.
  await page.getByLabel("Full name").fill("Demo Traveler");
  await page.getByLabel("Email").fill("demo@example.com");
  await page.getByLabel("Address").fill("1 Shire Lane");
  await page.getByLabel("City").fill("Hobbiton");
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "Place order" }).click();

  await expect(page).toHaveURL(/\/order-success$/);
  await expect(page.getByText("Thank you! Your order has been placed.")).toBeVisible();
  await page.waitForTimeout(2_000);
});
