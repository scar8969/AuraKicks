import React from 'react'
import { effectivePrice, primaryImage, shippingRemaining, shippingProgress } from '../lib/pricing'
import { useFocusTrap } from '../lib/useFocusTrap'

function CartDrawer({ open, cart, fmt, cartTotal, onClose, onRemove, onUpdateQty }) {
  const drawerRef = useFocusTrap(open, onClose)
  const shipRemain = shippingRemaining(cartTotal)
  const pct = shippingProgress(cartTotal)

  return (
    <>
      <button
        className={`cart-scrim${open ? ' on' : ''}`}
        onClick={onClose}
        aria-hidden={!open}
        aria-label="Close cart"
        tabIndex={-1}
      />
      <aside
        className={`cart-drawer${open ? ' on' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        aria-hidden={!open}
        ref={drawerRef}
      >
        <div className="cart-head">
          <h3>
            Your <em>Haul</em>
          </h3>
          <button className="cart-x" onClick={onClose} aria-label="Close cart">
            ×
          </button>
        </div>
        <div className="cart-progress">
          <div className="lbl">
            {shipRemain > 0 ? (
              <>
                Add <b>{fmt(shipRemain)}</b> more for free shipping
              </>
            ) : (
              <b>Free shipping unlocked!</b>
            )}
          </div>
          <div className="pbar">
            <i style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="cart-empty-state">
              <div className="cart-empty-icon">
                <svg
                  viewBox="0 0 24 24"
                  width="48"
                  height="48"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M6 7h12l1.5 13h-15L6 7z" />
                  <path d="M9 7a3 3 0 0 1 6 0" />
                </svg>
              </div>
              <p className="cart-empty-title">your haul is empty</p>
              <p className="cart-empty-sub">start browsing to find your flame</p>
              <a className="cart-empty-cta" href="#kicks" onClick={onClose}>
                explore kicks
              </a>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.key} className="cart-item">
                <img
                  src={primaryImage(item.product) || ''}
                  alt={item.product.name}
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
                <div className="ci-info">
                  <div className="ci-name">{item.product.name}</div>
                  <div className="ci-meta">
                    {item.product.brand} / {item.size}
                  </div>
                  <div className="ci-row">
                    <div className="qty">
                      <button
                        onClick={() => onUpdateQty(item.key, -1)}
                        aria-label={`Decrease quantity of ${item.product.name}`}
                      >
                        −
                      </button>
                      <span aria-live="polite">{item.qty}</span>
                      <button
                        onClick={() => onUpdateQty(item.key, 1)}
                        aria-label={`Increase quantity of ${item.product.name}`}
                      >
                        +
                      </button>
                    </div>
                    <span className="ci-price">{fmt(effectivePrice(item.product) * item.qty)}</span>
                  </div>
                </div>
                <button
                  className="ci-rm"
                  onClick={() => onRemove(item.key)}
                  aria-label={`Remove ${item.product.name} from cart`}
                >
                  remove
                </button>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div className="cart-foot">
            <div className="cart-sub">
              <span>Subtotal</span>
              <b>{fmt(cartTotal)}</b>
            </div>
            <div className="cart-note">zero-interest EMI available at checkout</div>
            <button
              className="checkout-btn"
              disabled
              aria-disabled="true"
              title="Checkout coming soon"
            >
              Checkout — Coming Soon
            </button>
          </div>
        )}
      </aside>
    </>
  )
}

export default CartDrawer
