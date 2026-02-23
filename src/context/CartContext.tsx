import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react'
import { api, type Cart, type CartItem } from '../lib/api'

// ── Types ────────────────────────────────────────────────────────

interface CartContextValue {
    cart: Cart | null
    itemCount: number
    loading: boolean
    addToCart: (productId: string, variantId: string, quantity?: number) => Promise<void>
    updateQty: (itemId: string, quantity: number) => Promise<void>
    removeItem: (itemId: string) => Promise<void>
    refreshCart: () => Promise<void>
}

// ── Context ───────────────────────────────────────────────────────

const CartContext = createContext<CartContextValue>({
    cart: null,
    itemCount: 0,
    loading: true,
    addToCart: async () => { },
    updateQty: async () => { },
    removeItem: async () => { },
    refreshCart: async () => { },
})

// ── Provider ──────────────────────────────────────────────────────

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<Cart | null>(null)
    const [loading, setLoading] = useState(true)

    const refreshCart = useCallback(async () => {
        try {
            const data = await api.get<{ cart: Cart }>('/cart')
            setCart(data.cart)
        } catch (err) {
            console.error('[CartContext] Failed to fetch cart:', err)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        refreshCart()
    }, [refreshCart])

    const addToCart = useCallback(
        async (productId: string, variantId: string, quantity = 1) => {
            try {
                const data = await api.post<{ cart: Cart }>('/cart', {
                    productId,
                    variantId,
                    quantity,
                })
                setCart(data.cart)
            } catch (err) {
                console.error('[CartContext] addToCart failed:', err)
                throw err
            }
        },
        []
    )

    const updateQty = useCallback(async (itemId: string, quantity: number) => {
        try {
            // Optimistic update
            setCart((prev) => {
                if (!prev) return prev
                if (quantity === 0) {
                    return { ...prev, items: prev.items.filter((i) => i.id !== itemId) }
                }
                return {
                    ...prev,
                    items: prev.items.map((i) =>
                        i.id === itemId ? { ...i, quantity } : i
                    ),
                }
            })
            await api.patch(`/cart/${itemId}`, { quantity })
        } catch (err) {
            console.error('[CartContext] updateQty failed:', err)
            refreshCart() // revert on error
            throw err
        }
    }, [refreshCart])

    const removeItem = useCallback(async (itemId: string) => {
        try {
            // Optimistic update
            setCart((prev) =>
                prev ? { ...prev, items: prev.items.filter((i) => i.id !== itemId) } : prev
            )
            await api.delete(`/cart/${itemId}`)
        } catch (err) {
            console.error('[CartContext] removeItem failed:', err)
            refreshCart() // revert on error
            throw err
        }
    }, [refreshCart])

    const itemCount =
        cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0

    return (
        <CartContext.Provider
            value={{ cart, itemCount, loading, addToCart, updateQty, removeItem, refreshCart }}
        >
            {children}
        </CartContext.Provider>
    )
}

// ── Hook ─────────────────────────────────────────────────────────

export function useCart(): CartContextValue {
    return useContext(CartContext)
}
