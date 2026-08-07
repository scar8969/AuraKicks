import React, { useState, useEffect } from 'react'
import {
  effectivePrice,
  compareAtPrice,
  isPurchasable,
  getSizes,
  hasValidSizes,
} from '../lib/pricing'
import { useFocusTrap } from '../lib/useFocusTrap'

function ProductDetail({ product, fmt, products, onClose, onAddToCart, onSelectProduct }) {
  const [selSize, setSelSize] = useState('')
  const [mainImg, setMainImg] = useState(0)
  const [qty, setQty] = useState(1)
  const [showSizeError, setShowSizeError] = useState(false)

  const panelRef = useFocusTrap(!!product, onClose)

  useEffect(() => {
    setSelSize('')
    setMainImg(0)
    setQty(1)
    setShowSizeError(false)
  }, [product?.id])

  if (!product) return null

  const images = Array.isArray(product.images) ? product.images : []
  const safeImgIndex = Math.min(mainImg, images.length - 1)
  const primary = images[safeImgIndex] ? images[safeImgIndex].src : ''
  const sizes = getSizes(product)
  const purchasable = isPurchasable(product)
  const price = effectivePrice(product)
  const compare = compareAtPrice(product)

  const related = (Array.isArray(products) ? products : [])
    .filter(
      (p) => p.id !== product.id && (p.brand === product.brand || p.category === product.category)
    )
    .slice(0, 4)

  const handleAddToCart = () => {
    if (!purchasable || !hasValidSizes(product)) return
    if (!selSize) {
      setShowSizeError(true)
      return
    }
    onAddToCart(product, selSize, qty)
    onClose()
  }

  return (
    <>
      <button className="detail-scrim on" onClick={onClose} aria-label="Close product details" />
      <aside
        className="detail-panel on"
        role="dialog"
        aria-modal="true"
        aria-label={`${product.name} details`}
        ref={panelRef}
      >
        <button className="detail-close" onClick={onClose} aria-label="Close product details">
          <span aria-hidden="true">✕</span>
        </button>
        <button className="detail-back" onClick={onClose} aria-label="Go back">
          <span aria-hidden="true">←</span> BACK
        </button>
        <div className="detail-body">
          <div className="detail-grid">
            <div className="detail-images">
              {primary && <img className="detail-main-img" src={primary} alt={product.name} />}
              <div className="detail-thumbs">
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`detail-thumb-btn${i === mainImg ? ' active' : ''}`}
                    onClick={() => setMainImg(i)}
                    aria-label={`View image ${i + 1} of ${product.name}`}
                  >
                    <img
                      className={`detail-thumb${i === mainImg ? ' active' : ''}`}
                      src={img.src}
                      alt=""
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="detail-info">
              <div className="detail-brand">{product.brand || 'AURA'}</div>
              <h2>{product.name}</h2>
              <div className="detail-price">
                {compare !== null && <s>{fmt(compare)}</s>}
                {fmt(price)}
              </div>
              {purchasable && sizes.length > 0 && (
                <div className="detail-sizes">
                  <fieldset>
                    <legend>Select size</legend>
                    {sizes.map((s) => (
                      <button
                        key={s}
                        className={`detail-size-btn${selSize === s ? ' sel' : ''}`}
                        onClick={() => {
                          setSelSize(s)
                          setShowSizeError(false)
                        }}
                        aria-pressed={selSize === s}
                      >
                        {s}
                      </button>
                    ))}
                  </fieldset>
                </div>
              )}
              {showSizeError && (
                <p className="size-error" role="alert">
                  Please select a size
                </p>
              )}
              {purchasable && (
                <div className="detail-qty">
                  <label htmlFor="qty-input">Quantity</label>
                  <input
                    id="qty-input"
                    type="number"
                    min="1"
                    max="99"
                    value={qty}
                    onChange={(e) =>
                      setQty(Math.max(1, Math.min(99, parseInt(e.target.value) || 1)))
                    }
                  />
                </div>
              )}
              <button
                className="detail-add"
                onClick={handleAddToCart}
                disabled={!purchasable || !hasValidSizes(product)}
              >
                {purchasable && hasValidSizes(product) ? 'add to cart' : 'sold out'}
              </button>
              {product.description && <div className="detail-desc">{product.description}</div>}
              {related.length > 0 && (
                <div className="detail-related">
                  <h4>MORE FROM {product.brand || 'THIS BRAND'}</h4>
                  <div className="detail-thumbs">
                    {related.map((rp) => {
                      const ri = rp.images && rp.images[0] ? rp.images[0].src : ''
                      return ri ? (
                        <button
                          key={rp.id}
                          className="detail-thumb-btn"
                          onClick={() => onSelectProduct(rp)}
                          aria-label={`View ${rp.name}`}
                        >
                          <img className="detail-thumb" src={ri} alt={rp.name} loading="lazy" />
                        </button>
                      ) : null
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default ProductDetail
