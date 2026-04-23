
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getProductById, getAllProducts } from "../../services/productsServices";
import { addToCart } from "../../services/cartServices";
import { addToWishlist } from "../../services/wishlistServices";
import { useCartWishlist } from "../../context/CartWishlistContext";
import { HiArrowLeft } from "react-icons/hi";
import { CiShoppingCart } from "react-icons/ci";
import { MdFavoriteBorder } from "react-icons/md";
import Reviews from "../Reviews/Reviews";


function StarRating({ rating, size = "text-2xl" }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        const half = !filled && rating >= star - 0.5;
        return (
          <span key={star} className={`relative text-gray-200 ${size} leading-none`}>
            ★
            {(filled || half) && (
              <span className="absolute inset-0 overflow-hidden text-yellow-400"
                style={{ width: filled ? "100%" : "50%" }}>★</span>
            )}
          </span>
        );
      })}
      <span className="text-sm text-gray-400 ml-2">{rating} out of 5</span>
    </div>
  );
}

function RelatedCard({ product, onClick }) {
  if (!product?._id) return null;
  const weightDisplay = typeof product.weight === "object"
    ? `${product.weight.value} ${product.weight.unit}`
    : product.weight;

  return (
    <div onClick={onClick} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group cursor-pointer flex flex-col">
      <div className="relative bg-gray-50 overflow-hidden" style={{ height: "180px" }}>
        <img
          src={product.image?.secure_url ?? product.image}
          alt={product.name}
          className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute top-2 left-2 bg-primary-purple text-white text-xs font-bold uppercase px-2 py-0.5 rounded-full">
          {product.category}
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-bold text-gray-800 line-clamp-2 min-h-[40px]">{product.name}</h3>
        <div className="mt-2 flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => {
            const filled = product.rating >= star;
            const half = !filled && product.rating >= star - 0.5;
            return (
              <span key={star} className="relative text-gray-200 text-base leading-none">
                ★
                {(filled || half) && (
                  <span className="absolute inset-0 overflow-hidden text-yellow-400"
                    style={{ width: filled ? "100%" : "50%" }}>★</span>
                )}
              </span>
            );
          })}
          <span className="text-xs text-gray-400 ml-1">({product.rating})</span>
        </div>
        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="text-primary-purple font-bold text-base">{product.price} EGP</span>
          <span className="text-xs text-gray-400">{weightDisplay}</span>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fetchCounts } = useCartWishlist();

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    setProduct(null);
    setRelated([]);
    window.scrollTo(0, 0);

    getProductById(productId)
      .then((res) => {
        const prod = res.data?.data ?? res.data;
        if (!prod?._id) throw new Error("Product not found");
        setProduct(prod);

        return getAllProducts().then((allRes) => {
          const all = allRes.data?.data ?? allRes.data?.products ?? allRes.data ?? [];
          const arr = Array.isArray(all) ? all : [];
          setRelated(
            arr
              .filter((p) => p?._id && p.category === prod.category && p._id !== prod._id)
              .slice(0, 4)
          );
        });
      })
      .catch(() => setError("Product not found."))
      .finally(() => setLoading(false));
  }, [productId]);

  const handleAddToCart = async () => {
    if (!localStorage.getItem("userToken")) { navigate("/login"); return; }
    try {
      await addToCart(product._id, 1);
      await fetchCounts();
      toast.success("Added to cart 🛒", {
        style: { background: "#6B21A8", color: "#fff", fontWeight: "600", borderRadius: "12px" },
        progressStyle: { background: "#D8B4FE" },
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const handleAddToWishlist = async () => {
    if (!localStorage.getItem("userToken")) { navigate("/login"); return; }
    try {
      await addToWishlist(product._id);
      await fetchCounts();
      toast.success("Added to wishlist 💜", {
        style: { background: "#6B21A8", color: "#fff", fontWeight: "600", borderRadius: "12px" },
        progressStyle: { background: "#D8B4FE" },
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to wishlist");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-purple border-t-transparent rounded-full animate-spin" />
          <p className="text-primary-purple font-semibold text-lg">Loading product...</p>
        </div>
      </div>
    );

  if (error || !product)
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-red-500 font-semibold text-lg mb-4">{error}</p>
          <button onClick={() => navigate("/products")}
            className="bg-primary-purple text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-800 transition">
            Back to Products
          </button>
        </div>
      </div>
    );

  const weightDisplay = typeof product.weight === "object"
    ? `${product.weight.value} ${product.weight.unit}`
    : product.weight;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">

      <div className="bg-primary-purple py-8 px-4 mb-10">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-white hover:text-yellow-300 transition">
            <HiArrowLeft className="text-2xl" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">{product.name}</h1>
            <p className="text-yellow-300 text-xs font-medium uppercase tracking-widest mt-0.5">
              Home › Products › {product.category} › {product.name}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/2 bg-gray-50 flex items-center justify-center p-10 min-h-[420px]">
              <img
                src={product.image?.secure_url ?? product.image}
                alt={product.name}
                className="max-h-96 w-full object-contain"
              />
            </div>
            <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-between">
              <div>
                <span className="inline-block bg-primary-purple text-white text-xs font-bold uppercase px-4 py-1.5 rounded-full mb-4">
                  {product.category}
                </span>
                <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-800 leading-tight mb-3">
                  {product.name}
                </h2>
                <div className="mb-4"><StarRating rating={product.rating} /></div>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{product.description}</p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Weight</p>
                    <p className="text-gray-800 font-bold">{weightDisplay}</p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Category</p>
                    <p className="text-gray-800 font-bold capitalize">{product.category}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-primary-purple mb-6">
                  {product.price} <span className="text-lg font-semibold">EGP</span>
                </p>
                <div className="flex gap-3">
                  <button onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-2 bg-primary-purple hover:bg-purple-800 text-white font-semibold py-4 rounded-2xl transition-colors duration-300 text-sm">
                    <CiShoppingCart className="text-xl" /> Add to Cart
                  </button>
                  <button onClick={handleAddToWishlist}
                    className="w-14 h-14 flex items-center justify-center border-2 border-gray-200 rounded-2xl hover:border-primary-purple hover:text-primary-purple transition-colors duration-300 text-gray-400">
                    <MdFavoriteBorder className="text-2xl" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-7 bg-primary-purple rounded-full" />
              <h2 className="text-2xl font-extrabold text-gray-800">Related Products</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((rel) => (
                <RelatedCard
                  key={rel._id}
                  product={rel}
                  onClick={() => navigate(`/products/${rel._id}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <Reviews productId={productId} />
      </div>
    </div>
  );
}