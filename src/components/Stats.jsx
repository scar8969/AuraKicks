import React, { useMemo } from 'react'
import { effectivePrice } from '../lib/pricing'

function Stats({ products }) {
  const data = useMemo(() => {
    const list = Array.isArray(products) ? products : []
    const brands = new Set(list.map((p) => p.brand).filter(Boolean))
    const prices = list.map(effectivePrice).filter((p) => p > 0)
    const minPrice = prices.length ? Math.min(...prices) : 0
    const maxPrice = prices.length ? Math.max(...prices) : 0
    const allSizes = list.flatMap((p) => p.sizes || [])
    const sizeSet = new Set(allSizes.map(String))
    const sortedSizes = [...sizeSet].sort((a, b) => parseFloat(a) - parseFloat(b))
    return {
      count: list.length,
      brands: brands.size,
      sizeRange: sortedSizes.length
        ? `${sortedSizes[0]}–${sortedSizes[sortedSizes.length - 1]}`
        : 'N/A',
      priceRange: `₹${Math.round(minPrice)}–${maxPrice >= 1000 ? Math.round(maxPrice / 1000) + 'k' : Math.round(maxPrice)}`,
    }
  }, [products])

  return (
    <section className="stats">
      <div className="stat">
        <div className="stat-n">{data.count.toLocaleString()}</div>
        <div className="stat-l">products</div>
      </div>
      <div className="stat">
        <div className="stat-n">{data.brands}</div>
        <div className="stat-l">brands</div>
      </div>
      <div className="stat">
        <div className="stat-n">{data.sizeRange}</div>
        <div className="stat-l">size run</div>
      </div>
      <div className="stat">
        <div className="stat-n">{data.priceRange}</div>
        <div className="stat-l">price range</div>
      </div>
    </section>
  )
}

export default Stats
