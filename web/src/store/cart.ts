import { create } from 'zustand'
import { CartItem } from '@/types'

interface CartStore {
  items: CartItem[]
  total: number
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  calculateTotal: () => void
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  total: 0,
  addItem: (item) => {
    const current = get().items
    const existing = current.find((i) => i.productId === item.productId)
    if (existing) {
      existing.quantity += item.quantity
    } else {
      current.push(item)
    }
    set({ items: current })
    get().calculateTotal()
  },
  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((i) => i.productId !== productId),
    }))
    get().calculateTotal()
  },
  updateQuantity: (productId, quantity) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      ),
    }))
    get().calculateTotal()
  },
  clearCart: () => set({ items: [], total: 0 }),
  calculateTotal: () => {
    const total = get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    set({ total })
  },
}))
