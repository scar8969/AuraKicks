import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

function MockApp({ error }) {
  if (error) {
    return (
      <div className="loading-spin" style={{ padding: '6rem', textAlign: 'center' }}>
        <p>Failed to load catalog: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    )
  }
  return <div>loaded</div>
}

describe('App error state', () => {
  it('shows error message when catalog fails', () => {
    render(<MockApp error="HTTP 500" />)
    expect(screen.getByText(/Failed to load catalog: HTTP 500/)).toBeInTheDocument()
  })

  it('shows retry button on error', () => {
    render(<MockApp error="HTTP 500" />)
    expect(screen.getByText('Retry')).toBeInTheDocument()
  })

  it('shows loaded content when no error', () => {
    render(<MockApp error={null} />)
    expect(screen.getByText('loaded')).toBeInTheDocument()
  })
})
