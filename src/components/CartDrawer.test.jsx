import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import CartDrawer from './CartDrawer'
import { formatINR } from '../lib/pricing'

const mockCart = [
  {
    key: '1-42',
    productId: 1,
    product: {
      id: 1,
      name: 'Test Sneaker',
      brand: 'Nike',
      price: 3000,
      on_sale: false,
      images: [{ src: 'test.jpg' }],
    },
    size: '42',
    qty: 2,
  },
]

describe('CartDrawer', () => {
  it('shows empty message when cart is empty', () => {
    render(
      <CartDrawer
        open={true}
        cart={[]}
        fmt={formatINR}
        cartTotal={0}
        onClose={vi.fn()}
        onRemove={vi.fn()}
        onUpdateQty={vi.fn()}
      />
    )
    expect(screen.getByText('your haul is empty')).toBeInTheDocument()
  })

  it('shows cart items when not empty', () => {
    render(
      <CartDrawer
        open={true}
        cart={mockCart}
        fmt={formatINR}
        cartTotal={6000}
        onClose={vi.fn()}
        onRemove={vi.fn()}
        onUpdateQty={vi.fn()}
      />
    )
    expect(screen.getByText('Test Sneaker')).toBeInTheDocument()
    expect(screen.getAllByText('₹6,000').length).toBe(2)
  })

  it('shows free shipping unlocked when total exceeds threshold', () => {
    render(
      <CartDrawer
        open={true}
        cart={mockCart}
        fmt={formatINR}
        cartTotal={6000}
        onClose={vi.fn()}
        onRemove={vi.fn()}
        onUpdateQty={vi.fn()}
      />
    )
    expect(screen.getByText('Free shipping unlocked!')).toBeInTheDocument()
  })

  it('shows shipping remaining when below threshold', () => {
    render(
      <CartDrawer
        open={true}
        cart={mockCart}
        fmt={formatINR}
        cartTotal={1000}
        onClose={vi.fn()}
        onRemove={vi.fn()}
        onUpdateQty={vi.fn()}
      />
    )
    expect(screen.getByText(/₹3,999/)).toBeInTheDocument()
  })

  it('checkout button is disabled', () => {
    render(
      <CartDrawer
        open={true}
        cart={mockCart}
        fmt={formatINR}
        cartTotal={6000}
        onClose={vi.fn()}
        onRemove={vi.fn()}
        onUpdateQty={vi.fn()}
      />
    )
    expect(screen.getByText(/Coming Soon/)).toBeDisabled()
  })

  it('calls onRemove when remove button clicked', async () => {
    const user = userEvent.setup()
    const onRemove = vi.fn()
    render(
      <CartDrawer
        open={true}
        cart={mockCart}
        fmt={formatINR}
        cartTotal={6000}
        onClose={vi.fn()}
        onRemove={onRemove}
        onUpdateQty={vi.fn()}
      />
    )
    await user.click(screen.getByText('remove'))
    expect(onRemove).toHaveBeenCalledWith('1-42')
  })

  it('calls onUpdateQty when increment clicked', async () => {
    const user = userEvent.setup()
    const onUpdateQty = vi.fn()
    render(
      <CartDrawer
        open={true}
        cart={mockCart}
        fmt={formatINR}
        cartTotal={6000}
        onClose={vi.fn()}
        onRemove={vi.fn()}
        onUpdateQty={onUpdateQty}
      />
    )
    const buttons = screen.getAllByRole('button', { name: /Increase quantity/ })
    await user.click(buttons[0])
    expect(onUpdateQty).toHaveBeenCalledWith('1-42', 1)
  })
})
