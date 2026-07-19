import { expect, test } from "@playwright/test";

test("navigates the six-domain field guide", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Run smarter from gate to finish.",
  );
  await expect(page.locator(".domain-program li")).toHaveCount(6);

  await page
    .getByRole("link", { name: /Mechanics/ })
    .last()
    .click();
  await expect(page).toHaveURL(/\/mechanics$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Mechanics");
});

test("searches headings and follows a deep link", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Search field guide/ }).click();

  const dialog = page.getByRole("dialog", { name: "Search the field guide" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Close" }).click();
  await expect(dialog).toBeHidden();
  if (testInfo.project.name === "desktop") await page.keyboard.press("Control+k");
  else await page.getByRole("button", { name: "Search field guide" }).click();
  await expect(dialog).toBeVisible();
  await dialog.getByRole("searchbox").fill("Stamina vs Speed");

  const result = dialog.locator(".search-result-item a", {
    hasText: "Matched heading: Stamina vs Speed",
  });
  await expect(result.first()).toBeVisible();
  await result.first().click();
  await expect(page).toHaveURL(/\/mechanics\/stats#stamina-vs-speed$/);
});

test("renders accessible media and contains wide content", async ({ page }) => {
  await page.goto("/strategy/support-card-builds");

  const image = page.locator(".article-body img").first();
  await expect(image).toHaveAttribute("alt", /Visual reference/);
  await expect(image).toHaveAttribute("loading", "lazy");
  await expect(image).toHaveAttribute("width", /\d+/);

  await page.goto("/banners/what-umas-are-worth-leveling");
  await expect(page.locator(".article-body table")).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
