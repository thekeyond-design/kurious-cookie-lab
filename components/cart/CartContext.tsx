"use client"

import { createContext, useContext, useReducer, useEffect, useCallback } from "react"
import { BOX_CONFIG } from "@/types"
import { COOKIES } from "@/lib/cookies"

export type CartItem = {
  id: string
  boxSize: number
  cookieIds: string[]
  subtotal: number
}

type CartState = {
  items: CartItem[]
  isOpen: boolean
}

type CartAction =
  | { type: "ADD"; item: CartItem }
  | { type: "REMOVE"; id: string }
  | { type: "CLEAR" }
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "HYDRATE"; items: CartItem[] }

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD":    return { ...state, items: [...state.items, action.item], isOpen: true }
    case "REMOVE": return { ...state, items: state.items.filter(i => i.id !== action.id) }
    case "CLEAR":  return { ...state, items: [] }
    case "OPEN":   return { ...state, isOpen: true }
    case "CLOSE":  return { ...state, isOpen: false }
    case "HYDRATE": return { ...state, items: action.items }
    default:       return state
  }
}

type CartContextValue = {
  items: CartItem[]
  isOpen: boolean
  addItem: (boxSize: number, cookieIds: string[]) => void
  removeItem: (id: string) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  itemCount: number
  cartSubtotal: number
}

const CartContext = createContext<CartContextValue | null>(null)

function computeSubtotal(boxSize: number, cookieIds: string[]): number {
  const config = BOX_CONFIG[boxSize]
  if (config?.flatPrice) return config.flatPrice
  return cookieIds
    .map(id => COOKIES.find(c => c.id === id))
    .filter(Boolean)
    .reduce((sum, c) => sum + (c?.price ?? 0), 0)
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], isOpen: false })

  useEffect(() => {
    try {
      const saved = localStorage.getItem("kcl-cart")
      if (saved) dispatch({ type: "HYDRATE", items: JSON.parse(saved) })
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem("kcl-cart", JSON.stringify(state.items))
  }, [state.items])

  useEffect(() => {
    document.body.style.overflow = state.isOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [state.isOpen])

  function addItem(boxSize: number, cookieIds: string[]) {
    dispatch({
      type: "ADD",
      item: { id: crypto.randomUUID(), boxSize, cookieIds, subtotal: computeSubtotal(boxSize, cookieIds) },
    })
  }

  const removeItem = useCallback((id: string) => dispatch({ type: "REMOVE", id }), [])
  const clearCart  = useCallback(() => dispatch({ type: "CLEAR" }), [])
  const openCart   = useCallback(() => dispatch({ type: "OPEN" }), [])
  const closeCart  = useCallback(() => dispatch({ type: "CLOSE" }), [])

  return (
    <CartContext.Provider value={{
      items: state.items,
      isOpen: state.isOpen,
      addItem, removeItem, clearCart, openCart, closeCart,
      itemCount: state.items.length,
      cartSubtotal: state.items.reduce((s, i) => s + i.subtotal, 0),
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be inside CartProvider")
  return ctx
}
