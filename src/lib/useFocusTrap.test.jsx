import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { useFocusTrap } from './useFocusTrap'

function TestDialog({ active, onClose }) {
  const ref = useFocusTrap(active, onClose)
  if (!active) return null
  return (
    <div ref={ref} role="dialog">
      <button onClick={onClose}>Close</button>
      <button>Button A</button>
      <button>Button B</button>
      <input placeholder="test input" />
    </div>
  )
}

describe('useFocusTrap', () => {
  it('renders dialog when active', () => {
    render(<TestDialog active={true} onClose={vi.fn()} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('renders nothing when inactive', () => {
    const { container } = render(<TestDialog active={false} onClose={vi.fn()} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('focuses first element when activated', () => {
    render(<TestDialog active={true} onClose={vi.fn()} />)
    expect(screen.getByText('Close')).toHaveFocus()
  })

  it('calls onClose on Escape', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<TestDialog active={true} onClose={onClose} />)
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalled()
  })
})
