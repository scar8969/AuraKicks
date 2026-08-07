import React from 'react'
import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import AnnouncementBar from './AnnouncementBar'

describe('AnnouncementBar', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders first message initially', () => {
    render(<AnnouncementBar />)
    expect(screen.getByText(/Free shipping over/)).toBeInTheDocument()
  })

  it('rotates messages', () => {
    render(<AnnouncementBar />)
    act(() => {
      vi.advanceTimersByTime(3500)
    })
    expect(screen.getByText(/EMI zero-interest/)).toBeInTheDocument()
  })

  it('shows product count when products provided', () => {
    render(<AnnouncementBar products={Array(1953).fill({})} />)
    act(() => {
      vi.advanceTimersByTime(7000)
    })
    expect(screen.getByText(/1,953 products/)).toBeInTheDocument()
  })

  it('shows fallback message when no products', () => {
    render(<AnnouncementBar />)
    act(() => {
      vi.advanceTimersByTime(7000)
    })
    expect(screen.getByText(/fresh from the vault/)).toBeInTheDocument()
  })
})
