import React, { useState, useMemo, useEffect, useRef } from 'react'
import ProductCard from './ProductCard'

function SkeletonCard() {
  return (
    <div className="kick-card skeleton">
      <div className="skeleton-img" />
      <div className="skeleton-line w-80" />
      <div className="skeleton-line w-60" />
      <div className="skeleton-row" />
    </div>
  )
}

function ShopSection({ products, loading, fmt, onAddToCart, onDetail }) {
  const [cat, setCat] = useState('all')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [brand, setBrand] = useState('all')
  const [sort, setSort] = useState('default')
  const [page, setPage] = useState(1)
  const gridRef = useRef(null)
  const PAGE_SIZE = 24

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(t)
  }, [search])

  const safeProducts = useMemo(() => (Array.isArray(products) ? products : []), [products])

  const categories = useMemo(() => {
    const set = new Set(['all'])
    safeProducts.forEach((p) => {
      if (p.category) set.add(p.category)
      if (p.categories) p.categories.forEach((c) => set.add(c))
    })
    return [...set]
  }, [safeProducts])

  const brands = useMemo(() => {
    const set = new Set(safeProducts.map((p) => p.brand).filter(Boolean))
    return [...set].sort()
  }, [safeProducts])

  const filtered = useMemo(() => {
    let list = [...safeProducts].filter((p) => p.in_stock !== false && p.purchasable !== false)
    if (cat !== 'all') {
      list = list.filter((p) => p.category === cat || (p.categories && p.categories.includes(cat)))
    }
    if (brand !== 'all') list = list.filter((p) => p.brand === brand)
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase()
      list = list.filter(
        (p) =>
          (typeof p.name === 'string' && p.name.toLowerCase().includes(q)) ||
          (typeof p.brand === 'string' && p.brand.toLowerCase().includes(q)) ||
          (typeof p.category === 'string' && p.category.toLowerCase().includes(q))
      )
    }
    if (sort === 'price-asc') list.sort((a, b) => (a.price || 0) - (b.price || 0))
    if (sort === 'price-desc') list.sort((a, b) => (b.price || 0) - (a.price || 0))
    if (sort === 'name-asc') list.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    if (sort === 'rating-desc')
      list.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0))
    return list
  }, [safeProducts, cat, brand, debouncedSearch, sort])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const currentPage = Math.min(page, totalPages || 1)
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const handlePageChange = (newPage) => {
    setPage(newPage)
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="shop-sec" id="kicks">
      <div className="section-head">
        <h2>
          The <em>Kicks</em>
        </h2>
        <div className="note">pick size — add to haul</div>
      </div>
      <div className="filter-row">
        <label htmlFor="filter-search" className="sr-only">
          Search products
        </label>
        <input
          id="filter-search"
          className="filter-input"
          type="text"
          placeholder="Search the forge…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
        />
        <label htmlFor="filter-brand" className="sr-only">
          Filter by brand
        </label>
        <select
          id="filter-brand"
          className="filter-select"
          value={brand}
          onChange={(e) => {
            setBrand(e.target.value)
            setPage(1)
          }}
        >
          <option value="all">All Brands</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
        <label htmlFor="filter-sort" className="sr-only">
          Sort products
        </label>
        <select
          id="filter-sort"
          className="filter-select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="default">Sort: Default</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="name-asc">Name: A → Z</option>
          <option value="rating-desc">Top Rated</option>
        </select>
        <span className="filter-count" aria-live="polite">
          {filtered.length} products
        </span>
      </div>
      <div className="cat-tabs">
        {categories.map((c) => (
          <button
            key={c}
            className={`cat-tab${cat === c ? ' active' : ''}`}
            onClick={() => {
              setCat(c)
              setPage(1)
            }}
            aria-pressed={cat === c}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="kicks-grid" id="grid" ref={gridRef}>
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
        ) : paged.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔥</div>
            <p>no kicks found</p>
            <button
              className="pill-btn"
              onClick={() => {
                setSearch('')
                setCat('all')
                setBrand('all')
                setSort('default')
              }}
            >
              clear filters
            </button>
          </div>
        ) : (
          paged.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              fmt={fmt}
              onAddToCart={onAddToCart}
              onDetail={onDetail}
            />
          ))
        )}
      </div>
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            ←
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
            .map((p, i, arr) => (
              <React.Fragment key={p}>
                {i > 0 && arr[i - 1] !== p - 1 && <span className="page-dots">…</span>}
                <button
                  className={`page-num${p === currentPage ? ' active' : ''}`}
                  onClick={() => handlePageChange(p)}
                >
                  {p}
                </button>
              </React.Fragment>
            ))}
          <button
            className="page-btn"
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            →
          </button>
        </div>
      )}
    </section>
  )
}

export default ShopSection
