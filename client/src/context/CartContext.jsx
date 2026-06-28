import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import * as cartService from '../services/cartService'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)
const GUEST_STORAGE_KEY = 'caelosphere_guest_cart'

// Normalizes a server cart item (populated product + quantity) into the flat
// shape the UI expects, mirroring the old mock product shape.
function normalizeServerItem(item) {
  const p = item.product
  return {
    id: p._id,
    productId: p._id,
    slug: p.slug,
    title: p.title,
    category: p.category,
    categoryLabel: p.categoryLabel,
    thumbnail: p.thumbnail,
    price: item.price,
    originalPrice: p.originalPrice,
    badge: p.badge,
    quantity: item.quantity,
  }
}

function readGuestCart() {
  try {
    const stored = localStorage.getItem(GUEST_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function writeGuestCart(items) {
  localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(items))
}

export function CartProvider({ children }) {
  const { user, loading: authLoading } = useAuth()
  const [items, setItems] = useState([])
  const [syncing, setSyncing] = useState(false)

  const loadServerCart = useCallback(async () => {
    const cart = await cartService.getCart()
    setItems((cart.products || []).map(normalizeServerItem))
  }, [])

  // Whenever auth state settles, load the right cart source.
  // On first login, merge any guest-cart items into the server cart.
  useEffect(() => {
    if (authLoading) return

    if (!user) {
      setItems(readGuestCart())
      return
    }

    setSyncing(true)
    const guestItems = readGuestCart()

    const sync = async () => {
      for (const item of guestItems) {
        await cartService.addToCart(item.productId || item.id, item.quantity)
      }
      if (guestItems.length > 0) {
        localStorage.removeItem(GUEST_STORAGE_KEY)
      }
      await loadServerCart()
    }

    sync().finally(() => setSyncing(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading])

  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      setItems((prev) => {
        const existing = prev.find((i) => i.id === product.id)
        const next = existing
          ? prev.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i))
          : [...prev, { ...product, productId: product.id, quantity }]
        writeGuestCart(next)
        return next
      })
      return
    }
    const cart = await cartService.addToCart(product.id, quantity)
    setItems((cart.products || []).map(normalizeServerItem))
  }

  const removeFromCart = async (id) => {
    if (!user) {
      setItems((prev) => {
        const next = prev.filter((i) => i.id !== id)
        writeGuestCart(next)
        return next
      })
      return
    }
    const cart = await cartService.removeFromCart(id)
    setItems((cart.products || []).map(normalizeServerItem))
  }

  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return
    if (!user) {
      setItems((prev) => {
        const next = prev.map((i) => (i.id === id ? { ...i, quantity } : i))
        writeGuestCart(next)
        return next
      })
      return
    }
    const cart = await cartService.updateCartItem(id, quantity)
    setItems((cart.products || []).map(normalizeServerItem))
  }

  const clearCart = async () => {
    if (!user) {
      setItems([])
      writeGuestCart([])
      return
    }
    await cartService.clearCart()
    setItems([])
  }

  // Called after a successful order placement to refresh from the (now-empty) server cart.
  const refreshCart = async () => {
    if (user) await loadServerCart()
  }

  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items])
  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items])
  const discount = useMemo(() => {
    const original = items.reduce((sum, i) => sum + (i.originalPrice || i.price) * i.quantity, 0)
    return Math.max(0, original - subtotal)
  }, [items, subtotal])
  const taxes = useMemo(() => subtotal * 0.0825, [subtotal])
  const total = useMemo(() => subtotal + taxes, [subtotal, taxes])

  return (
    <CartContext.Provider
      value={{
        items,
        syncing,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart,
        itemCount,
        subtotal,
        discount,
        taxes,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
