import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Toast from './Toast'

describe('Toast', () => {
  it('renders message when provided', () => {
    render(<Toast msg="added to haul" onDone={() => {}} />)
    expect(screen.getByText('added to haul')).toBeInTheDocument()
  })

  it('has role=status for accessibility', () => {
    render(<Toast msg="test" onDone={() => {}} />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
