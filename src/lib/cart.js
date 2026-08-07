export function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const { product, size, qty = 1 } = action
      const key = `${product.id}-${size}`
      const found = state.find((i) => i.key === key)
      if (found) {
        return state.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i))
      }
      return [...state, { key, productId: product.id, product, size, qty }]
    }
    case 'REMOVE':
      return state.filter((i) => i.key !== action.key)
    case 'SET_QTY': {
      const { key, qty } = action
      if (qty < 1) return state.filter((i) => i.key !== key)
      return state.map((i) => (i.key === key ? { ...i, qty } : i))
    }
    case 'INCREMENT':
      return state.map((i) => (i.key === action.key ? { ...i, qty: i.qty + 1 } : i))
    case 'DECREMENT': {
      const item = state.find((i) => i.key === action.key)
      if (!item || item.qty <= 1) {
        return state.filter((i) => i.key !== action.key)
      }
      return state.map((i) => (i.key === action.key ? { ...i, qty: i.qty - 1 } : i))
    }
    case 'CLEAR':
      return []
    case 'HYDRATE':
      return Array.isArray(action.cart) ? action.cart : []
    default:
      return state
  }
}
