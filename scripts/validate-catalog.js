import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const catalogPath = join(__dirname, '..', 'api', 'products.json')

const errors = []
const warnings = []

let products
try {
  products = JSON.parse(readFileSync(catalogPath, 'utf8'))
} catch (e) {
  console.error(`FATAL: Cannot parse catalog: ${e.message}`)
  process.exit(1)
}

if (!Array.isArray(products)) {
  console.error('FATAL: Catalog is not an array')
  process.exit(1)
}

const ids = new Set()
const skus = new Set()

for (let i = 0; i < products.length; i++) {
  const p = products[i]
  const ref = `product[${i}] id=${p.id ?? 'missing'}`

  if (typeof p.id !== 'number' || !Number.isFinite(p.id)) {
    errors.push(`${ref}: id must be a finite number`)
  } else if (ids.has(p.id)) {
    errors.push(`${ref}: duplicate id`)
  } else {
    ids.add(p.id)
  }

  if (typeof p.sku !== 'string' || p.sku.trim() === '') {
    warnings.push(`${ref}: empty or missing sku`)
  } else if (skus.has(p.sku)) {
    warnings.push(`${ref}: duplicate sku "${p.sku}"`)
  } else {
    skus.add(p.sku)
  }

  if (typeof p.name !== 'string' || p.name.trim() === '') {
    errors.push(`${ref}: name must be a non-empty string`)
  }

  if (typeof p.price !== 'number' || p.price < 0 || !Number.isFinite(p.price)) {
    errors.push(`${ref}: price must be a finite non-negative number`)
  }

  if (typeof p.regular_price !== 'number' || p.regular_price < 0) {
    warnings.push(`${ref}: regular_price should be a non-negative number`)
  }

  if (p.on_sale === true) {
    if (typeof p.sale_price !== 'number' || p.sale_price < 0) {
      errors.push(`${ref}: on_sale is true but sale_price is invalid`)
    }
    if (typeof p.compare_at !== 'number' || p.compare_at < p.sale_price) {
      warnings.push(`${ref}: on_sale but compare_at is missing or less than sale_price`)
    }
  }

  if (typeof p.in_stock !== 'boolean') {
    warnings.push(`${ref}: in_stock should be boolean`)
  }

  if (typeof p.purchasable !== 'boolean') {
    warnings.push(`${ref}: purchasable should be boolean`)
  }

  if (!Array.isArray(p.images)) {
    errors.push(`${ref}: images must be an array`)
  } else {
    if (p.images.length !== p.image_count) {
      warnings.push(`${ref}: image_count (${p.image_count}) !== images.length (${p.images.length})`)
    }
    const seenUrls = new Set()
    let primaryCount = 0
    p.images.forEach((img, j) => {
      if (!img || typeof img.src !== 'string' || img.src.trim() === '') {
        errors.push(`${ref}: images[${j}].src must be a non-empty string`)
      }
      if (img && seenUrls.has(img.src)) {
        warnings.push(`${ref}: duplicate image URL at position ${j}`)
      } else if (img) {
        seenUrls.add(img.src)
      }
      if (img && img.is_primary === true) primaryCount++
    })
    if (primaryCount !== 1) {
      warnings.push(`${ref}: expected exactly 1 primary image, found ${primaryCount}`)
    }
  }

  if (!Array.isArray(p.sizes)) {
    warnings.push(`${ref}: sizes should be an array`)
  }
}

console.log(`\nCatalog validation: ${products.length} products checked`)
console.log(`Errors: ${errors.length}`)
console.log(`Warnings: ${warnings.length}`)

if (errors.length > 0) {
  console.error('\n=== ERRORS ===')
  errors.forEach((e) => console.error(`  ${e}`))
}
if (warnings.length > 0) {
  console.warn('\n=== WARNINGS ===')
  warnings.slice(0, 50).forEach((w) => console.warn(`  ${w}`))
  if (warnings.length > 50) console.warn(`  ... and ${warnings.length - 50} more warnings`)
}

if (errors.length > 0) {
  process.exit(1)
}
console.log('\nCatalog validation passed (no errors).')
