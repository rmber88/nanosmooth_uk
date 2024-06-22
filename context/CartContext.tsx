import React, { createContext, useContext, useEffect, useState } from 'react';

interface CartItem {
  id: string;
  image: string;
  name: string;
  pricePerItem: number;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  removeFromCart: (id: string) => void;
  totalPrice: number;
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  increaseQuantity: () => {},
  decreaseQuantity: () => {},
  removeFromCart: () => {},
  totalPrice: 0,
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const addToCart = (item: CartItem) => {
    const existingItemIndex = cartItems.findIndex((cartItem) => cartItem.id === item.id);

    if (existingItemIndex !== -1) {
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += item.quantity;
      updatedCartItems[existingItemIndex].pricePerItem += item.pricePerItem;
      setCartItems(updatedCartItems);
    } else {
      setCartItems([...cartItems, item]);
    }
  };

  const increaseQuantity = (id: string) => {
    setCartItems(
      cartItems.map((cartItem) =>
        cartItem.id === id ? { ...cartItem, quantity: cartItem.quantity + 1, pricePerItem: cartItem.pricePerItem + cartItem.pricePerItem } : cartItem
      )
    );
  };

  const decreaseQuantity = (id: string) => {
    setCartItems(
      cartItems.map((cartItem) =>
        cartItem.id === id && cartItem.quantity > 1
          ? {
              ...cartItem,
              quantity: cartItem.quantity - 1,
              totalPrice: (cartItem.quantity - 1) * cartItem.pricePerItem,
            }
          : cartItem
      )
    );
  };
  
  

  const removeFromCart = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  useEffect(() => {
    const totalPrice = cartItems.reduce((acc, item) => acc + item.pricePerItem, 0);
    setTotalPrice(totalPrice);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, increaseQuantity, decreaseQuantity, removeFromCart, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};
