import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "aone_cart_v1";

function loadInitialCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function reducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const { product, quantity = 1 } = action.payload;
      const existing = state.find((i) => i.productId === product.id);
      if (existing) {
        return state.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...state,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity,
        },
      ];
    }
    case "INCREMENT":
      return state.map((i) =>
        i.productId === action.payload ? { ...i, quantity: i.quantity + 1 } : i
      );
    case "DECREMENT":
      return state
        .map((i) =>
          i.productId === action.payload ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0);
    case "REMOVE":
      return state.filter((i) => i.productId !== action.payload);
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, undefined, loadInitialCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo(() => {
    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    return {
      items,
      itemCount,
      subtotal,
      addItem: (product, quantity) => dispatch({ type: "ADD", payload: { product, quantity } }),
      increment: (productId) => dispatch({ type: "INCREMENT", payload: productId }),
      decrement: (productId) => dispatch({ type: "DECREMENT", payload: productId }),
      removeItem: (productId) => dispatch({ type: "REMOVE", payload: productId }),
      clearCart: () => dispatch({ type: "CLEAR" }),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}