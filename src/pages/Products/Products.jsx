
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllProducts, filterProducts } from "../../services/productsServices";
import { addToCart } from "../../services/cartServices";
import { addToWishlist } from "../../services/wishlistServices";
import { useCartWishlist } from "../../context/CartWishlistContext";
import { MdFavoriteBorder } from "react-icons/md";
import { CiShoppingCart } from "react-icons/ci";
import { HiOutlineSearch, HiOutlineFilter, HiX, HiChevronLeft, HiChevronRight } from "react-icons/hi";

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        const half = !filled && rating >= star - 0.5;
        return (
          <span key={star} className="relative text-gray-200 text-xl leading-none">
            ★
            {(filled || half) && (
              <span
                className="absolute inset-0 overflow-hidden text-yellow-400"
                style={{ width: filled ? "100%" : "50%" }}
              >★</span>
            )}
          </span>
        );
      })}
      <span className="text-xs text-gray-400 ml-1">({rating})</span>
    </div>
  );
}

const CATEGORIES = ["all", "cats", "dogs", "birds", "fish"];
const PAGE_SIZE_OPTIONS = [6, 12, 24];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState(""); // "price_asc" | "price_desc"
  const [filtered, setFiltered] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const { fetchCounts } = useCartWishlist();

  useEffect(() => {
    if (categoryParam) {
      setCategory(categoryParam);
      setFiltered(true);
      setCurrentPage(1);
      fetchFilter({ category: categoryParam });
    } else {
      fetchAll();
    }
  }, [categoryParam]);

  const fetchAll = () => {
    setLoading(true);
    getAllProducts()
      .then((res) => {
        const data = res.data;
        const arr = Array.isArray(data)
          ? data
          : data?.data ?? data?.products ?? [];
        setProducts(Array.isArray(arr) ? arr.filter((p) => p?._id) : []);
      })
      .catch(() => setError("Failed to load products."))
      .finally(() => setLoading(false));
  };

  const fetchFilter = (params) => {
    setLoading(true);
    filterProducts(params)
      .then((res) => {
        const data = res.data?.data;
        let arr = [];
        if (Array.isArray(data)) {
          arr = data;
        } else if (Array.isArray(data?.products)) {
          arr = data.products;
        } else if (Array.isArray(res.data)) {
          arr = res.data;
        }
        setProducts(arr.filter((p) => p?._id));
      })
      .catch(() => setError("Failed to filter products."))
      .finally(() => setLoading(false));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (category !== "all") params.category = category;
    if (search.trim()) params.name = search.trim();
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;

    setCurrentPage(1);

    if (Object.keys(params).length === 0) {
      setFiltered(false);
      fetchAll();
    } else {
      setFiltered(true);
      fetchFilter(params);
    }
  };

  const handleReset = () => {
    setSearch("");
    setCategory("all");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("");
    setFiltered(false);
    setCurrentPage(1);
    fetchAll();
  };

  const handleAddToCart = async (e, productId) => {
    e.stopPropagation();
    if (!productId) return;
    if (!localStorage.getItem("userToken")) { navigate("/login"); return; }
    try {
      await addToCart(productId, 1);
      await fetchCounts();
      toast.success("Added to cart 🛒", {
        style: { background: "#6B21A8", color: "#fff", fontWeight: "600", borderRadius: "12px" },
        progressStyle: { background: "#D8B4FE" },
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const handleAddToWishlist = async (e, productId) => {
    e.stopPropagation();
    if (!productId) return;
    if (!localStorage.getItem("userToken")) { navigate("/login"); return; }
    try {
      await addToWishlist(productId);
      await fetchCounts();
      toast.success("Added to wishlist 💜", {
        style: { background: "#6B21A8", color: "#fff", fontWeight: "600", borderRadius: "12px" },
        progressStyle: { background: "#D8B4FE" },
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to wishlist");
    }
  };

  // Sort products client-side
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "price_asc") return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    return 0;
  });

  // Pagination logic
  const totalProducts = sortedProducts.length;
  const totalPages = Math.ceil(totalProducts / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + pageSize);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page numbers array with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-purple border-t-transparent rounded-full animate-spin" />
          <p className="text-primary-purple font-semibold text-lg">Loading products...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <p className="text-red-500 font-semibold">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">

      {/* Header */}
      <div className="bg-primary-purple py-10 px-4 mb-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-1">All Products</h1>
          <p className="text-yellow-300 text-sm font-medium uppercase tracking-widest">
            Home › Products
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">

        {/* Filter Bar */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8 flex flex-col sm:flex-row gap-3 items-end flex-wrap"
        >
          {/* Search */}
          <div className="flex-1 min-w-[180px] flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Search</label>
            <div className="relative">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
              />
            </div>
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1 min-w-[140px]">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="py-2.5 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400 bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c === "all" ? "All Categories" : c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Min Price */}
          <div className="flex flex-col gap-1 w-28">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Min Price</label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0"
              min="0"
              className="py-2.5 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
            />
          </div>

          {/* Max Price */}
          <div className="flex flex-col gap-1 w-28">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Max Price</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="9999"
              min="0"
              className="py-2.5 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
            />
          </div>

          {/* Sort */}
          <div className="flex flex-col gap-1 min-w-[140px]">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Sort By Price</label>
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
              className="py-2.5 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400 bg-white"
            >
              <option value="">Default</option>
              <option value="price_asc">Lowest Price</option>
              <option value="price_desc">Highest Price</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#6B21A8] text-white font-semibold rounded-xl hover:bg-purple-800 transition text-sm"
            >
              <HiOutlineFilter /> Filter
            </button>
            {filtered && (
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2.5 border-2 border-gray-200 text-gray-500 font-semibold rounded-xl hover:border-purple-300 hover:text-purple-700 transition text-sm"
              >
                <HiX /> Reset
              </button>
            )}
          </div>
        </form>

        {/* Results info + page size */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <p className="text-sm text-gray-500 font-medium">
            Showing {startIndex + 1}–{Math.min(startIndex + pageSize, totalProducts)} of {totalProducts} product{totalProducts !== 1 ? "s" : ""}
          </p>
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Per page:</label>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="py-1.5 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400 bg-white"
            >
              {PAGE_SIZE_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {paginatedProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 font-semibold text-lg">No products found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
            <button
              onClick={handleReset}
              className="mt-5 px-6 py-2.5 bg-[#6B21A8] text-white font-semibold rounded-xl hover:bg-purple-800 transition text-sm"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProducts.map((product) => {
              if (!product?._id) return null;
              return (
                <div
                  key={product._id}
                  onClick={() => navigate(`/products/${product._id}`)}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden group cursor-pointer flex flex-col"
                >
                  <div className="relative overflow-hidden bg-gray-100" style={{ height: "280px" }}>
                    <img
                      src={product.image?.secure_url ?? product.image}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 p-2"
                      onError={(e) => { e.target.src = "https://placehold.co/300x280?text=No+Image"; }}
                    />
                    <span className="absolute top-3 left-3 bg-primary-purple text-white text-xs font-bold uppercase px-3 py-1 rounded-full">
                      {product.category}
                    </span>
                    <button
                      onClick={(e) => handleAddToWishlist(e, product._id)}
                      className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:scale-110 transition"
                    >
                      <MdFavoriteBorder className="text-lg text-gray-400 hover:text-red-500" />
                    </button>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h2 className="text-base font-bold text-gray-800 line-clamp-2 min-h-[48px]">
                      {product.name}
                    </h2>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2 flex-1">
                      {product.description}
                    </p>
                    <div className="mt-3">
                      <StarRating rating={product.rating} />
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-primary-purple font-bold text-xl">
                        {product.price} EGP
                      </span>
                      <span className="text-xs text-gray-400">
                        {product.weight?.value ?? product.weight} {product.weight?.unit ?? ""}
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleAddToCart(e, product._id)}
                      className="mt-4 w-full flex items-center justify-center gap-2 bg-primary-purple hover:bg-purple-800 text-white text-sm font-semibold py-3 rounded-xl transition-colors duration-300"
                    >
                      <CiShoppingCart className="text-lg" /> Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
            {/* Prev */}
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-purple-300 hover:text-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <HiChevronLeft className="text-lg" />
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((page, idx) => (
              page === "..." ? (
                <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 font-semibold">…</span>
              ) : (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-10 h-10 rounded-xl text-sm font-bold transition ${
                    currentPage === page
                      ? "bg-[#6B21A8] text-white shadow-md"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-700"
                  }`}
                >
                  {page}
                </button>
              )
            ))}

            {/* Next */}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-purple-300 hover:text-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <HiChevronRight className="text-lg" />
            </button>
          </div>
        )}

        {/* Page info */}
        {totalPages > 1 && (
          <p className="text-center text-sm text-gray-400 mt-3">
            Page {currentPage} of {totalPages}
          </p>
        )}
      </div>
    </div>
  );
}