'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  size: string;
  color: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, newQuantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Carga segura con validación de tipo array
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('rvrs_cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          setCart(parsed.filter((item) => item && item.id));
        }
      }
    } catch (e) {
      console.error('Error al cargar carrito:', e);
      localStorage.removeItem('rvrs_cart');
    }
  }, []);

  // Guardado seguro
  useEffect(() => {
    try {
      localStorage.setItem('rvrs_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Error al guardar carrito:', e);
    }
  }, [cart]);

 const addToCart = (newItem: CartItem) => {
    setCart((prevCart) => {
      const validCart = Array.isArray(prevCart) ? prevCart : [];
      
      // Buscamos si ya existe el producto con la EXACTA MISMA talla y color
      const existingIndex = validCart.findIndex(
        (item) => item?.id === newItem.id && item?.size === newItem.size && item?.color === newItem.color
      );

      if (existingIndex > -1) {
        // Si ya existe esa misma talla, solo sumamos la cantidad
        return validCart.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      
      // Si es una talla nueva, se añade como una línea independiente en el carrito
      return [...validCart, newItem];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => (Array.isArray(prevCart) ? prevCart.filter((item) => item?.id !== id) : []));
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prevCart) =>
      Array.isArray(prevCart)
        ? prevCart.map((item) => (item?.id === id ? { ...item, quantity: newQuantity } : item))
        : []
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('rvrs_cart');
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};