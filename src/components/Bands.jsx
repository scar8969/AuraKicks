import React from 'react'

function Bands() {
  return (
    <>
      <section className="band blood">
        <div className="band-ghost">Fire</div>
        <div className="band-inner">
          <div>
            <h3>Ember foam that answers back</h3>
            <p>
              The midsole is forged with heat-reactive pigment. The harder you push, the brighter it
              burns.
            </p>
          </div>
          <svg
            className="band-shoe"
            viewBox="0 0 640 340"
            style={{ transform: 'rotate(-6deg)' }}
            aria-hidden="true"
          >
            <path d="M45 236 L78 292 L596 292 L628 232 L560 214 L150 214 Z" fill="var(--ink)" />
            <path
              d="M84 222 C72 168 92 116 148 96 L236 66 C262 57 296 60 320 80 L462 148 C512 168 566 186 606 224 L560 216 L150 216 Z"
              fill="var(--ink)"
            />
            <path
              d="M148 96 L236 66 L320 80 L462 148"
              fill="none"
              stroke="var(--bone)"
              strokeWidth="3"
              opacity=".5"
            />
            <path
              d="M120 200 L300 156 L286 190 L420 168 L400 202 Z"
              fill="var(--bone)"
              opacity=".9"
            />
          </svg>
        </div>
      </section>
      <section className="band dark">
        <div className="band-ghost">Ash</div>
        <div className="band-inner">
          <svg
            className="band-shoe"
            viewBox="0 0 640 340"
            style={{ transform: 'rotate(5deg)' }}
            aria-hidden="true"
          >
            <path d="M40 240 L70 294 L600 294 L632 238 L556 220 L148 218 Z" fill="var(--blood)" />
            <path
              d="M80 226 C70 176 96 130 156 112 L268 84 C300 76 330 82 352 100 L478 160 C524 180 572 196 610 230 L556 222 L148 220 Z"
              fill="#14100d"
            />
            <path
              d="M156 112 L268 84 L352 100 L478 160"
              fill="none"
              stroke="var(--bone)"
              strokeWidth="3"
              opacity=".5"
            />
            <path d="M110 208 L330 140 L310 180 L470 150 L440 204 Z" fill="var(--blood)" />
          </svg>
          <div>
            <h3>Zero gravity, full fury</h3>
            <p>Dual-density ember foam: soft where you land, hard where you strike. 8mm drop.</p>
          </div>
        </div>
      </section>
      <section className="band blood">
        <div className="band-ghost">Grip</div>
        <div className="band-inner">
          <div>
            <h3>Bites the ground, lets go of doubt</h3>
            <p>
              Full-length herringbone outsole with ember-tread siping. The grip doesn&apos;t
              negotiate.
            </p>
          </div>
          <svg
            className="band-shoe"
            viewBox="0 0 640 340"
            style={{ transform: 'rotate(-4deg)' }}
            aria-hidden="true"
          >
            <path d="M42 238 L74 292 L598 292 L630 234 L558 216 L150 216 Z" fill="var(--ink)" />
            <path
              d="M82 224 C76 186 100 150 162 136 L282 112 C312 106 340 112 360 128 L482 176 C526 192 572 204 608 230 L558 218 L150 218 Z"
              fill="var(--ink)"
            />
            <path
              d="M162 136 L282 112 L360 128 L482 176"
              fill="none"
              stroke="var(--bone)"
              strokeWidth="3"
              opacity=".5"
            />
            <path
              d="M116 206 L330 152 L314 188 L460 166 L436 204 Z"
              fill="var(--bone)"
              opacity=".9"
            />
          </svg>
        </div>
      </section>
    </>
  )
}

export default Bands
