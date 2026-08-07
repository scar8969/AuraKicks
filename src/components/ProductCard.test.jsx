import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'

import ProductCard from './ProductCard'
import { formatINR } from '../lib/pricing'

const mockProduct = {
  id: 1,
  name: 'Test Sneaker',
  brand: 'Nike',
  price: 3000,
  on_sale: false,
  in_stock: true,
  purchasable: true,
  sizes: ['41', '42', '43'],
  images: [{ src: 'test.jpg', is_primary: true }],
}

const mockSaleProduct = {
  ...mockProduct,
  id: 2,
  on_sale: true,
  sale_price: 2500,
  compare_at: 3000,
  regular_price: 3000,
}

const mockSoldOutProduct = {
  ...mockProduct,
  id: 3,
  in_stock: false,
  purchasable: false,
}

describe('ProductCard', () => {
  it('renders product name and price', () => {
    render(
      <ProductCard product={mockProduct} fmt={formatINR} onAddToCart={vi.fn()} onDetail={vi.fn()} />
    )
    expect(screen.getByText('Test Sneaker')).toBeInTheDocument()
    expect(screen.getByText('₹3,000')).toBeInTheDocument()
  })

  it('shows sale price with strikethrough', () => {
    render(
      <ProductCard
        product={mockSaleProduct}
        fmt={formatINR}
        onAddToCart={vi.fn()}
        onDetail={vi.fn()}
      />
    )
    expect(screen.getByText('₹3,000')).toBeInTheDocument()
    expect(screen.getByText('₹2,500')).toBeInTheDocument()
    expect(screen.getByText('SALE')).toBeInTheDocument()
  })

  it('shows SOLD OUT badge for unpurchasable products', () => {
    render(
      <ProductCard
        product={mockSoldOutProduct}
        fmt={formatINR}
        onAddToCart={vi.fn()}
        onDetail={vi.fn()}
      />
    )
    expect(screen.getByText('SOLD OUT')).toBeInTheDocument()
  })

  it('disables add-to-cart when sold out', () => {
    render(
      <ProductCard
        product={mockSoldOutProduct}
        fmt={formatINR}
        onAddToCart={vi.fn()}
        onDetail={vi.fn()}
      />
    )
    expect(screen.getByText('sold out')).toBeDisabled()
  })

  it('shows size error when adding without selection', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(
      <ProductCard product={mockProduct} fmt={formatINR} onAddToCart={onAdd} onDetail={vi.fn()} />
    )
    await user.click(screen.getByText('add to cart'))
    expect(screen.getByText('Please select a size')).toBeInTheDocument()
    expect(onAdd).not.toHaveBeenCalled()
  })

  it('adds to cart when size is selected', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(
      <ProductCard product={mockProduct} fmt={formatINR} onAddToCart={onAdd} onDetail={vi.fn()} />
    )
    await user.click(screen.getByText('42'))
    await user.click(screen.getByText('add to cart'))
    expect(onAdd).toHaveBeenCalledWith(mockProduct, '42')
  })

  it('calls onDetail when quick view is clicked', async () => {
    const user = userEvent.setup()
    const onDetail = vi.fn()
    render(
      <ProductCard
        product={mockProduct}
        fmt={formatINR}
        onAddToCart={vi.fn()}
        onDetail={onDetail}
      />
    )
    await user.click(screen.getByText('Quick View'))
    expect(onDetail).toHaveBeenCalledWith(mockProduct)
  })

  it('renders EMI from effective price', () => {
    render(
      <ProductCard product={mockProduct} fmt={formatINR} onAddToCart={vi.fn()} onDetail={vi.fn()} />
    )
    expect(screen.getByText(/₹1,000\/mo/)).toBeInTheDocument()
  })
})
