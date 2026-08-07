import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Countdown from './Countdown'

describe('Countdown', () => {
  it('renders the countdown section', () => {
    render(<Countdown />)
    expect(screen.getByText('the forge opens in')).toBeInTheDocument()
  })

  it('renders all time units', () => {
    render(<Countdown />)
    expect(screen.getByText('days')).toBeInTheDocument()
    expect(screen.getByText('hours')).toBeInTheDocument()
    expect(screen.getByText('minutes')).toBeInTheDocument()
    expect(screen.getByText('seconds')).toBeInTheDocument()
  })

  it('renders CTA link', () => {
    render(<Countdown />)
    expect(screen.getByText('see the kicks')).toBeInTheDocument()
    expect(screen.getByText('see the kicks').closest('a')).toHaveAttribute('href', '#kicks')
  })

  it('shows numeric countdown values', () => {
    render(<Countdown />)
    const flips = document.querySelectorAll('.cd-flip')
    expect(flips.length).toBe(4)
    flips.forEach((f) => {
      expect(f.textContent).toMatch(/^\d+$/)
    })
  })
})
