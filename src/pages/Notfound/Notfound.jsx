import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Notfound() {
  const navigate = useNavigate();
  const [count, setCount] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((c) => c - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (count <= 0) {
      navigate("/home");
    }
  }, [count, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">

        <div className="relative mb-6">
          <h1 className="text-[160px] sm:text-[200px] font-black text-gray-100 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-7xl sm:text-8xl">🐾</span>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-3">
          Oops! Page not found
        </h2>
        <p className="text-gray-400 text-sm sm:text-base mb-8 leading-relaxed">
          Looks like this page ran away like a playful pet! <br />
          We couldn't find what you were looking for.
        </p>

        <p className="text-sm text-gray-400 mb-6">
          Redirecting to home in{" "}
          <span className="font-bold text-[#6B21A8]">{count <= 0 ? 0 : count}</span> seconds...
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate("/home")}
            className="px-8 py-3 bg-[#6B21A8] text-white font-semibold rounded-xl hover:bg-purple-800 transition"
          >
            Go Home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:border-purple-300 hover:text-purple-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}