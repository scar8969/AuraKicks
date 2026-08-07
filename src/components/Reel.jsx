import React from 'react'

function Reel({ text, ghost, rev }) {
  return (
    <div className={`reel${ghost ? ' ghost' : ''}${rev ? ' rev' : ''}`} aria-hidden="true">
      <div className="reel-track">
        <span>{text}</span>
        <span>{text}</span>
      </div>
    </div>
  )
}

export default Reel
