
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { HiArrowLeft, HiOutlineHome, HiOutlinePlus, HiOutlinePhone } from "react-icons/hi";
import { getCart } from "../../services/cartServices";
import { getAddresses } from "../../services/addressServices";
import { getLoggedUserData } from "../../services/authServices";
import { createOrder } from "../../services/orderServices";

const egyptianPhone = /^(010|011|012|015)\d{8}$/;

const successToast = (msg) =>
  toast.success(msg, {
    style: { background: "#6B21A8", color: "#fff", fontWeight: "600", borderRadius: "12px" },
    progressStyle: { background: "#D8B4FE" },
  });

const errorToast = (msg) =>
  toast.error(msg, {
    style: {
      background: "#FEF2F2", color: "#B91C1C", fontWeight: "600",
      borderRadius: "12px", border: "1px solid #FECACA",
    },
    progressStyle: { background: "#F87171" },
    icon: "❌",
  });

export default function Checkout() {
  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) { navigate("/login"); return; }

    Promise.all([getCart(), getAddresses(), getLoggedUserData()])
      .then(([cartRes, addrRes, userRes]) => {
        // Cart
        setCart(cartRes.data?.data ?? cartRes.data?.cart ?? cartRes.data);

        // Addresses
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

        // Pre-fill phone from user profile
        const user = userRes.data?.user ?? userRes.data?.data ?? userRes.data;
        if (user?.phone) setPhone(user.phone);
      })
      .catch(() => errorToast("Failed to load checkout data"))
      .finally(() => setLoading(false));
  }, []);

  const items = cart?.products ?? [];
  const totalPrice = cart?.totalPrice ?? 0;
  const selectedAddr = addresses.find((a) => a._id === selectedAddressId);

  const handlePlaceOrder = async () => {
    // Validate address
    if (!selectedAddr) {
      errorToast("Please select a delivery address");
      return;
    }
    // Validate phone
    if (!phone.trim()) {
      setPhoneError("Phone number is required");
      return;
    }
    if (!egyptianPhone.test(phone.trim())) {
      setPhoneError("Enter a valid Egyptian number (010/011/012/015 + 8 digits)");
      return;
    }
    if (items.length === 0) {
      errorToast("Your cart is empty");
      return;
    }

    setPhoneError("");
    setSubmitting(true);

    try {
      // Build address string as the API expects: "details, city"
      const addressString = `${selectedAddr.details}, ${selectedAddr.city}`;

      const payload = {
        address: addressString,
        phone: phone.trim(),
        paymentMethod,
      };

      const res = await createOrder(payload);

      // Card payment → redirect to Stripe
      if (paymentMethod === "card") {
        const stripeUrl =
          res.data?.data?.url ??
          res.data?.url ??
          res.data?.session?.url ??
          null;

        if (stripeUrl) {
          window.location.href = stripeUrl;
          return;
        }
        errorToast("Failed to get payment link. Please try again.");
        setSubmitting(false);
        return;
      }

      // Cash payment success
      successToast("Order placed successfully! 🎉");
      navigate("/orders");

    } catch (err) {
      console.error("Order error:", err.response?.data);
      const errData = err.response?.data;
      const msg =
        errData?.message ||
        errData?.errors?.[0]?.message ||
        errData?.errors?.[0] ||
        "Failed to place order";
      errorToast(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-[calc(100vh-80px)] bg-gray-100 flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-purple border-t-transparent rounded-full animate-spin" />
          <p className="text-primary-purple font-semibold">Loading checkout...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-100 px-4 py-10 pt-40">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)}
            className="p-2 rounded-xl border border-gray-200 bg-white hover:border-purple-300 hover:text-purple-700 transition">
            <HiArrowLeft className="text-lg" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
            <p className="text-sm text-gray-400">Complete your order</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Left column ── */}
          <div className="flex-1 space-y-5">

            {/* Delivery Address */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-800 text-lg">Delivery Address</h2>
                <button onClick={() => navigate("/address")}
                  className="flex items-center gap-1 text-xs text-purple-700 font-semibold hover:underline">
                  <HiOutlinePlus /> Add New
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-400 text-sm mb-3">No addresses found</p>
                  <button onClick={() => navigate("/address")}
                    className="px-5 py-2 bg-[#6B21A8] text-white font-semibold rounded-xl text-sm hover:bg-purple-800 transition">
                    Add Address
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <label key={addr._id}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${
                        selectedAddressId === addr._id
                          ? "border-purple-400 bg-purple-50"
                          : "border-gray-100 hover:border-purple-200"
                      }`}>
                      <input
                        type="radio" name="address" value={addr._id}
                        checked={selectedAddressId === addr._id}
                        onChange={() => setSelectedAddressId(addr._id)}
                        className="accent-purple-700 w-4 h-4"
                      />
                      <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                        <HiOutlineHome className="text-purple-600 text-lg" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-800 text-sm">{addr.city}</span>
                          {addr.isDefault && (
                            <span className="text-xs bg-purple-100 text-purple-700 font-semibold px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500 text-sm truncate">{addr.details}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Phone Number */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h2 className="font-bold text-gray-800 text-lg mb-4">Contact Phone</h2>
              <div className="relative">
                <HiOutlinePhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setPhoneError(""); }}
                  placeholder="01xxxxxxxxx"
                  className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition ${
                    phoneError
                      ? "border-red-300 focus:border-red-400 bg-red-50"
                      : "border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                  }`}
                />
              </div>
              {phoneError && (
                <p className="text-red-500 text-xs mt-2 font-medium">{phoneError}</p>
              )}
              <p className="text-gray-400 text-xs mt-2">
                Egyptian numbers only: 010, 011, 012, or 015 followed by 8 digits
              </p>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h2 className="font-bold text-gray-800 text-lg mb-4">Payment Method</h2>
              <div className="grid grid-cols-2 gap-3">

                <label className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${
                  paymentMethod === "cash" ? "border-purple-400 bg-purple-50" : "border-gray-100 hover:border-purple-200"
                }`}>
                  <input type="radio" name="payment" value="cash"
                    checked={paymentMethod === "cash"} onChange={() => setPaymentMethod("cash")} className="hidden" />
                  <span className="text-3xl">💵</span>
                  <div className="text-center">
                    <p className="font-bold text-gray-800 text-sm">Cash on Delivery</p>
                    <p className="text-xs text-gray-400 mt-0.5">Pay when you receive</p>
                  </div>
                  {paymentMethod === "cash" && (
                    <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </label>

                <label className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${
                  paymentMethod === "card" ? "border-purple-400 bg-purple-50" : "border-gray-100 hover:border-purple-200"
                }`}>
                  <input type="radio" name="payment" value="card"
                    checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} className="hidden" />
                  <span className="text-3xl">💳</span>
                  <div className="text-center">
                    <p className="font-bold text-gray-800 text-sm">Credit / Debit Card</p>
                    <p className="text-xs text-gray-400 mt-0.5">Powered by Stripe</p>
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
                <p className="text-xs text-gray-400 mt-3 text-center">
                  You'll be redirected to Stripe's secure payment page to complete your order.
                </p>
              )}
            </div>
          </div>

          {/* ── Right column – Order Summary ── */}
          <div className="lg:w-80 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-24">
              <h2 className="font-bold text-gray-800 text-lg mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1">
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
                        <p className="text-sm font-semibold text-gray-700 truncate">{product.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-bold text-gray-700 shrink-0">
                        {((item.price ?? product.price) * item.quantity).toLocaleString()} EGP
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-semibold text-gray-700">{totalPrice.toLocaleString()} EGP</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Delivery</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
                <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-800">
                  <span>Total</span>
                  <span className="text-purple-700 text-lg">{totalPrice.toLocaleString()} EGP</span>
                </div>
              </div>

              {/* Quick summary of selected delivery info */}
              {selectedAddr && (
                <div className="mt-4 bg-purple-50 rounded-xl p-3 border border-purple-100">
                  <p className="text-xs font-semibold text-purple-700 mb-1">Delivering to:</p>
                  <p className="text-xs text-gray-600">{selectedAddr.details}, {selectedAddr.city}</p>
                  {phone && (
                    <p className="text-xs text-gray-500 mt-1">📞 {phone}</p>
                  )}
                </div>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={submitting || items.length === 0 || !selectedAddressId}
                className="w-full mt-5 py-3 bg-[#6B21A8] text-white font-semibold rounded-xl hover:bg-purple-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting
                  ? "Processing..."
                  : paymentMethod === "card"
                  ? "Pay with Card 💳"
                  : "Place Order 🎉"}
              </button>

              <button onClick={() => navigate("/cart")}
                className="w-full mt-2 py-3 border-2 border-gray-200 text-gray-500 font-semibold rounded-xl hover:border-purple-300 hover:text-purple-700 transition text-sm">
                Back to Cart
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}