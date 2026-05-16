
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  HiArrowLeft, HiOutlineHome, HiOutlinePlus,
  HiOutlinePhone, HiOutlineTag, HiX, HiChevronDown, HiChevronUp,
} from "react-icons/hi";
import { getCart } from "../../services/cartServices";
import { getAddresses } from "../../services/addressServices";
import { getLoggedUserData } from "../../services/authServices";
import { createOrder } from "../../services/orderServices";
import { applyCoupon, removeCoupon } from "../../services/couponServices";

const egyptianPhone = /^(010|011|012|015)\d{8}$/;

const AVAILABLE_COUPONS = [
  { code: "SAVE10",      desc: "10% off your order" },
  { code: "SAVE20",      desc: "20% off your order" },
  { code: "SAVE30",      desc: "30% off your order" },
  { code: "SAVE50",      desc: "50% off your order" },
  { code: "WELCOME15",   desc: "15% welcome discount" },
  { code: "PETS25",      desc: "25% off pet products" },
  { code: "OFF50",       desc: "50 EGP off" },
  { code: "OFF100",      desc: "100 EGP off" },
  { code: "OFF200",      desc: "200 EGP off" },
  { code: "OFF500",      desc: "500 EGP off" },
  { code: "MYPETSSTORE", desc: "Special store discount" },
];

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

// ── reusable dark-aware card wrapper ──────────────────────────────
const Card = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-[#1e1a2e] rounded-2xl shadow-sm border border-gray-100 dark:border-purple-900/30 p-5 ${className}`}>
    {children}
  </div>
);

