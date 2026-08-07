import React, { useState, useEffect, useRef } from 'react'
import {
  effectivePrice,
  compareAtPrice,
  emiMonthly,
  isPurchasable,
  getSizes,
  hasValidSizes,
} from '../lib/pricing'

function Stars({ rating }) {
  if (!rating || rating <= 0) return null
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  return (
    <div className="stars" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={i < full ? 'star full' : i === full && half ? 'star half' : 'star'}
        >
          ★
        </span>
      ))}
    </div>
  )
}

function ProductCard({ product, fmt, onAddToCart, onDetail }) {
  const [selSize, setSelSize] = useState('')
  const [showSizeError, setShowSizeError] = useState(false)
  const [imgIx, setImgIx] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    setSelSize('')
    setShowSizeError(false)
    setImgIx(0)
  }, [product.id])

  const purchasable = isPurchasable(product)
  const sizes = getSizes(product)
  const allImages = Array.isArray(product.images)
    ? product.images.filter((img) => img && img.src).map((img) => img.src)
    : []
  const price = effectivePrice(product)
  const compare = compareAtPrice(product)
  const rating = product.average_rating || 0
  const reviewCount = product.review_count || 0

  useEffect(() => {
    if (isHovering && allImages.length > 1) {
      intervalRef.current = setInterval(() => {
        setImgIx((prev) => (prev + 1) % allImages.length)
      }, 800)
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isHovering, allImages.length])

  const handleMouseEnter = () => {
    if (allImages.length > 1) setIsHovering(true)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    setImgIx(0)
  }

  const handleAddToCart = (e) => {
    e.stopPropagation()
    if (!purchasable || !hasValidSizes(product)) return
    if (!selSize) {
      setShowSizeError(true)
      return
    }
    onAddToCart(product, selSize)
  }

  const handleQuickView = (e) => {
    e.stopPropagation()
    onDetail(product)
  }

  return (
    <div className="kick-card" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="kick-top">
        <span className="brand-tag">{product.brand || 'AURA'}</span>
        <div className="kick-badges">
          {product.on_sale ? <span className="kick-badge sale">SALE</span> : null}
          {!purchasable ? <span className="kick-badge soldout">SOLD OUT</span> : null}
          {rating > 0 ? (
            <span className="kick-badge rating">
              ★ {rating.toFixed(1)}
              {reviewCount > 0 ? ` (${reviewCount})` : ''}
            </span>
          ) : null}
        </div>
      </div>
      <div
        className="kick-img-wrap"
        onClick={() => onDetail(product)}
        role="button"
        tabIndex={0}
        aria-label={`View ${product.name} details`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onDetail(product)
          }
        }}
      >
        {allImages.length > 0 ? (
          allImages.map((src, i) => (
            <img
              key={i}
              className={`kick-img${i === imgIx ? ' active' : ' inactive'}`}
              src={src}
              alt={i === 0 ? product.name : ''}
              loading="lazy"
            />
          ))
        ) : (
          <div
            className="kick-img active"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff20',
              fontSize: '3rem',
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width="64"
              height="64"
              fill="currentColor"
              opacity="0.3"
              aria-hidden="true"
            >
              <path d="M12 1 C13 6 17 7 17 12 C17 15.5 14.8 18 12 18 C9.2 18 7 15.5 7 12 C7 9 9 8 9.5 5.5 C10.6 7 11.6 7.6 12 6 Z" />
            </svg>
          </div>
        )}
        {allImages.length > 1 && (
          <div className="img-dots" aria-hidden="true">
            {allImages.map((_, i) => (
              <span key={i} className={`img-dot${i === imgIx ? ' active' : ''}`} />
            ))}
          </div>
        )}
      </div>
      <div className="kick-meta">
        <h3 className="kick-name">{product.name}</h3>
        <span className="kick-price">
          {compare !== null && <s>{fmt(compare)}</s>}
          {fmt(price)}
        </span>
      </div>
      {rating > 0 && <Stars rating={rating} />}
      {purchasable && sizes.length > 0 && (
        <div className="sizes">
          {sizes.slice(0, 6).map((s) => (
            <button
              key={s}
              className={`size-btn${selSize === s ? ' sel' : ''}`}
              onClick={() => {
                setSelSize(s)
                setShowSizeError(false)
              }}
              aria-pressed={selSize === s}
            >
              {s}
            </button>
          ))}
        </div>
      )}
      {showSizeError && (
        <p className="size-error" role="alert">
          Please select a size
        </p>
      )}
      <div className="kick-actions">
        <button
          className="add-btn"
          onClick={handleAddToCart}
          disabled={!purchasable || !hasValidSizes(product)}
          aria-disabled={!purchasable || !hasValidSizes(product)}
        >
          {purchasable && hasValidSizes(product) ? 'add to cart' : 'sold out'}
        </button>
        <button
          className="qv-btn"
          onClick={handleQuickView}
          aria-label={`Quick view ${product.name}`}
        >
          Quick View
        </button>
      </div>
      <div className="kick-emi">
        <b>EMI</b> from {fmt(emiMonthly(product))}/mo
      </div>
    </div>
  )
}

export default ProductCard
