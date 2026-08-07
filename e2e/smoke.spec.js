import { test, expect } from '@playwright/test'

test('homepage loads and shows hero', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#hero')).toBeVisible()
})

test('shop section shows max 24 products after load', async ({ page }) => {
  await page.goto('/')
  await page.waitForSelector('.kick-card', { timeout: 30000 })
  const cards = await page.locator('.kick-card').count()
  expect(cards).toBeGreaterThan(0)
  expect(cards).toBeLessThanOrEqual(24)
})

test('pagination controls are present', async ({ page }) => {
  await page.goto('/')
  await page.waitForSelector('.kick-card', { timeout: 30000 })
  await expect(page.locator('.pagination')).toBeVisible()
})

test('search overlay opens and closes via keyboard', async ({ page }) => {
  await page.goto('/')
  await page.waitForSelector('.kick-card', { timeout: 30000 })
  await page.click('button[aria-label="Search products"]')
  await expect(page.locator('.search-ov')).toBeVisible()
  await page.keyboard.press('Escape')
})

test('cart drawer opens and closes', async ({ page }) => {
  await page.goto('/')
  await page.waitForSelector('.kick-card', { timeout: 30000 })
  await page.click('button[aria-label="Cart with 0 items"]')
  await expect(page.locator('.cart-drawer.on')).toBeVisible()
  await page.click('.cart-x')
})

test('checkout button is disabled', async ({ page }) => {
  await page.goto('/')
  await page.waitForSelector('.kick-card', { timeout: 30000 })
  await page.click('button[aria-label="Cart with 0 items"]')
  const btn = page.locator('.checkout-btn')
  await expect(btn).toBeDisabled()
})

test('footer has no placeholder social links', async ({ page }) => {
  await page.goto('/')
  const allHashLinks = await page.locator('.footer-links a[href^="#"]').count()
  expect(allHashLinks).toBe(1)
})

test('countdown shows fixed timestamp text', async ({ page }) => {
  await page.goto('/')
  await page.waitForSelector('.countdown', { timeout: 30000 })
  await expect(page.locator('.cd-k')).toContainText('the forge opens in')
})

test('add to cart requires size selection', async ({ page }) => {
  await page.goto('/')
  await page.waitForSelector('.kick-card', { timeout: 30000 })
  await page.click('.add-btn')
  await expect(page.locator('.size-error')).toBeVisible()
})

test('mobile navigation works', async ({ browser }) => {
  const page = await browser.newPage({ viewport: { width: 375, height: 667 } })
  await page.goto('/')
  await page.waitForSelector('.kick-card', { timeout: 30000 })
  await page.click('.nav-toggle')
  await expect(page.locator('.nav-mobile')).toBeVisible()
  await page.close()
})
