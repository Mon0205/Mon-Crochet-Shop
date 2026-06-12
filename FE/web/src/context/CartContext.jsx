import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { cartApi } from '../api/cartApi'
import { useAuth } from '../hooks/useAuth'
import { getImageUrl } from '../utils/productImages'

export const CartContext = createContext(null)

const getStoredCart = () => {
  const raw = localStorage.getItem('cart')
  return raw ? JSON.parse(raw) : []
}

const saveLocalCart = (items) => {
  localStorage.setItem('cart', JSON.stringify(items))
}

const toCartPayload = (items) =>
  items.map((item) => ({ product: item._id, quantity: item.quantity, variantColor: item.variantColor }))

const isSameCartItem = (item, id, variantColor = '') =>
  item._id === id && (item.variantColor || '') === (variantColor || '')

export const formatPrice = (price) => `${new Intl.NumberFormat('vi-VN').format(price || 0)}đ`

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState(getStoredCart)
  const [cartLoading, setCartLoading] = useState(false)
  const hydratedUserRef = useRef('')

  const persistCart = useCallback(
    async (nextItems) => {
      saveLocalCart(nextItems)

      if (!user) return

      try {
        await cartApi.saveCart(toCartPayload(nextItems))
      } catch (error) {
        console.error('SAVE CART ERROR:', error.message)
      }
    },
    [user],
  )

  const updateItems = useCallback(
    (updater) => {
      setItems((current) => {
        const next = typeof updater === 'function' ? updater(current) : updater
        persistCart(next)
        return next
      })
    },
    [persistCart],
  )

  useEffect(() => {
    if (!user) {
      hydratedUserRef.current = ''
      return
    }

    if (hydratedUserRef.current === user._id) return
    hydratedUserRef.current = user._id
    setCartLoading(true)

    cartApi
      .getCart()
      .then(async (res) => {
        const serverItems = res.data.items || []
        const localItems = getStoredCart()
        const hasLocalItems = localItems.length > 0

        if (serverItems.length === 0 && hasLocalItems) {
          await cartApi.saveCart(toCartPayload(localItems))
          setItems(localItems)
          saveLocalCart(localItems)
          return
        }

        setItems(serverItems)
        saveLocalCart(serverItems)
      })
      .catch((error) => console.error('LOAD CART ERROR:', error.message))
      .finally(() => setCartLoading(false))
  }, [user])

  const addToCart = useCallback(
    (product, quantity = 1, selectedVariant = null) => {
      updateItems((current) => {
        const variant = selectedVariant || product.variants?.[0]
        const variantColor = variant?.color || product.color || ''
        const stock = variant?.quantity ?? product.quantity
        const existing = current.find((item) => item._id === product._id && item.variantColor === variantColor)
        const price = product.discountPrice > 0 ? product.discountPrice : product.price

        if (existing) {
          return current.map((item) =>
            item._id === product._id && item.variantColor === variantColor
              ? { ...item, quantity: Math.min(item.quantity + quantity, stock) }
              : item,
          )
        }

        return [
          ...current,
          {
            _id: product._id,
            name: product.name,
            price,
            stock,
            image: getImageUrl(variant?.images?.[0] || product.images?.[0]),
            variantColor,
            quantity: Math.min(quantity, stock),
          },
        ]
      })
    },
    [updateItems],
  )

  const changeQuantity = useCallback(
    (id, variantColor, quantity) => {
      updateItems((current) =>
        current
          .map((item) =>
            isSameCartItem(item, id, variantColor)
              ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) }
              : item,
          )
          .filter((item) => item.quantity > 0),
      )
    },
    [updateItems],
  )

  const removeFromCart = useCallback(
    (id, variantColor) => {
      updateItems((current) => current.filter((item) => !isSameCartItem(item, id, variantColor)))
    },
    [updateItems],
  )

  const clearCart = useCallback(async () => {
    setItems([])
    saveLocalCart([])

    if (!user) return

    try {
      await cartApi.clearCart()
    } catch (error) {
      console.error('CLEAR CART ERROR:', error.message)
    }
  }, [user])

  const totalQuantity = new Set(items.map((item) => `${item._id}-${item.variantColor || 'default'}`)).size
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const value = useMemo(
    () => ({ items, cartLoading, totalQuantity, totalPrice, addToCart, changeQuantity, removeFromCart, clearCart }),
    [items, cartLoading, totalQuantity, totalPrice, addToCart, changeQuantity, removeFromCart, clearCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
