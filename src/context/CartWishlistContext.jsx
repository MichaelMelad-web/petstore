import { createContext, useContext, useEffect, useState } from "react";
import { getCart } from "../services/cartServices";
import { getWishlist } from "../services/wishlistServices";

const CartWishlistContext = createContext();

export function CartWishlistProvider({ children }) {
  const [cartCount,     setCartCount]     = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const fetchCounts = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) { setCartCount(0); setWishlistCount(0); return; }
    try {
      const [cartRes, wishRes] = await Promise.all([getCart(), getWishlist()]);

      // Cart: products array
      const cartProducts = cartRes.data?.data?.products ?? cartRes.data?.cart?.products ?? [];
      setCartCount(Array.isArray(cartProducts) ? cartProducts.length : 0);

      // Wishlist: res.data.data.wishlist
      const wishItems = wishRes.data?.data?.wishlist ?? wishRes.data?.wishlist ?? [];
      setWishlistCount(Array.isArray(wishItems) ? wishItems.length : 0);
    } catch {
      setCartCount(0);
      setWishlistCount(0);
    }
  };

  useEffect(() => { fetchCounts(); }, []);

  return (
    <CartWishlistContext.Provider value={{ cartCount, wishlistCount, fetchCounts }}>
      {children}
    </CartWishlistContext.Provider>
  );
}

export const useCartWishlist = () => useContext(CartWishlistContext);