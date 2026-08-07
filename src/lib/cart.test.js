import { describe, it, expect } from 'vitest'
import { cartReducer } from './cart.js'

describe('cartReducer', () => {
  const product = { id: 1, name: 'Test', price: 100, on_sale: false }

  it('ADD creates new line item', () => {
    const result = cartReducer([], { type: 'ADD', product, size: '42', qty: 1 })
    expect(result).toHaveLength(1)
    expect(result[0].key).toBe('1-42')
    expect(result[0].qty).toBe(1)
  })

  it('ADD increments qty for existing line', () => {
    const state = [{ key: '1-42', productId: 1, product, size: '42', qty: 1 }]
    const result = cartReducer(state, { type: 'ADD', product, size: '42', qty: 1 })
    expect(result[0].qty).toBe(2)
  })

  it('ADD with qty > 1 adds correct quantity', () => {
    const result = cartReducer([], { type: 'ADD', product, size: '42', qty: 3 })
    expect(result[0].qty).toBe(3)
  })

  it('REMOVE removes line item', () => {
    const state = [{ key: '1-42', productId: 1, product, size: '42', qty: 1 }]
    const result = cartReducer(state, { type: 'REMOVE', key: '1-42' })
    expect(result).toHaveLength(0)
  })

  it('INCREMENT increases qty', () => {
    const state = [{ key: '1-42', productId: 1, product, size: '42', qty: 2 }]
    const result = cartReducer(state, { type: 'INCREMENT', key: '1-42' })
    expect(result[0].qty).toBe(3)
  })

  it('DECREMENT decreases qty', () => {
    const state = [{ key: '1-42', productId: 1, product, size: '42', qty: 3 }]
    const result = cartReducer(state, { type: 'DECREMENT', key: '1-42' })
    expect(result[0].qty).toBe(2)
  })

  it('DECREMENT removes item when qty reaches 0', () => {
    const state = [{ key: '1-42', productId: 1, product, size: '42', qty: 1 }]
    const result = cartReducer(state, { type: 'DECREMENT', key: '1-42' })
    expect(result).toHaveLength(0)
  })

  it('SET_QTY sets explicit quantity', () => {
    const state = [{ key: '1-42', productId: 1, product, size: '42', qty: 1 }]
    const result = cartReducer(state, { type: 'SET_QTY', key: '1-42', qty: 5 })
    expect(result[0].qty).toBe(5)
  })

  it('SET_QTY removes item when qty < 1', () => {
    const state = [{ key: '1-42', productId: 1, product, size: '42', qty: 1 }]
    const result = cartReducer(state, { type: 'SET_QTY', key: '1-42', qty: 0 })
    expect(result).toHaveLength(0)
  })

  it('CLEAR empties cart', () => {
    const state = [{ key: '1-42', productId: 1, product, size: '42', qty: 1 }]
    const result = cartReducer(state, { type: 'CLEAR' })
    expect(result).toHaveLength(0)
  })

  it('HYDRATE replaces state', () => {
    const newCart = [{ key: '2-43', productId: 2, product: { id: 2 }, size: '43', qty: 2 }]
    const result = cartReducer([], { type: 'HYDRATE', cart: newCart })
    expect(result).toEqual(newCart)
  })
})
