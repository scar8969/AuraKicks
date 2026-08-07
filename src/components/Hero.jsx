import React from 'react'

function Hero({ productCount }) {
  const count = productCount ? productCount.toLocaleString() : '1,953'
  return (
    <section className="hero" id="hero">
      <div className="hero-pin">
        <div className="hero-bg">
          <div className="hero-light" />
        </div>
        <div className="hero-lockup">
          <img className="hero-logo" src="/aura.svg" alt="AURA KICKS — forged in fire" />
          <div className="hero-tag">forged in fire · est. 2026</div>
        </div>
        <div className="sticker st-1">burn different</div>
        <div className="sticker solid st-2">est. 2026</div>
        <div className="sticker st-3">ember foam</div>
        <div className="sticker solid st-4">{count} pairs</div>
        <div className="hero-foot">
          <span>a sneaker</span>
          <span>is a flame</span>
        </div>
        <a className="hero-anchor" href="#kicks" aria-label="Scroll to products">
          scroll
        </a>
        <div className="hero-curtain" />
      </div>
    </section>
  )
}

export default Hero
