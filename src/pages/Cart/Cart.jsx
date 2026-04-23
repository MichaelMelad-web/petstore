
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { HiOutlineTrash, HiArrowLeft } from "react-icons/hi";
import { getCart, updateCartQuantity, removeFromCart, clearCart } from "../../services/cartServices";
import { useCartWishlist } from "../../context/CartWishlistContext";

const successToast = (msg) =>
  toast.success(msg, {
    style: { background: "#6B21A8", color: "#fff", fontWeight: "600", borderRadius: "12px" },
    progressStyle: { background: "#D8B4FE" },
  });

const errorToast = (msg) =>
  toast.error(msg, {
    style: { background: "#FEF2F2", color: "#B91C1C", fontWeight: "600", borderRadius: "12px", border: "1px solid #FECACA" },
    progressStyle: { background: "#F87171" },
    icon: "❌",
  });

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { fetchCounts } = useCartWishlist();

  const fetchCart = async () => {
    try {
      const res = await getCart();
      setCart(res.data?.data ?? res.data?.cart ?? res.data);
    } catch {
      errorToast("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  // If quantity drops to 0, remove the item
  const handleUpdateQty = async (productId, itemId, quantity) => {
    if (quantity <= 0) {
      await handleRemove(productId, itemId);
      return;
    }
    try {
      await updateCartQuantity(productId, quantity);
      await fetchCart();
      await fetchCounts();
    } catch (err) {
      errorToast(err.response?.data?.message || "Failed to update quantity");
    }
  };

  // Try productId first (most APIs use this), fallback to itemId
  const handleRemove = async (productId, itemId) => {
    try {
      await removeFromCart(productId);
      await fetchCounts();
      successToast("Item removed from cart");
      await fetchCart();
    } catch (err) {
      if (err.response?.status === 404 && itemId) {
        // Fallback: try with itemId
        try {
          await removeFromCart(itemId);
          await fetchCounts();
          successToast("Item removed from cart");
          await fetchCart();
        } catch {
          errorToast("Failed to remove item");
        }
      } else {
        errorToast(err.response?.data?.message || "Failed to remove item");
      }
    }
  };

  const handleClear = async () => {
    try {
      await clearCart();
      await fetchCounts();
      successToast("Cart cleared");
      setCart(null);
    } catch (err) {
      errorToast(err.response?.data?.message || "Failed to clear cart");
    }
  };

  const items = cart?.products ?? [];
  const totalPrice = cart?.totalPrice ?? 0;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-100 px-4 py-10 pt-40">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)}
              className="p-2 rounded-xl border border-gray-200 bg-white hover:border-purple-300 hover:text-purple-700 transition">
              <HiArrowLeft className="text-lg" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">My Cart</h1>
              <p className="text-sm text-gray-400">{items.length} item{items.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
          {items.length > 0 && (
            <button onClick={handleClear}
              className="flex items-center gap-2 px-4 py-2.5 border-2 border-red-100 bg-red-50 text-red-500 font-semibold rounded-xl hover:bg-red-500 hover:text-white transition text-sm">
              <HiOutlineTrash /> Clear Cart
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-28 bg-white rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🛒</div>
            <p className="text-gray-500 font-medium">Your cart is empty</p>
            <button onClick={() => navigate("/products")}
              className="mt-5 px-6 py-2.5 bg-[#6B21A8] text-white font-semibold rounded-xl hover:bg-purple-800 transition text-sm">
              Browse Products
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">

            <div className="flex-1 space-y-3">
              {items.map((item) => {
                const product = item?.product;
                if (!product?._id) return null;
                return (
                  <div key={item._id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-4 items-center hover:shadow-md transition-all">
                    <img
                      src={product.image?.secure_url ?? product.image}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-xl cursor-pointer shrink-0"
                      onClick={() => navigate(`/products/${product._id}`)}
                      onError={(e) => { e.target.src = "https://placehold.co/80x80?text=No+Image"; }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-bold text-gray-800 text-sm truncate cursor-pointer hover:text-purple-700 transition"
                        onClick={() => navigate(`/products/${product._id}`)}>
                        {product.name}
                      </h3>
                      <p className="text-purple-700 font-bold text-sm mt-0.5">
                        {item.price ?? product.price} EGP
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleUpdateQty(product._id, item._id, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center font-bold text-gray-500 hover:border-purple-300 hover:text-purple-700 transition"
                          title={item.quantity === 1 ? "Remove item" : "Decrease quantity"}
                        >−</button>
                        <span className="text-sm font-bold text-gray-700 w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQty(product._id, item._id, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center font-bold text-gray-500 hover:border-purple-300 hover:text-purple-700 transition"
                        >+</button>
                        {item.quantity === 1 && (
                          <span className="text-xs text-gray-400 ml-1">(tap − to remove)</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <p className="font-bold text-gray-800 text-sm">
                        {((item.price ?? product.price) * item.quantity).toLocaleString()} EGP
                      </p>
                      <button
                        onClick={() => handleRemove(product._id, item._id)}
                        className="p-2 border border-red-100 text-red-400 rounded-xl hover:bg-red-50 hover:border-red-300 transition"
                      >
                        <HiOutlineTrash size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="lg:w-72 shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-24">
                <h2 className="font-bold text-gray-800 text-lg mb-4">Order Summary</h2>
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-semibold text-gray-700">{totalPrice.toLocaleString()} EGP</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>Delivery</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
                <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between font-bold text-gray-800">
                  <span>Total</span>
                  <span className="text-purple-700">{totalPrice.toLocaleString()} EGP</span>
                </div>
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full mt-5 py-3 bg-[#6B21A8] text-white font-semibold rounded-xl hover:bg-purple-800 transition">
                  Proceed to Checkout
                </button>
                <button
                  onClick={() => navigate("/products")}
                  className="w-full mt-2 py-3 border-2 border-gray-200 text-gray-500 font-semibold rounded-xl hover:border-purple-300 hover:text-purple-700 transition text-sm">
                  Continue Shopping
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}