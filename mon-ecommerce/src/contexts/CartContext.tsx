'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CartItem {
  id: string
  productId: string
  title: string
  brand: string
  price: number
  image: string
  size: string
  color: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  addToCart: (item: Omit<CartItem, 'id' | 'quantity'>) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getItemById: (id: string) => CartItem | undefined
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Charger le panier depuis localStorage au montage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
  }, [])

  // Sauvegarder le panier dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addToCart = (newItem: Omit<CartItem, 'id' | 'quantity'>) => {
    const existingItem = items.find(
      (item) =>
        item.productId === newItem.productId &&
        item.size === newItem.size &&
        item.color === newItem.color,
    )

    if (existingItem) {
      // Si l'article existe déjà, augmenter la quantité
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === existingItem.id ? { ...item, quantity: item.quantity + 1 } : item,
        ),
      )
    } else {
      // Si c'est un nouvel article, l'ajouter avec un ID unique
      const newCartItem: CartItem = {
        ...newItem,
        id: `${newItem.productId}-${newItem.size}-${newItem.color}-${Date.now()}`,
        quantity: 1,
      }
      setItems((prevItems) => [...prevItems, newCartItem])
    }
  }

  const removeFromCart = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }

    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)),
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const getItemById = (id: string) => {
    return items.find((item) => item.id === id)
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemById,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

