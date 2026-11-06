import { mkdir } from "node:fs/promises";
import { expect, test, type Page } from "@playwright/test";
import { dismissDesktopQrPrompt, expectNoHorizontalOverflow, waitForVisibleProductImage } from "./support/pageHelpers";

const captureDirectory = process.env.PLAYWRIGHT_BASE_URL
  ? "docs/compat/deployed"
  : "docs/compat";

function screenshotName(projectName: string, routeName: string): string {
  const viewportName = projectName.includes("mobile-375") ? "mobile-375" : "desktop";
  const browserName = projectName.startsWith("firefox") ? "firefox" : "chrome";
  return `${browserName}-${viewportName}-${routeName}.png`;
}

async function captureRoute(page: Page, projectName: string, route: string, routeName: string): Promise<void> {
  await page.goto(route);
  await dismissDesktopQrPrompt(page);
  await expectNoHorizontalOverflow(page);
  await page.screenshot({
    path: `${captureDirectory}/${screenshotName(projectName, routeName)}`,
    fullPage: false,
    animations: "disabled",
  });
}

test("CORE routes load directly, survive refresh, and produce browser evidence", async ({ page }, testInfo) => {
  await mkdir(captureDirectory, { recursive: true });

  await page.addInitScript(() => {
    if (sessionStorage.getItem("playwright-qr-initialized") !== "true") {
      sessionStorage.removeItem("hasSeenQrModal");
      sessionStorage.setItem("playwright-qr-initialized", "true");
    }
  });
  await page.goto("/");
  const qrDialog = page.getByRole("dialog", { name: /To use our website on your phone/i });
  if (testInfo.project.name.includes("mobile-375")) {
    await expect(qrDialog).toHaveCount(0);
  } else {
    await expect(qrDialog).toBeVisible();
  }
  await dismissDesktopQrPrompt(page);
  // ინიციალიზაციის მარკერი QR flag-ის გასუფთავებას მხოლოდ პირველ გვერდზე უშვებს.

  await captureRoute(page, testInfo.project.name, "/", "catalog");
  await expect(page.getByRole("heading", { name: "Catalog", level: 2 })).toBeVisible();
  await waitForVisibleProductImage(page);
  await page.screenshot({
    path: `${captureDirectory}/${screenshotName(testInfo.project.name, "catalog")}`,
    fullPage: false,
    animations: "disabled",
  });

  // URL პირდაპირ იხსნება და refresh-ის შემდეგაც product route-ზე რჩება.
  await page.goto("/products/93");
  await dismissDesktopQrPrompt(page);
  await expect(page.locator("main h1").first()).toBeVisible();
  await expect(page).toHaveURL(/\/products\/93$/);
  await page.reload();
  await expect(page).toHaveURL(/\/products\/93$/);
  await expect(page.locator("main h1").first()).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await page.screenshot({
    path: `${captureDirectory}/${screenshotName(testInfo.project.name, "product")}`,
    fullPage: false,
    animations: "disabled",
  });

  await captureRoute(page, testInfo.project.name, "/cart", "cart");
  await expect(page.getByRole("heading", { name: /Your cart/i, level: 1 })).toBeVisible();

  await captureRoute(page, testInfo.project.name, "/login", "login");
  await expect(page.getByRole("heading", { name: "Log in", level: 1 })).toBeVisible();

  // Checkout-ის სურათისთვის ვიწყებთ ერთი `lotr_cart` ელემენტით და demo სესიით.
  await page.addInitScript(() => {
    localStorage.setItem("10x-shop-current-user", JSON.stringify({
      username: "playwright@example.com",
      fullName: "Playwright Tester",
      email: "playwright@example.com",
      address: "",
      isLoggedIn: true,
    }));
    localStorage.setItem("lotr_cart", JSON.stringify({
      items: [{
        productId: 93,
        title: "Browser test artifact",
        thumbnail: "/images/Logo-display.jpg",
        price: 10,
        discountPercentage: 0,
        stock: 3,
        quantity: 1,
      }],
      promoCode: null,
    }));
  });
  await page.goto("/checkout");
  await dismissDesktopQrPrompt(page);
  await expect(page.getByRole("heading", { name: "Checkout", level: 1 })).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await page.screenshot({
    path: `${captureDirectory}/${screenshotName(testInfo.project.name, "checkout")}`,
    fullPage: false,
    animations: "disabled",
  });

  await page.goto("/profile");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await page.screenshot({
    path: `${captureDirectory}/${screenshotName(testInfo.project.name, "profile")}`,
    fullPage: false,
    animations: "disabled",
  });

  await page.goto("/products/not-a-product-id");
  await dismissDesktopQrPrompt(page);
  await expect(page.getByRole("heading", { name: "Page not found", level: 1 })).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await page.screenshot({
    path: `${captureDirectory}/${screenshotName(testInfo.project.name, "not-found")}`,
    fullPage: false,
    animations: "disabled",
  });
});

test("cart remains public and checkout redirects guests to login", async ({ page }) => {
  await page.goto("/cart");
  await dismissDesktopQrPrompt(page);
  await expect(page.getByRole("heading", { name: /Your cart/i, level: 1 })).toBeVisible();

  await page.goto("/checkout");
  await dismissDesktopQrPrompt(page);
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "Log in", level: 1 })).toBeVisible();
});
