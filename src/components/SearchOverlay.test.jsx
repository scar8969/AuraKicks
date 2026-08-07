import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import SearchOverlay from './SearchOverlay'
import { formatINR } from '../lib/pricing'

const mockProducts = [
  {
    id: 1,
    name: 'Air Jordan 1',
    brand: 'Nike',
    category: 'Basketball',
    price: 5000,
    on_sale: false,
  },
  { id: 2, name: 'Yeezy 350', brand: 'Adidas', category: 'Lifestyle', price: 4000, on_sale: false },
  {
    id: 3,
    name: 'Dunk Low',
    brand: 'Nike',
    category: 'Sneakers',
    price: 3000,
    on_sale: true,
    sale_price: 2500,
    compare_at: 3000,
    regular_price: 3000,
  },
]

describe('SearchOverlay', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <SearchOverlay
        open={false}
        products={mockProducts}
        fmt={formatINR}
        onClose={vi.fn()}
        onSelect={vi.fn()}
      />
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('shows search input when open', () => {
    render(
      <SearchOverlay
        open={true}
        products={mockProducts}
        fmt={formatINR}
        onClose={vi.fn()}
        onSelect={vi.fn()}
      />
    )
    expect(screen.getByPlaceholderText('Search the forge…')).toBeInTheDocument()
  })

  it('filters products by name', async () => {
    const user = userEvent.setup()
    render(
      <SearchOverlay
        open={true}
        products={mockProducts}
        fmt={formatINR}
        onClose={vi.fn()}
        onSelect={vi.fn()}
      />
    )
    await user.type(screen.getByPlaceholderText('Search the forge…'), 'jordan')
    expect(screen.getByText('Air Jordan 1')).toBeInTheDocument()
    expect(screen.queryByText('Yeezy 350')).not.toBeInTheDocument()
  })

  it('filters products by brand', async () => {
    const user = userEvent.setup()
    render(
      <SearchOverlay
        open={true}
        products={mockProducts}
        fmt={formatINR}
        onClose={vi.fn()}
        onSelect={vi.fn()}
      />
    )
    await user.type(screen.getByPlaceholderText('Search the forge…'), 'adidas')
    expect(screen.getByText('Yeezy 350')).toBeInTheDocument()
    expect(screen.queryByText('Air Jordan 1')).not.toBeInTheDocument()
  })

  it('shows empty message when no results', async () => {
    const user = userEvent.setup()
    render(
      <SearchOverlay
        open={true}
        products={mockProducts}
        fmt={formatINR}
        onClose={vi.fn()}
        onSelect={vi.fn()}
      />
    )
    await user.type(screen.getByPlaceholderText('Search the forge…'), 'nonexistent')
    expect(screen.getByText('nothing found in the forge')).toBeInTheDocument()
  })

  it('calls onSelect when a result is clicked', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(
      <SearchOverlay
        open={true}
        products={mockProducts}
        fmt={formatINR}
        onClose={vi.fn()}
        onSelect={onSelect}
      />
    )
    await user.type(screen.getByPlaceholderText('Search the forge…'), 'dunk')
    await user.click(screen.getByText('Dunk Low'))
    expect(onSelect).toHaveBeenCalledWith(mockProducts[2])
  })
})
