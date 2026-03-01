import { create } from 'zustand'
import type { CartItem, Product } from './types'

type CartState = {
  items: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: number) => void
  changeQuantity: (productId: number, quantity: number) => void
  clear: () => void
}

const STORAGE_KEY = 'oil-shop-cart'

function loadInitialState(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

function persist(items: CartItem[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // ignore
  }
}

export const useCartStore = create<CartState>((set, get) => ({
  items: loadInitialState(),
  addToCart: (product) => {
    const { items } = get()
    const existing = items.find((i) => i.product.id === product.id)
    let next: CartItem[]

    if (existing) {
      next = items.map((i) =>
        i.product.id === product.id
          ? { ...i, quantity: i.quantity + 1 }
          : i,
      )
    } else {
      next = [...items, { product, quantity: 1 }]
    }

    persist(next)
    set({ items: next })
  },
  removeFromCart: (productId) => {
    const next = get().items.filter((i) => i.product.id !== productId)
    persist(next)
    set({ items: next })
  },
  changeQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      const next = get().items.filter((i) => i.product.id !== productId)
      persist(next)
      set({ items: next })
      return
    }
    const next = get().items.map((i) =>
      i.product.id === productId ? { ...i, quantity } : i,
    )
    persist(next)
    set({ items: next })
  },
  clear: () => {
    persist([])
    set({ items: [] })
  },
}))

