import { expect, type Page } from "@playwright/test";

/** Desktop-Only QR prompt-ის დახურვას ამოწმებს ისე, რომ მობილურზე ზედმეტი მოქმედება არ სცადოს. */
export async function dismissDesktopQrPrompt(page: Page): Promise<void> {
  const dialog = page.getByRole("dialog", { name: /To use our website on your phone/i });
  if (await dialog.isVisible().catch(() => false)) {
    await dialog.getByRole("button", { name: "Continue on the desktop." }).click();
    await expect(dialog).toBeHidden();
  }
}

/** მიმდინარე ხედში გვერდის სიგანე viewport-ს არ სცდება. */
export async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  const hasOverflow = await page.evaluate(() =>
    document.documentElement.scrollWidth > window.innerWidth + 1,
  );
  expect(hasOverflow, "page should not overflow horizontally").toBe(false);
}

/** პროდუქტის სურათების ჩატვირთვას ველოდებით, რომ მტკიცებულების სქრინშოტი გამოსადეგი იყოს. */
export async function waitForVisibleProductImage(page: Page): Promise<void> {
  const image = page.locator("main img").first();
  await image.waitFor({ state: "visible" });
  await expect
    .poll(() => image.evaluate((element) => (element as HTMLImageElement).complete))
    .toBe(true);
}
