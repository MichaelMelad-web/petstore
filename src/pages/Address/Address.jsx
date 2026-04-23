
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Input } from "@heroui/react";
import {
  HiOutlinePlus, HiOutlineTrash, HiOutlinePencil,
  HiOutlineHome, HiArrowLeft, HiStar,
} from "react-icons/hi";
import {
  getAddresses, addAddress, updateAddress, removeAddress,
} from "../../services/addressServices";

const inputStyle = {
  inputWrapper:
    "bg-white border border-gray-200 shadow-none rounded-xl data-[focus=true]:border-purple-400 data-[focus=true]:ring-2 data-[focus=true]:ring-purple-400",
};

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

function AddressForm({ initial, onSubmit, onCancel, isSubmitting }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      details: initial?.details || "",
      city: initial?.city || "",
      isDefault: initial?.isDefault || false,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 bg-purple-50 rounded-2xl p-5 border border-purple-100">
      <Input
        {...register("details", { required: "Address details are required" })}
        placeholder="e.g. 123 Tahrir Square, Downtown"
        label="Address Details"
        errorMessage={errors.details?.message}
        isInvalid={Boolean(errors.details)}
        radius="lg"
        classNames={inputStyle}
      />
      <Input
        {...register("city", { required: "City is required" })}
        placeholder="e.g. Cairo"
        label="City"
        errorMessage={errors.city?.message}
        isInvalid={Boolean(errors.city)}
        radius="lg"
        classNames={inputStyle}
      />

      {/* Set as Default checkbox */}
      <label className="flex items-center gap-3 cursor-pointer bg-white rounded-xl px-4 py-3 border border-gray-200 hover:border-purple-300 transition">
        <input
          type="checkbox"
          {...register("isDefault")}
          className="w-4 h-4 accent-purple-700 rounded"
        />
        <span className="text-sm font-semibold text-gray-600">Set as default address</span>
      </label>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-2.5 bg-[#6B21A8] hover:bg-purple-800 disabled:opacity-60 text-white font-semibold rounded-xl transition text-sm"
        >
          {isSubmitting ? "Saving..." : "Save Address"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 border-2 border-gray-200 text-gray-500 font-semibold rounded-xl hover:border-purple-300 hover:text-purple-700 transition text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function Address() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const fetchAddresses = async () => {
    try {
      const res = await getAddresses();
      const data =
        res.data?.data?.addresses ??
        res.data?.data ??
        res.data?.addresses ??
        res.data ??
        [];
      setAddresses(Array.isArray(data) ? data : []);
    } catch {
      errorToast("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAddresses(); }, []);

  const handleAdd = async (data) => {
    setSubmitting(true);
    try {
      await addAddress(data);
      successToast("Address added successfully 🏠");
      setShowForm(false);
      fetchAddresses();
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0] ||
        err.response?.data?.message ||
        "Failed to add address";
      errorToast(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (data) => {
    setSubmitting(true);
    try {
      await updateAddress(editingId, data);
      successToast("Address updated successfully ✅");
      setEditingId(null);
      fetchAddresses();
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0] ||
        err.response?.data?.message ||
        "Failed to update address";
      errorToast(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (addressId) => {
    try {
      await removeAddress(addressId);
      successToast("Address removed");
      fetchAddresses();
    } catch (err) {
      errorToast(err.response?.data?.message || "Failed to remove address");
    }
  };

  // Set an address as default by sending isDefault: true in an update call
  const handleSetDefault = async (addr) => {
    if (addr.isDefault) return; // already default
    setSubmitting(true);
    try {
      await updateAddress(addr._id, {
        details: addr.details,
        city: addr.city,
        isDefault: true,
      });
      successToast("Default address updated ⭐");
      fetchAddresses();
    } catch (err) {
      errorToast(err.response?.data?.message || "Failed to set default address");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-100 px-4 py-10 pt-50">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl border border-gray-200 bg-white hover:border-purple-300 hover:text-purple-700 transition"
            >
              <HiArrowLeft className="text-lg" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">My Addresses</h1>
              <p className="text-sm text-gray-400">
                {addresses.length} saved address{addresses.length !== 1 ? "es" : ""}
              </p>
            </div>
          </div>
          {!showForm && !editingId && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#6B21A8] text-white font-semibold rounded-xl hover:bg-purple-800 transition text-sm"
            >
              <HiOutlinePlus className="text-base" /> Add New
            </button>
          )}
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="mb-4">
            <AddressForm
              onSubmit={handleAdd}
              onCancel={() => setShowForm(false)}
              isSubmitting={submitting}
            />
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-white rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : addresses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🏠</div>
            <p className="text-gray-500 font-medium">No addresses yet</p>
            <p className="text-gray-400 text-sm mt-1">Add your first address to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((addr) => (
              <div key={addr._id}>
                {editingId === addr._id ? (
                  <AddressForm
                    initial={addr}
                    onSubmit={handleUpdate}
                    onCancel={() => setEditingId(null)}
                    isSubmitting={submitting}
                  />
                ) : (
                  <div className={`bg-white rounded-2xl shadow-sm border px-5 py-4 flex items-center gap-4 hover:shadow-md transition-all ${addr.isDefault ? "border-purple-300" : "border-gray-100 hover:border-purple-100"}`}>
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${addr.isDefault ? "bg-purple-100" : "bg-purple-50"}`}>
                      <HiOutlineHome className="text-purple-600 text-xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-gray-800 text-sm">
                          {addr.city || "Address"}
                        </span>
                        {addr.isDefault && (
                          <span className="text-xs bg-purple-100 text-purple-700 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <HiStar className="text-yellow-500" /> Default
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm truncate">{addr.details}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {/* Set as Default button */}
                      {!addr.isDefault && (
                        <button
                          onClick={() => handleSetDefault(addr)}
                          disabled={submitting}
                          title="Set as default"
                          className="p-2 rounded-xl border border-gray-200 text-gray-400 hover:border-yellow-300 hover:text-yellow-500 transition disabled:opacity-50"
                        >
                          <HiStar size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => setEditingId(addr._id)}
                        className="p-2 rounded-xl border border-gray-200 text-gray-400 hover:border-purple-300 hover:text-purple-600 transition"
                      >
                        <HiOutlinePencil size={16} />
                      </button>
                      <button
                        onClick={() => handleRemove(addr._id)}
                        className="p-2 rounded-xl border border-red-100 text-red-400 hover:bg-red-50 hover:border-red-300 transition"
                      >
                        <HiOutlineTrash size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}