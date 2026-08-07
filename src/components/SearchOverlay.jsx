import React, { useState, useEffect, useRef } from 'react'
import { effectivePrice, compareAtPrice } from '../lib/pricing'
import { useFocusTrap } from '../lib/useFocusTrap'

function SearchOverlay({ open, products, fmt, onClose, onSelect }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const inputRef = useRef(null)
  const overlayRef = useFocusTrap(open, onClose)

  useEffect(() => {
    if (!open) {
      setQuery('')
      setResults([])
      return
    }
    if (!query.trim()) {
      setResults([])
      return
    }
    const q = query.toLowerCase()
    const hits = (Array.isArray(products) ? products : [])
      .filter(
        (p) =>
          (typeof p.name === 'string' && p.name.toLowerCase().includes(q)) ||
          (typeof p.brand === 'string' && p.brand.toLowerCase().includes(q)) ||
          (typeof p.category === 'string' && p.category.toLowerCase().includes(q))
      )
      .slice(0, 20)
    setResults(hits)
  }, [query, products, open])

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus()
  }, [open])

  if (!open) return null

  return (
    <div
      className="search-ov"
      style={{ display: 'flex' }}
      role="dialog"
      aria-modal="true"
      aria-label="Search products"
      ref={overlayRef}
    >
      <div className="search-box">
        <div className="search-input-wrap">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-4-4" />
          </svg>
          <label htmlFor="searchInput" className="sr-only">
            Search products
          </label>
          <input
            id="searchInput"
            ref={inputRef}
            type="text"
            placeholder="Search the forge…"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="search-results">
          {results.length === 0 && query ? (
            <div className="search-empty">nothing found in the forge</div>
          ) : (
            results.map((p) => (
              <button key={p.id} className="search-hit" onClick={() => onSelect(p)}>
                <div>
                  <div className="nm">{p.name}</div>
                  <div className="search-brand">{p.brand}</div>
                </div>
                <div className="pr">
                  {compareAtPrice(p) !== null && <s>{fmt(compareAtPrice(p))}</s>}
                  {fmt(effectivePrice(p))}
                </div>
              </button>
            ))
          )}
        </div>
        <button className="search-close" onClick={onClose}>
          Esc — close the forge
        </button>
      </div>
    </div>
  )
}

export default SearchOverlay
