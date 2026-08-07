import React, { useState, useEffect, useCallback, useReducer } from 'react'
import Preloader from './components/Preloader'
import AnnouncementBar from './components/AnnouncementBar'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Reel from './components/Reel'
import Countdown from './components/Countdown'
import Manifesto from './components/Manifesto'
import Stats from './components/Stats'
import ShopSection from './components/ShopSection'
import Footer from './components/Footer'
import SearchOverlay from './components/SearchOverlay'
import CartDrawer from './components/CartDrawer'
import ProductDetail from './components/ProductDetail'
import Toast from './components/Toast'
import BackToTop from './components/BackToTop'
import { formatINR, cartTotal as calcCartTotal, cartCount as calcCartCount } from './lib/pricing'
import { cartReducer } from './lib/cart'

const API_URL = '/api/products.json'
const CART_STORAGE_KEY = 'aurakicks_cart_v1'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [preloaderDone, setPreloaderDone] = useState(false)
  const [cart, dispatch] = useReducer(cartReducer, [], () => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [detailProduct, setDetailProduct] = useState(null)
  const [toastMsg, setToastMsg] = useState('')
  const [navSolid, setNavSolid] = useState(false)

  const fmt = formatINR

  useEffect(() => {
    fetch(API_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error('Invalid catalog format')
        setProducts(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Catalog fetch failed:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    const onScroll = () => setNavSolid(window.scrollY > window.innerHeight * 0.6)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const addToCart = useCallback((product, size, qty = 1) => {
    dispatch({ type: 'ADD', product, size, qty })
    setToastMsg('added to haul')
  }, [])

  const removeFromCart = useCallback((key) => {
    dispatch({ type: 'REMOVE', key })
  }, [])

  const updateQty = useCallback((key, delta) => {
    dispatch({ type: delta > 0 ? 'INCREMENT' : 'DECREMENT', key })
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    } catch {
      // ignore quota errors
    }
  }, [cart])

  const total = calcCartTotal(cart)
  const count = calcCartCount(cart)

  return (
    <>
      {!preloaderDone && <Preloader loading={loading} onDone={() => setPreloaderDone(true)} />}
      <AnnouncementBar products={products} />
      <Navbar
        cartCount={count}
        onCart={() => {
          setCartOpen(!cartOpen)
          setSearchOpen(false)
          setDetailProduct(null)
        }}
        onSearch={() => {
          setSearchOpen(!searchOpen)
          setCartOpen(false)
          setDetailProduct(null)
        }}
        solid={navSolid}
      />
      <SearchOverlay
        open={searchOpen}
        products={products}
        fmt={fmt}
        onClose={() => setSearchOpen(false)}
        onSelect={(p) => {
          setDetailProduct(p)
          setSearchOpen(false)
        }}
      />
      <CartDrawer
        open={cartOpen}
        cart={cart}
        fmt={fmt}
        cartTotal={total}
        cartCount={count}
        onClose={() => setCartOpen(false)}
        onRemove={removeFromCart}
        onUpdateQty={updateQty}
      />
      <ProductDetail
        product={detailProduct}
        fmt={fmt}
        products={products}
        onClose={() => setDetailProduct(null)}
        onAddToCart={addToCart}
        onSelectProduct={setDetailProduct}
      />
      <Toast msg={toastMsg} onDone={() => setToastMsg('')} />

      <main id="top">
        <Hero productCount={products.length} />
        <Reel text="for those who burn different — aura kicks — two flames one bloodline — " />
        {error ? (
          <div className="loading-spin" style={{ padding: '6rem', textAlign: 'center' }}>
            <p>Failed to load catalog: {error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : (
          <Countdown />
        )}
        <Manifesto />
        <Stats products={products} />
        <ShopSection
          products={products}
          loading={loading}
          fmt={fmt}
          onAddToCart={addToCart}
          onDetail={setDetailProduct}
        />
        <Footer />
      </main>
      <BackToTop />
    </>
  )
}

export default App
