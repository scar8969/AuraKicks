import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Stats from './Stats'

const mockProducts = [
  { id: 1, brand: 'Nike', price: 1000, on_sale: false, sizes: ['41', '42'] },
  { id: 2, brand: 'Adidas', price: 2000, on_sale: false, sizes: ['42', '43'] },
  { id: 3, brand: 'Nike', price: 500, on_sale: true, sale_price: 300, sizes: ['41'] },
]

describe('Stats', () => {
  it('derives product count from data', () => {
    render(<Stats products={mockProducts} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('derives brand count from data', () => {
    render(<Stats products={mockProducts} />)
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('derives size range from data', () => {
    render(<Stats products={mockProducts} />)
    expect(screen.getByText('41–43')).toBeInTheDocument()
  })

  it('derives price range from effective prices', () => {
    render(<Stats products={mockProducts} />)
    expect(screen.getByText(/₹300/)).toBeInTheDocument()
  })

  it('handles empty products', () => {
    render(<Stats products={[]} />)
    expect(screen.getAllByText('0').length).toBe(2)
    expect(screen.getByText('N/A')).toBeInTheDocument()
  })
})