export default function Checkout() {
  const [cart, setCart]                           = useState(null);
  const [addresses, setAddresses]                 = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [paymentMethod, setPaymentMethod]         = useState("cash");
  const [phone, setPhone]                         = useState("");
  const [phoneError, setPhoneError]               = useState("");
  const [loading, setLoading]                     = useState(true);
  const [submitting, setSubmitting]               = useState(false);
  const [showCoupons, setShowCoupons]             = useState(false);
  const [couponCode, setCouponCode]               = useState("");
  const [couponLoading, setCouponLoading]         = useState(false);
  const [appliedCoupon, setAppliedCoupon]         = useState(null);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res  = await getCart();
      const data = res.data?.data ?? res.data?.cart ?? res.data;
      setCart(data);
      if (data?.couponCode && !appliedCoupon) {
        setAppliedCoupon({
          couponCode:      data.couponCode,
          discountAmount:  data.discountAmount  ?? 0,
          discountedPrice: data.discountedPrice ?? data.totalPrice,
        });
      }
    } catch { errorToast("Failed to load cart"); }
  };

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) { navigate("/login"); return; }

    Promise.all([getCart(), getAddresses(), getLoggedUserData()])
      .then(([cartRes, addrRes, userRes]) => {
        const cartData = cartRes.data?.data ?? cartRes.data?.cart ?? cartRes.data;
        setCart(cartData);
        if (cartData?.couponCode) {
          setAppliedCoupon({
            couponCode:      cartData.couponCode,
            discountAmount:  cartData.discountAmount  ?? 0,
            discountedPrice: cartData.discountedPrice ?? cartData.totalPrice,
          });
        }
        const addrData =
          addrRes.data?.data?.addresses ??
          addrRes.data?.data ??
          addrRes.data?.addresses ??
          addrRes.data ?? [];
        const arr = Array.isArray(addrData) ? addrData : [];
        setAddresses(arr);
        const def = arr.find((a) => a.isDefault);
        if (def) setSelectedAddressId(def._id);
        else if (arr.length > 0) setSelectedAddressId(arr[0]._id);
        const user = userRes.data?.user ?? userRes.data?.data ?? userRes.data;
        if (user?.phone) setPhone(user.phone);
      })
      .catch(() => errorToast("Failed to load checkout data"))
      .finally(() => setLoading(false));
  }, []);

  // ── Coupon ────────────────────────────────────────────────────────
  const handleApplyCoupon = async (code) => {
    const codeToApply = (code || couponCode).trim().toUpperCase();
    if (!codeToApply) { errorToast("Please enter a coupon code"); return; }
    setCouponLoading(true);
    try {
      const res  = await applyCoupon(codeToApply);
      const data = res.data?.data ?? res.data;
      setAppliedCoupon(data);
      setCouponCode("");
      setShowCoupons(false);
      await fetchCart();
      successToast(`Coupon "${data.couponCode}" applied! You saved ${data.discountAmount} EGP `);
    } catch (err) { errorToast(err.response?.data?.message || "Invalid or expired coupon code"); }
    finally { setCouponLoading(false); }
  };

  const handleRemoveCoupon = async () => {
    setCouponLoading(true);
    try {
      await removeCoupon();
      setAppliedCoupon(null);
      await fetchCart();
      successToast("Coupon removed");
    } catch (err) { errorToast(err.response?.data?.message || "Failed to remove coupon"); }
    finally { setCouponLoading(false); }
  };

  // ── Pricing ───────────────────────────────────────────────────────
  const items          = cart?.products   ?? [];
  const totalPrice     = cart?.totalPrice ?? 0;
  const discountAmount = appliedCoupon?.discountAmount  ?? 0;
  const finalPrice     = appliedCoupon?.discountedPrice ?? totalPrice;
  const selectedAddr   = addresses.find((a) => a._id === selectedAddressId);

  // ── Place order ───────────────────────────────────────────────────
  const handlePlaceOrder = async () => {
    if (!selectedAddr) { errorToast("Please select a delivery address"); return; }
    if (!phone.trim()) { setPhoneError("Phone number is required"); return; }
    if (!egyptianPhone.test(phone.trim())) {
      setPhoneError("Enter a valid Egyptian number (010/011/012/015 + 8 digits)");
      return;
    }
    if (items.length === 0) { errorToast("Your cart is empty"); return; }
    setPhoneError("");
    setSubmitting(true);
    try {
      const payload = {
        address: `${selectedAddr.details}, ${selectedAddr.city}`,
        phone: phone.trim(),
        paymentMethod,
      };
      const res = await createOrder(payload);
      if (paymentMethod === "card") {
        const stripeUrl = res.data?.data?.url ?? res.data?.url ?? res.data?.session?.url ?? null;
        if (stripeUrl) { window.location.href = stripeUrl; return; }
        errorToast("Failed to get payment link. Please try again.");
        setSubmitting(false);
        return;
      }
      successToast("Order placed successfully! 🎉");
      navigate("/orders");
    } catch (err) {
      const errData = err.response?.data;
      errorToast(errData?.message || errData?.errors?.[0]?.message || errData?.errors?.[0] || "Failed to place order");
    } finally { setSubmitting(false); }
  };

  // ── Loading ───────────────────────────────────────────────────────
  if (loading)
    return (
      <div className="min-h-[calc(100vh-80px)] bg-gray-100 dark:bg-[#13111C] flex items-center justify-center pt-20 transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#6B21A8] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#6B21A8] font-semibold">Loading checkout...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-100 dark:bg-[#13111C] px-4 py-10 pt-32 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">

        {/* ── Page header ── */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e1a2e] hover:border-purple-400 hover:text-purple-500 dark:text-gray-300 transition"
          >
            <HiArrowLeft className="text-lg" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Checkout</h1>
            <p className="text-sm text-gray-400 dark:text-gray-500">Complete your order</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* ══════════════ LEFT COLUMN ══════════════ */}
          <div className="flex-1 space-y-5">

            {/* ── Delivery Address ── */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-800 dark:text-white text-lg">Delivery Address</h2>
                <button
                  onClick={() => navigate("/address")}
                  className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 font-semibold hover:underline"
                >
                  <HiOutlinePlus /> Add New
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-400 dark:text-gray-500 text-sm mb-3">No addresses found</p>
                  <button
                    onClick={() => navigate("/address")}
                    className="px-5 py-2 bg-[#6B21A8] text-white font-semibold rounded-xl text-sm hover:bg-purple-800 transition"
                  >
                    Add Address
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <label
                      key={addr._id}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${
                        selectedAddressId === addr._id
                          ? "border-purple-400 bg-purple-50 dark:bg-purple-900/20"
                          : "border-gray-100 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700"
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={addr._id}
                        checked={selectedAddressId === addr._id}
                        onChange={() => setSelectedAddressId(addr._id)}
                        className="accent-purple-700 w-4 h-4"
                      />
                      <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                        <HiOutlineHome className="text-purple-600 dark:text-purple-400 text-lg" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-800 dark:text-white text-sm">{addr.city}</span>
                          {addr.isDefault && (
                            <span className="text-xs bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-semibold px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm truncate">{addr.details}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </Card>

            {/* ── Contact Phone ── */}
            <Card>
              <h2 className="font-bold text-gray-800 dark:text-white text-lg mb-4">Contact Phone</h2>
              <div className="relative">
                <HiOutlinePhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setPhoneError(""); }}
                  placeholder="01xxxxxxxxx"
                  className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition
                    bg-white dark:bg-[#2a2040] text-gray-800 dark:text-white
                    placeholder:text-gray-400 dark:placeholder:text-gray-500
                    ${phoneError
                      ? "border-red-300 dark:border-red-700 focus:border-red-400 bg-red-50 dark:bg-red-900/10"
                      : "border-gray-200 dark:border-gray-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/30"
                    }`}
                />
              </div>
              {phoneError && <p className="text-red-500 text-xs mt-2 font-medium">{phoneError}</p>}
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
                Egyptian numbers only: 010, 011, 012, or 015
              </p>
            </Card>

            {/* ── Coupon Code ── */}
            <Card>
              <h2 className="font-bold text-gray-800 dark:text-white text-lg mb-4 flex items-center gap-2">
                <HiOutlineTag className="text-purple-600 dark:text-purple-400" /> Coupon Code
              </h2>

              {appliedCoupon ? (
                /* Applied state */
                <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-xl">🎉</div>
                      <div>
                        <p className="font-black text-green-700 dark:text-green-400 text-base tracking-widest">
                          {appliedCoupon.couponCode}
                        </p>
                        <p className="text-green-600 dark:text-green-500 text-xs font-semibold mt-0.5">
                          You're saving {appliedCoupon.discountAmount?.toLocaleString()} EGP
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      disabled={couponLoading}
                      className="p-2 rounded-xl border border-red-100 dark:border-red-900/50 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 transition disabled:opacity-50"
                    >
                      <HiX size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Input row */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <HiOutlineTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                        placeholder="Enter coupon code..."
                        className="w-full pl-9 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-bold tracking-widest focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/30 uppercase bg-white dark:bg-[#2a2040] text-gray-800 dark:text-white placeholder:font-normal placeholder:tracking-normal placeholder:text-gray-300 dark:placeholder:text-gray-500 transition"
                      />
                    </div>
                    <button
                      onClick={() => handleApplyCoupon()}
                      disabled={couponLoading || !couponCode.trim()}
                      className="px-5 py-3 bg-[#6B21A8] text-white font-semibold rounded-xl hover:bg-purple-800 transition disabled:opacity-50 text-sm whitespace-nowrap"
                    >
                      {couponLoading ? "..." : "Apply"}
                    </button>
                  </div>

                  {/* Toggle */}
                  <button
                    onClick={() => setShowCoupons(!showCoupons)}
                    className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-sm font-semibold hover:text-purple-800 dark:hover:text-purple-300 transition"
                  >
                    {showCoupons ? <HiChevronUp /> : <HiChevronDown />}
                    {showCoupons ? "Hide available coupons" : "🏷️ View available coupons"}
                  </button>

                  {/* Coupon grid */}
                  {showCoupons && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {AVAILABLE_COUPONS.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => handleApplyCoupon(c.code)}
                          disabled={couponLoading}
                          className="flex items-center justify-between bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 border border-purple-100 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-600 rounded-xl px-3 py-2.5 transition disabled:opacity-50 text-left"
                        >
                          <div>
                            <p className="font-black text-purple-700 dark:text-purple-400 text-xs tracking-wider">{c.code}</p>
                            <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">{c.desc}</p>
                          </div>
                          <span className="text-xs bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-300 font-bold px-2 py-0.5 rounded-full shrink-0 ml-2">
                            Use
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* ── Payment Method ── */}
            <Card>
              <h2 className="font-bold text-gray-800 dark:text-white text-lg mb-4">Payment Method</h2>
              <div className="grid grid-cols-2 gap-3">

                {/* Cash */}
                <label className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${
                  paymentMethod === "cash"
                    ? "border-purple-400 bg-purple-50 dark:bg-purple-900/20"
                    : "border-gray-100 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-700"
                }`}>
                  <input type="radio" name="payment" value="cash"
                    checked={paymentMethod === "cash"} onChange={() => setPaymentMethod("cash")} className="hidden" />
                  <span className="text-3xl">💵</span>
                  <div className="text-center">
                    <p className="font-bold text-gray-800 dark:text-white text-sm">Cash on Delivery</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Pay when you receive</p>
                  </div>
                  {paymentMethod === "cash" && (
                    <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </label>

                {/* Card */}
                <label className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${
                  paymentMethod === "card"
                    ? "border-purple-400 bg-purple-50 dark:bg-purple-900/20"
                    : "border-gray-100 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-700"
                }`}>
                  <input type="radio" name="payment" value="card"
                    checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} className="hidden" />
                  <span className="text-3xl">💳</span>
                  <div className="text-center">
                    <p className="font-bold text-gray-800 dark:text-white text-sm">Credit / Debit Card</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Powered by Stripe</p>
                  </div>
                  {paymentMethod === "card" && (
                    <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </label>
              </div>
              {paymentMethod === "card" && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 text-center">
                  You'll be redirected to Stripe's secure payment page.
                </p>
              )}
            </Card>
          </div>

          {/* ══════════════ RIGHT COLUMN – Order Summary ══════════════ */}
          <div className="lg:w-80 shrink-0">
            <Card className="sticky top-24">
              <h2 className="font-bold text-gray-800 dark:text-white text-lg mb-4">Order Summary</h2>

              {/* Items list */}
              <div className="space-y-3 mb-4 max-h-52 overflow-y-auto pr-1">
                {items.map((item) => {
                  const product = item?.product;
                  if (!product?._id) return null;
                  return (
                    <div key={item._id} className="flex items-center gap-3">
                      <img
                        src={product.image?.secure_url ?? product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-xl shrink-0"
                        onError={(e) => { e.target.src = "https://placehold.co/48x48?text=?"; }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 truncate">{product.name}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0">
                        {((item.price ?? product.price) * item.quantity).toLocaleString()} EGP
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Price breakdown */}
              <div className="border-t border-gray-100 dark:border-purple-900/30 pt-4 space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-200">{totalPrice.toLocaleString()} EGP</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="text-green-500 font-semibold">Free</span>
                </div>
                {appliedCoupon && discountAmount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400 font-semibold">
                    <span>Coupon ({appliedCoupon.couponCode})</span>
                    <span>− {discountAmount.toLocaleString()} EGP</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="border-t border-gray-100 dark:border-purple-900/30 pt-3 mt-3 flex justify-between font-bold text-gray-800 dark:text-white items-end">
                <span>Total</span>
                <div className="text-right">
                  {appliedCoupon && discountAmount > 0 && (
                    <p className="text-xs text-gray-400 line-through font-normal">{totalPrice.toLocaleString()} EGP</p>
                  )}
                  <span className="text-purple-700 dark:text-purple-400 text-xl">{finalPrice.toLocaleString()} EGP</span>
                </div>
              </div>

              {/* Delivery info */}
              {selectedAddr && (
                <div className="mt-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3 border border-purple-100 dark:border-purple-800">
                  <p className="text-xs font-semibold text-purple-700 dark:text-purple-400 mb-1">📍 Delivering to:</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">{selectedAddr.details}, {selectedAddr.city}</p>
                  {phone && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">📞 {phone}</p>}
                </div>
              )}

              {/* Place order btn */}
              <button
                onClick={handlePlaceOrder}
                disabled={submitting || items.length === 0 || !selectedAddressId}
                className="w-full mt-5 py-3 bg-[#6B21A8] text-white font-semibold rounded-xl hover:bg-purple-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Processing..." : paymentMethod === "card" ? "Pay with Card 💳" : "Place Order 🎉"}
              </button>

              <button
                onClick={() => navigate("/cart")}
                className="w-full mt-2 py-3 border-2 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 font-semibold rounded-xl hover:border-purple-400 hover:text-purple-600 dark:hover:border-purple-600 dark:hover:text-purple-400 transition text-sm"
              >
                Back to Cart
              </button>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}