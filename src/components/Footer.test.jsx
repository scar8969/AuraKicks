import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import Footer from './Footer'

describe('Footer', () => {
  it('renders newsletter form with label', () => {
    render(<Footer />)
    expect(screen.getByText('Join the bloodline')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument()
  })

  it('has no placeholder social links', () => {
    const { container } = render(<Footer />)
    const links = container.querySelectorAll('.footer-links a[href^="#"]')
    expect(links.length).toBe(1)
    expect(links[0].getAttribute('href')).toBe('#top')
  })

  it('shows subscribing state on submit', async () => {
    const user = userEvent.setup()
    render(<Footer />)
    await user.type(screen.getByPlaceholderText('your@email.com'), 'test@example.com')
    await user.click(screen.getByText('Ignite'))
    expect(screen.getByText('subscribing…')).toBeInTheDocument()
  })
})
