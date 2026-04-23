import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  // Auto-redirect to orders after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/orders");
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">

        {/* Animated checkmark */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Payment Successful!</h1>
        <p className="text-gray-500 text-sm mb-2">
          Your order has been placed and confirmed. 🎉
        </p>
        <p className="text-gray-400 text-xs mb-8">
          You'll be redirected to your orders automatically in 5 seconds.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => navigate("/orders")}
            className="w-full py-3 bg-[#6B21A8] text-white font-semibold rounded-xl hover:bg-purple-800 transition"
          >
            View My Orders
          </button>
          <button
            onClick={() => navigate("/products")}
            className="w-full py-3 border-2 border-gray-200 text-gray-500 font-semibold rounded-xl hover:border-purple-300 hover:text-purple-700 transition text-sm"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}