import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const catalogPath = join(__dirname, '..', 'api', 'products.json')
const products = JSON.parse(readFileSync(catalogPath, 'utf8'))

let fixed = 0

for (const p of products) {
  let changed = false

  // Fix empty SKU
  if (!p.sku || p.sku.trim() === '') {
    p.sku = `SKU_${p.id}`
    changed = true
  }

  if (Array.isArray(p.images) && p.images.length > 0) {
    // Remove duplicate image URLs (keep first occurrence)
    const seenUrls = new Set()
    const uniqueImages = []
    for (const img of p.images) {
      if (img && img.src && !seenUrls.has(img.src)) {
        seenUrls.add(img.src)
        uniqueImages.push(img)
      } else {
        changed = true
      }
    }

    // Fix multiple primary images - keep only the first primary as primary
    let foundPrimary = false
    uniqueImages.forEach((img, i) => {
      if (img.is_primary === true) {
        if (foundPrimary) {
          img.is_primary = false
          img.type = 'gallery'
          changed = true
        } else {
          foundPrimary = true
        }
      }
    })

    // If no primary found, mark first as primary
    if (!foundPrimary && uniqueImages.length > 0) {
      uniqueImages[0].is_primary = true
      uniqueImages[0].type = 'main'
      changed = true
    }

    // Fix positions to be sequential
    uniqueImages.forEach((img, i) => {
      if (img.position !== i) {
        img.position = i
        changed = true
      }
    })

    // Update primary_image to match
    const primaryImg = uniqueImages.find((img) => img.is_primary)
    const newPrimary = primaryImg ? primaryImg.src : uniqueImages[0].src
    if (p.primary_image !== newPrimary) {
      p.primary_image = newPrimary
      changed = true
    }

    // Update image_count
    if (p.image_count !== uniqueImages.length) {
      p.image_count = uniqueImages.length
      changed = true
    }

    if (changed) p.images = uniqueImages
  }

  if (changed) fixed++
}

writeFileSync(catalogPath, JSON.stringify(products, null, 2) + '\n')
console.log(`Fixed ${fixed} products out of ${products.length}`)
console.log('Catalog data cleanup complete.')
