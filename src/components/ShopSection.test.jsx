import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import ShopSection from './ShopSection'
import { formatINR } from '../lib/pricing'

const mockProducts = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: `Sneaker ${i + 1}`,
  brand: i < 15 ? 'Nike' : 'Adidas',
  category: 'Sneakers',
  categories: ['Sneakers'],
  price: 1000 + i * 100,
  on_sale: false,
  in_stock: true,
  purchasable: true,
  sizes: ['41', '42'],
  images: [{ src: `img${i}.jpg`, is_primary: true }],
}))

describe('ShopSection', () => {
  it('renders skeleton loading state', () => {
    render(
      <ShopSection
        products={[]}
        loading={true}
        fmt={formatINR}
        onAddToCart={vi.fn()}
        onDetail={vi.fn()}
      />
    )
    const skeletons = document.querySelectorAll('.skeleton-img')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('renders product cards', () => {
    render(
      <ShopSection
        products={mockProducts}
        loading={false}
        fmt={formatINR}
        onAddToCart={vi.fn()}
        onDetail={vi.fn()}
      />
    )
    expect(screen.getByText('Sneaker 1')).toBeInTheDocument()
  })

  it('paginates to show max 24 items', () => {
    render(
      <ShopSection
        products={mockProducts}
        loading={false}
        fmt={formatINR}
        onAddToCart={vi.fn()}
        onDetail={vi.fn()}
      />
    )
    const cards = screen.getAllByText(/Sneaker \d+/)
    expect(cards.length).toBeLessThanOrEqual(24)
  })

  it('shows pagination controls when more than one page', () => {
    render(
      <ShopSection
        products={mockProducts}
        loading={false}
        fmt={formatINR}
        onAddToCart={vi.fn()}
        onDetail={vi.fn()}
      />
    )
    const pagination = document.querySelector('.pagination')
    expect(pagination).toBeInTheDocument()
    const activePage = document.querySelector('.page-num.active')
    expect(activePage).toBeInTheDocument()
    expect(activePage.textContent).toBe('1')
  })

  it('shows no results message when filtered list is empty', async () => {
    const user = userEvent.setup()
    render(
      <ShopSection
        products={mockProducts}
        loading={false}
        fmt={formatINR}
        onAddToCart={vi.fn()}
        onDetail={vi.fn()}
      />
    )
    await user.type(screen.getByPlaceholderText('Search the forge…'), 'nonexistent')
    await waitFor(
      () => {
        expect(screen.getByText('no kicks found')).toBeInTheDocument()
      },
      { timeout: 3000 }
    )
  })
})
