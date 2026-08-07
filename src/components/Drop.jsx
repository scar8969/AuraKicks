import React from 'react'

function Drop() {
  return (
    <section className="drop" id="drop">
      <div className="drop-pin">
        <svg className="drop-spikes" viewBox="0 0 320 58" aria-hidden="true">
          <path
            fill="currentColor"
            d="M0 56 C6 40 8 30 10 18 C13 32 16 40 18 46 C22 30 24 22 27 8 C30 26 33 38 36 46 C42 34 46 28 52 20 C52 32 54 42 58 48 C64 40 70 36 78 32 C74 42 74 48 76 56 Z"
          />
          <path fill="currentColor" d="M30 56 L34 44 L38 56 Z" />
          <path fill="currentColor" d="M150 56 L155 20 L160 0 L165 20 L170 56 Z" />
          <path fill="currentColor" d="M140 56 L145 38 L150 56 Z" />
          <path fill="currentColor" d="M170 56 L175 38 L180 56 Z" />
          <path
            fill="currentColor"
            d="M244 56 L248 44 L252 56 Z"
            transform="scale(-1,1) translate(-640,0)"
          />
          <path
            fill="currentColor"
            d="M284 56 C290 40 292 30 294 18 C297 32 300 40 302 46 C306 30 308 22 310 8 C313 26 316 38 320 46 C326 34 330 28 336 20 C336 32 338 42 342 48 C348 40 354 36 362 32 C358 42 358 48 360 56 Z"
          />
        </svg>
        <div className="drop-k">the drop — 05</div>
        <div className="drop-n">
          <em>Only</em> 500
        </div>
        <div className="drop-line">pairs will ever burn</div>
        <div className="drop-line red">there are few of us</div>
        <div className="drop-line">don&apos;t let the fire die</div>
        <div className="drop-cta">
          <a className="pill-btn" href="#kicks">
            browse the collection
          </a>
        </div>
      </div>
    </section>
  )
}

export default Drop
