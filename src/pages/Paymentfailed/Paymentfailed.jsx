import { useNavigate } from "react-router-dom";

export default function PaymentFailed() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">

        {/* Error icon */}
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Payment Failed</h1>
        <p className="text-gray-500 text-sm mb-2">
          Something went wrong with your payment. Your order was not placed.
        </p>
        <p className="text-gray-400 text-xs mb-8">
          Don't worry — your cart is still saved. You can try again or use a different payment method.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => navigate("/checkout")}
            className="w-full py-3 bg-[#6B21A8] text-white font-semibold rounded-xl hover:bg-purple-800 transition"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate("/cart")}
            className="w-full py-3 border-2 border-gray-200 text-gray-500 font-semibold rounded-xl hover:border-purple-300 hover:text-purple-700 transition text-sm"
          >
            Back to Cart
          </button>
          <button
            onClick={() => navigate("/home")}
            className="w-full py-2 text-gray-400 font-medium text-sm hover:text-purple-700 transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}