import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { HiArrowLeft, HiOutlineShoppingBag } from "react-icons/hi";
import { getMyOrders, cancelOrder } from "../../services/orderServices";

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

const statusConfig = {
  pending:   { label: "Pending",   classes: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  confirmed: { label: "Confirmed", classes: "bg-blue-50 text-blue-700 border-blue-200" },
  shipped:   { label: "Shipped",   classes: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  delivered: { label: "Delivered", classes: "bg-green-50 text-green-700 border-green-200" },
  cancelled: { label: "Cancelled", classes: "bg-red-50 text-red-600 border-red-200" },
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const res = await getMyOrders();
      const data = res.data?.data ?? res.data?.orders ?? [];
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      errorToast("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleCancel = async (orderId) => {
    try {
      await cancelOrder(orderId);
      successToast("Order cancelled successfully");
      fetchOrders();
    } catch (err) {
      errorToast(err.response?.data?.message || "Cannot cancel this order");
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-100 px-4 py-10 pt-40">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl border border-gray-200 bg-white hover:border-purple-300 hover:text-purple-700 transition">
            <HiArrowLeft className="text-lg" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
            <p className="text-sm text-gray-400">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <div key={i} className="h-40 bg-white rounded-2xl animate-pulse" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">📦</div>
            <p className="text-gray-500 font-medium">No orders yet</p>
            <button
              onClick={() => navigate("/products")}
              className="mt-5 px-6 py-2.5 bg-[#6B21A8] text-white font-semibold rounded-xl hover:bg-purple-800 transition text-sm"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = statusConfig[order.status] ?? statusConfig.pending;
              const canCancel = order.status === "pending" || order.status === "confirmed";
              return (
                <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-purple-100 transition-all">

                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="font-bold text-gray-800 text-sm">Order #{order.orderNumber ?? order._id?.slice(-6).toUpperCase()}</span>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${status.classes}`}>
                        {status.label}
                      </span>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                        order.isPaid ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-500 border-gray-200"
                      }`}>
                        {order.isPaid ? "Paid" : "Unpaid"}
                      </span>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="space-y-2 mb-4">
                    {(order.products ?? []).map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 truncate flex-1">{item.name} <span className="text-gray-400">× {item.quantity}</span></span>
                        <span className="font-semibold text-gray-700 ml-4">{(item.price * item.quantity).toLocaleString()} EGP</span>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <span className="capitalize">{order.paymentMethod}</span>
                      {order.address && <span className="ml-2 text-gray-400">· {order.address}</span>}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-purple-700">{order.totalPrice?.toLocaleString()} EGP</span>
                      {canCancel && (
                        <button
                          onClick={() => handleCancel(order._id)}
                          className="text-xs px-3 py-1.5 border-2 border-red-100 text-red-500 font-semibold rounded-xl hover:bg-red-500 hover:text-white hover:border-red-500 transition"
                        >
                          Cancel
                        </button>
                      )}
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