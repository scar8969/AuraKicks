import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import Navbar from './Navbar'

describe('Navbar', () => {
  it('renders search and cart buttons with aria labels', () => {
    render(<Navbar cartCount={0} onCart={vi.fn()} onSearch={vi.fn()} solid={false} />)
    expect(screen.getByLabelText('Search products')).toBeInTheDocument()
    expect(screen.getByLabelText('Cart with 0 items')).toBeInTheDocument()
  })

  it('updates cart count in aria label', () => {
    render(<Navbar cartCount={5} onCart={vi.fn()} onSearch={vi.fn()} solid={false} />)
    expect(screen.getByLabelText('Cart with 5 items')).toBeInTheDocument()
  })

  it('shows nav links', () => {
    render(<Navbar cartCount={0} onCart={vi.fn()} onSearch={vi.fn()} solid={false} />)
    expect(screen.getByText('Shop')).toBeInTheDocument()
    expect(screen.getByText('The Drop')).toBeInTheDocument()
    expect(screen.getByText('Manifesto')).toBeInTheDocument()
  })

  it('toggles mobile menu', async () => {
    const user = userEvent.setup()
    render(<Navbar cartCount={0} onCart={vi.fn()} onSearch={vi.fn()} solid={false} />)
    expect(screen.queryByLabelText('Toggle menu')).toHaveAttribute('aria-expanded', 'false')
    await user.click(screen.getByLabelText('Toggle menu'))
    expect(screen.getByLabelText('Toggle menu')).toHaveAttribute('aria-expanded', 'true')
  })

  it('calls onCart when cart button clicked', async () => {
    const user = userEvent.setup()
    const onCart = vi.fn()
    render(<Navbar cartCount={0} onCart={onCart} onSearch={vi.fn()} solid={false} />)
    await user.click(screen.getByLabelText('Cart with 0 items'))
    expect(onCart).toHaveBeenCalled()
  })

  it('calls onSearch when search button clicked', async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()
    render(<Navbar cartCount={0} onCart={vi.fn()} onSearch={onSearch} solid={false} />)
    await user.click(screen.getByLabelText('Search products'))
    expect(onSearch).toHaveBeenCalled()
  })
})
