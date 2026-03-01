import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OrderCard } from './OrderCard'

describe('OrderCard', () => {
  const order = {
    orderId: '101',
    customerName: 'John Smith',
    status: 'Pending' as const,
    total: 149.99,
    items: ['Widget Pro', 'USB Cable'],
  }

  it('renders order id and customer', () => {
    render(<OrderCard order={order} />)
    expect(screen.getByText(/Order #101/)).toBeInTheDocument()
    expect(screen.getByText('John Smith')).toBeInTheDocument()
  })

  it('renders status badge', () => {
    render(<OrderCard order={order} />)
    expect(screen.getByText('Pending')).toBeInTheDocument()
  })

  it('renders total', () => {
    render(<OrderCard order={order} />)
    expect(screen.getByText('$149.99')).toBeInTheDocument()
  })

  it('renders items', () => {
    render(<OrderCard order={order} />)
    expect(screen.getByText('Widget Pro')).toBeInTheDocument()
    expect(screen.getByText('USB Cable')).toBeInTheDocument()
  })

  it('has order-card test id', () => {
    render(<OrderCard order={order} />)
    expect(screen.getByTestId('order-card')).toBeInTheDocument()
  })
})
