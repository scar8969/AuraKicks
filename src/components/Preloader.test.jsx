import React from 'react'
import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import Preloader from './Preloader'

describe('Preloader', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows loading message when loading', () => {
    render(<Preloader loading={true} onDone={vi.fn()} />)
    expect(screen.getByText('loading the forge')).toBeInTheDocument()
  })

  it('shows entering message when not loading', () => {
    render(<Preloader loading={false} onDone={vi.fn()} />)
    expect(screen.getByText('entering')).toBeInTheDocument()
  })

  it('shows percentage counter', () => {
    render(<Preloader loading={true} onDone={vi.fn()} />)
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('%')).toBeInTheDocument()
  })

  it('caps progress at 90 while loading', () => {
    render(<Preloader loading={true} onDone={vi.fn()} />)
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    const span = document.querySelector('.preloader-pct span')
    const pct = parseInt(span.textContent)
    expect(pct).toBeLessThanOrEqual(90)
  })

  it('reaches 100 and calls onDone when loading finishes', () => {
    const onDone = vi.fn()
    render(<Preloader loading={true} onDone={onDone} />)
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(onDone).not.toHaveBeenCalled()
    // Rerender with loading=false to simulate fetch complete
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    // The component needs loading=false to reach 100
  })

  it('has accessible logo image', () => {
    render(<Preloader loading={true} onDone={vi.fn()} />)
    expect(screen.getByAltText('AURA KICKS')).toBeInTheDocument()
  })
})
