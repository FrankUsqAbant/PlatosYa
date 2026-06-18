// ==========================================================================
// PlatoYa - Contexto del Carrito de Compras
// Maneja items, cantidades, persistencia en localStorage
// ==========================================================================

'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar carrito desde localStorage al montar
  useEffect(() => {
    try {
      const saved = localStorage.getItem('platoya_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Solo cargar si es un array válido con items
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
        } else {
          localStorage.removeItem('platoya_cart');
        }
      }
    } catch {
      localStorage.removeItem('platoya_cart');
    }
    setIsLoaded(true);
  }, []);

  // Guardar en localStorage cada vez que cambian los items
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('platoya_cart', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  // Agregar plato al carrito (incrementa si ya existe)
  const addItem = useCallback((plato) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.plato._id === plato._id);
      if (existing) {
        return prev.map((item) =>
          item.plato._id === plato._id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prev, { plato, cantidad: 1 }];
    });
  }, []);

  // Eliminar un plato del carrito
  const removeItem = useCallback((platoId) => {
    setItems((prev) => prev.filter((item) => item.plato._id !== platoId));
  }, []);

  // Actualizar la cantidad de un plato (elimina si cantidad <= 0)
  const updateQuantity = useCallback((platoId, cantidad) => {
    if (cantidad <= 0) {
      setItems((prev) => prev.filter((item) => item.plato._id !== platoId));
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.plato._id === platoId ? { ...item, cantidad } : item
      )
    );
  }, []);

  // Vaciar todo el carrito
  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem('platoya_cart');
  }, []);

  // Cantidad total de items
  const cartCount = useMemo(
    () => items.reduce((sum, item) => sum + item.cantidad, 0),
    [items]
  );

  // Precio total del carrito
  const cartTotal = useMemo(
    () => items.reduce((sum, item) => sum + item.plato.precio * item.cantidad, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal,
      isLoaded,
    }),
    [items, addItem, removeItem, updateQuantity, clearCart, cartCount, cartTotal, isLoaded]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Hook personalizado para usar el contexto del carrito
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
}
