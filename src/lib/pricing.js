export const FREE_SHIPPING_THRESHOLD = 4999

export function effectivePrice(product) {
  if (!product) return 0
  if (product.on_sale && typeof product.sale_price === 'number' && product.sale_price >= 0) {
    return product.sale_price
  }
  return typeof product.price === 'number' ? product.price : 0
}

export function compareAtPrice(product) {
  if (!product) return null
  if (product.on_sale) {
    if (typeof product.compare_at === 'number') return product.compare_at
    if (typeof product.regular_price === 'number') return product.regular_price
  }
  return null
}

export function formatINR(n) {
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

export function emiMonthly(product) {
  return Math.round(effectivePrice(product) / 3)
}

export function isPurchasable(product) {
  return product && product.in_stock !== false && product.purchasable !== false
}

export function hasValidSizes(product) {
  return Array.isArray(product?.sizes) && product.sizes.length > 0
}

const EU_TO_UK = {
  '36.0': 'UK 3.5',
  '37.0': 'UK 4',
  '38.0': 'UK 5',
  '39.0': 'UK 5.5',
  '40.0': 'UK 6',
  '41.0': 'UK 7',
  '42.0': 'UK 7.5',
  '43.0': 'UK 8.5',
  '44.0': 'UK 9',
  '45.0': 'UK 10',
  '46.0': 'UK 11',
}

export function euToUk(size) {
  return EU_TO_UK[String(size)] || EU_TO_UK[parseFloat(size).toFixed(1)] || String(size)
}

export function getSizes(product) {
  if (!hasValidSizes(product)) return []
  return product.sizes.map(euToUk)
}

export function primaryImage(product) {
  if (!product?.images || !Array.isArray(product.images) || product.images.length === 0) {
    return ''
  }
  const found = product.images.find((img) => img?.is_primary && img?.src)
  return found?.src || product.images[0]?.src || ''
}

export function lineTotal(line) {
  if (!line) return 0
  return effectivePrice(line.product) * line.qty
}

export function cartTotal(cart) {
  if (!Array.isArray(cart)) return 0
  return cart.reduce((sum, line) => sum + lineTotal(line), 0)
}

export function cartCount(cart) {
  if (!Array.isArray(cart)) return 0
  return cart.reduce((sum, line) => sum + (line.qty || 0), 0)
}

export function shippingRemaining(total) {
  return Math.max(0, FREE_SHIPPING_THRESHOLD - total)
}

export function shippingProgress(total) {
  return Math.min(100, Math.round((total / FREE_SHIPPING_THRESHOLD) * 100))
}
