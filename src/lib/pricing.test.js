import { describe, it, expect } from 'vitest'
import {
  effectivePrice,
  compareAtPrice,
  formatINR,
  emiMonthly,
  isPurchasable,
  hasValidSizes,
  getSizes,
  primaryImage,
  lineTotal,
  cartTotal,
  cartCount,
  shippingRemaining,
  shippingProgress,
  FREE_SHIPPING_THRESHOLD,
} from './pricing.js'

describe('pricing', () => {
  it('effectivePrice returns price for non-sale product', () => {
    expect(effectivePrice({ price: 100, on_sale: false })).toBe(100)
  })
  it('effectivePrice returns sale_price for sale product', () => {
    expect(effectivePrice({ price: 100, on_sale: true, sale_price: 80 })).toBe(80)
  })
  it('effectivePrice returns 0 for null product', () => {
    expect(effectivePrice(null)).toBe(0)
  })
  it('compareAtPrice returns compare_at for sale product', () => {
    expect(compareAtPrice({ on_sale: true, compare_at: 120, sale_price: 80 })).toBe(120)
  })
  it('compareAtPrice returns regular_price when no compare_at', () => {
    expect(compareAtPrice({ on_sale: true, regular_price: 120, sale_price: 80 })).toBe(120)
  })
  it('compareAtPrice returns null for non-sale product', () => {
    expect(compareAtPrice({ on_sale: false, price: 100 })).toBeNull()
  })
  it('formatINR formats with rupee symbol', () => {
    expect(formatINR(3690)).toBe('₹3,690')
  })
  it('emiMonthly divides effective price by 3', () => {
    expect(emiMonthly({ price: 300, on_sale: false })).toBe(100)
  })
  it('isPurchasable returns true by default', () => {
    expect(isPurchasable({})).toBe(true)
  })
  it('isPurchasable returns false when in_stock is false', () => {
    expect(isPurchasable({ in_stock: false })).toBe(false)
  })
  it('hasValidSizes returns false for empty sizes', () => {
    expect(hasValidSizes({ sizes: [] })).toBe(false)
  })
  it('hasValidSizes returns true for non-empty sizes', () => {
    expect(hasValidSizes({ sizes: ['41'] })).toBe(true)
  })
  it('getSizes returns sizes array', () => {
    expect(getSizes({ sizes: ['41', '42'] })).toEqual(['41', '42'])
  })
  it('getSizes returns empty array for missing sizes', () => {
    expect(getSizes({})).toEqual([])
  })
  it('primaryImage returns first image src', () => {
    expect(primaryImage({ images: [{ src: 'a.jpg' }, { src: 'b.jpg' }] })).toBe('a.jpg')
  })
  it('primaryImage returns is_primary image src', () => {
    expect(
      primaryImage({
        images: [
          { src: 'a.jpg', is_primary: false },
          { src: 'b.jpg', is_primary: true },
        ],
      })
    ).toBe('b.jpg')
  })
  it('primaryImage returns empty string for no images', () => {
    expect(primaryImage({})).toBe('')
  })
  it('lineTotal multiplies effective price by qty', () => {
    expect(lineTotal({ product: { price: 100, on_sale: false }, qty: 3 })).toBe(300)
  })
  it('cartTotal sums all line totals', () => {
    const cart = [
      { product: { price: 100, on_sale: false }, qty: 2 },
      { product: { price: 50, on_sale: false }, qty: 1 },
    ]
    expect(cartTotal(cart)).toBe(250)
  })
  it('cartCount sums all quantities', () => {
    const cart = [{ qty: 2 }, { qty: 3 }]
    expect(cartCount(cart)).toBe(5)
  })
  it('shippingRemaining calculates remaining', () => {
    expect(shippingRemaining(3000)).toBe(FREE_SHIPPING_THRESHOLD - 3000)
  })
  it('shippingProgress returns 0 for empty cart', () => {
    expect(shippingProgress(0)).toBe(0)
  })
  it('shippingProgress caps at 100', () => {
    expect(shippingProgress(99999)).toBe(100)
  })
})
