
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { HiOutlineTrash, HiArrowLeft } from "react-icons/hi";
import { getWishlist, removeFromWishlist, clearWishlist } from "../../services/wishlistServices";
import { addToCart } from "../../services/cartServices";
import { useCartWishlist } from "../../context/CartWishlistContext";
import { CiShoppingCart } from "react-icons/ci";

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

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { fetchCounts } = useCartWishlist();

  const fetchWishlist = async () => {
    try {
      const res = await getWishlist();
      const wishlist = res.data?.data?.wishlist ?? res.data?.wishlist ?? res.data?.data ?? res.data ?? [];
      setItems(Array.isArray(wishlist) ? wishlist : []);
    } catch {
      errorToast("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWishlist(); }, []);

  // Try productId first, fallback to wishlistItemId
  const handleRemove = async (productId, wishlistItemId) => {
    try {
      await removeFromWishlist(productId);
      await fetchCounts();
      successToast("Removed from wishlist");
      fetchWishlist();
    } catch (err) {
      if (err.response?.status === 404 && wishlistItemId) {
        try {
          await removeFromWishlist(wishlistItemId);
          await fetchCounts();
          successToast("Removed from wishlist");
          fetchWishlist();
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
      await clearWishlist();
      await fetchCounts();
      successToast("Wishlist cleared");
      setItems([]);
    } catch (err) {
      errorToast(err.response?.data?.message || "Failed to clear wishlist");
    }
  };

  const handleMoveToCart = async (productId, wishlistItemId) => {
    if (!localStorage.getItem("userToken")) { navigate("/login"); return; }
    try {
      await addToCart(productId, 1);
      await handleRemove(productId, wishlistItemId);
      await fetchCounts();
      successToast("Moved to cart 🛒");
    } catch (err) {
      errorToast(err.response?.data?.message || "Failed to move to cart");
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-100 px-4 py-10 pt-40">
      <div className="max-w-4xl mx-auto">

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)}
              className="p-2 rounded-xl border border-gray-200 bg-white hover:border-purple-300 hover:text-purple-700 transition">
              <HiArrowLeft className="text-lg" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">My Wishlist</h1>
              <p className="text-sm text-gray-400">{items.length} item{items.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
          {items.length > 0 && (
            <button onClick={handleClear}
              className="flex items-center gap-2 px-4 py-2.5 border-2 border-red-100 bg-red-50 text-red-500 font-semibold rounded-xl hover:bg-red-500 hover:text-white transition text-sm">
              <HiOutlineTrash /> Clear All
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-white rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">💜</div>
            <p className="text-gray-500 font-medium">Your wishlist is empty</p>
            <p className="text-gray-400 text-sm mt-1">Save items you love to find them later</p>
            <button onClick={() => navigate("/products")}
              className="mt-5 px-6 py-2.5 bg-[#6B21A8] text-white font-semibold rounded-xl hover:bg-purple-800 transition text-sm">
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => {
              // Support both { product: {...} } and flat product object structures
              const product = item?.product ?? item;
              if (!product?._id) return null;
              // wishlistItemId = item._id if nested, else undefined
              const wishlistItemId = item?.product ? item._id : undefined;

              return (
                <div key={item._id ?? product._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-purple-100 transition-all group">
                  <div
                    className="relative h-48 bg-gray-50 cursor-pointer overflow-hidden"
                    onClick={() => navigate(`/products/${product._id}`)}>
                    <img
                      src={product.image?.secure_url ?? product.image}
                      alt={product.name}
                      className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { e.target.src = "https://placehold.co/300x200?text=No+Image"; }}
                    />
                    <span className="absolute top-2 left-2 bg-primary-purple text-white text-xs font-bold uppercase px-2 py-0.5 rounded-full">
                      {product.category}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3
                      className="font-bold text-gray-800 text-sm truncate cursor-pointer hover:text-purple-700 transition mb-1"
                      onClick={() => navigate(`/products/${product._id}`)}>
                      {product.name}
                    </h3>
                    <p className="text-purple-700 font-bold text-base mb-3">{product.price} EGP</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleMoveToCart(product._id, wishlistItemId ?? item._id)}
                        className="flex-1 flex items-center justify-center gap-1 py-2 bg-[#6B21A8] text-white text-xs font-semibold rounded-xl hover:bg-purple-800 transition">
                        <CiShoppingCart className="text-base" /> Move to Cart
                      </button>
                      <button
                        onClick={() => handleRemove(product._id, wishlistItemId ?? item._id)}
                        className="p-2 border border-red-100 text-red-400 rounded-xl hover:bg-red-50 hover:border-red-300 transition">
                        <HiOutlineTrash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}