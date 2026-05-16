
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import {
  HiOutlineMail, HiOutlinePhone, HiOutlineUser,
  HiOutlineCalendar, HiOutlineLogout, HiArrowLeft,
  HiOutlinePencil, HiOutlineLockClosed,
} from "react-icons/hi";
import { BsGenderAmbiguous } from "react-icons/bs";
import { MdCake } from "react-icons/md";
import { Input, Select, SelectItem } from "@heroui/react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { updatePasswordSchema, updateProfileSchema } from "../../lib/vaildationSchemas/authSchema";
import { getLoggedUserData, updatePassword, updateProfile } from "../../services/authServices";

// ── Shared input style (light + dark) ─────────────────────────────
const inputStyle = {
  inputWrapper:
    "bg-white dark:bg-[#2a2040] border border-gray-200 dark:border-purple-800 shadow-none rounded-xl data-[focus=true]:border-purple-400 data-[focus=true]:ring-2 data-[focus=true]:ring-purple-400",
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

// ── Edit Profile Tab ───────────────────────────────────────────────
function EditProfileTab({ user, onSuccess }) {
  const {
    register, handleSubmit, control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName:  user?.lastName  || "",
      phone:     user?.phone     || "",
      age:       user?.age       || "",
      gender:    user?.gender    || "",
    },
  });

  async function onSubmit(data) {
    try {
      const payload = Object.fromEntries(
        Object.entries(data).filter(([, v]) => v !== "" && v !== null && v !== undefined)
      );
      await updateProfile(payload);
      successToast("Profile updated successfully ✅");
      onSuccess();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        "Failed to update profile";
      errorToast(msg);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input {...register("firstName")} placeholder="First Name" 
        errorMessage={errors.firstName?.message} isInvalid={Boolean(errors.firstName)} radius="lg" classNames={inputStyle} />
      <Input {...register("lastName")} placeholder="Last Name" 
        errorMessage={errors.lastName?.message} isInvalid={Boolean(errors.lastName)} radius="lg" classNames={inputStyle} />
      <Input {...register("phone")} placeholder="01xxxxxxxxx" 
        errorMessage={errors.phone?.message} isInvalid={Boolean(errors.phone)} radius="lg" classNames={inputStyle} />
      <Input {...register("age")} type="number" placeholder="Age" 
        errorMessage={errors.age?.message} isInvalid={Boolean(errors.age)} radius="lg" classNames={inputStyle} />
      <Controller name="gender" control={control} render={({ field }) => (
        <Select  
          selectedKeys={field.value ? [field.value] : []}
          onSelectionChange={(keys) => field.onChange(Array.from(keys)[0])}
          errorMessage={errors.gender?.message} isInvalid={Boolean(errors.gender)} radius="lg"
          classNames={{ trigger: "bg-white dark:bg-[#2a2040] border border-gray-200 dark:border-purple-800 shadow-none" }}>
          <SelectItem key="male">Male</SelectItem>
          <SelectItem key="female">Female</SelectItem>
        </Select>
      )} />
      <button type="submit" disabled={isSubmitting}
        className="w-full py-3 bg-[#6B21A8] hover:bg-purple-800 disabled:opacity-60 text-white font-semibold rounded-xl transition">
        {isSubmitting ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}

// ── Change Password Tab ────────────────────────────────────────────
function ChangePasswordTab() {
  const [show, setShow] = useState({ old: false, new: false, re: false });
  const {
    register, handleSubmit, reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(updatePasswordSchema) });

  async function onSubmit(data) {
    try {
      await updatePassword(data);
      successToast("Password updated successfully 🔒");
      reset();
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0] ||
        err.response?.data?.message ||
        "Failed to update password";
      errorToast(msg);
    }
  }

  const toggle = (key) => setShow((s) => ({ ...s, [key]: !s[key] }));
  const eyeBtn = (key) => (
    <button type="button" onClick={() => toggle(key)}>
      {show[key]
        ? <FiEyeOff size={18} className="text-gray-400" />
        : <FiEye   size={18} className="text-gray-400" />}
    </button>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input {...register("oldPassword")} type={show.old ? "text" : "password"}
        placeholder="Current Password"  autoComplete="current-password"
        errorMessage={errors.oldPassword?.message} isInvalid={Boolean(errors.oldPassword)}
        radius="lg" classNames={inputStyle} endContent={eyeBtn("old")} />
      <Input {...register("newPassword")} type={show.new ? "text" : "password"}
        placeholder="New Password"  autoComplete="new-password"
        errorMessage={errors.newPassword?.message} isInvalid={Boolean(errors.newPassword)}
        radius="lg" classNames={inputStyle} endContent={eyeBtn("new")} />
      <Input {...register("confirmPassword")} type={show.re ? "text" : "password"}
        placeholder="Confirm New Password"  autoComplete="new-password"
        errorMessage={errors.confirmPassword?.message} isInvalid={Boolean(errors.confirmPassword)}
        radius="lg" classNames={inputStyle} endContent={eyeBtn("re")} />
      <button type="submit" disabled={isSubmitting}
        className="w-full py-3 bg-[#6B21A8] hover:bg-purple-800 disabled:opacity-60 text-white font-semibold rounded-xl transition">
        {isSubmitting ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}

// ── Main ───────────────────────────────────────────────────────────
export default function MyProfile() {
  const [user,      setUser]      = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [activeTab, setActiveTab] = useState("info");
  const navigate = useNavigate();

  const fetchUser = () => {
    setLoading(true);
    const token = localStorage.getItem("userToken");
    if (!token) { navigate("/login"); return; }

    getLoggedUserData()
      .then((res) => {
        const data = res.data;
        const extracted =
          data?.user ?? data?.data ?? data?.profile ??
          (data && typeof data === "object" && !Array.isArray(data) ? data : null);
        setUser(extracted);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.removeItem("userToken");
          navigate("/login");
          return;
        }
        setError(err.response?.data?.message || "Failed to load profile.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUser(); }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/login");
  };

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.name || user?.userName || "User";

  const initials = displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const infoRows = [
    { label: "First Name",    value: user?.firstName, Icon: HiOutlineUser },
    { label: "Last Name",     value: user?.lastName,  Icon: HiOutlineUser },
    { label: "Email",         value: user?.email,     Icon: HiOutlineMail },
    { label: "Phone",         value: user?.phone,     Icon: HiOutlinePhone },
    { label: "Age",           value: user?.age,       Icon: MdCake },
    {
      label: "Gender",
      value: user?.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : null,
      Icon: BsGenderAmbiguous,
    },
    {
      label: "Member since",
      value: user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
        : null,
      Icon: HiOutlineCalendar,
    },
  ].filter((r) => r.value !== null && r.value !== undefined && r.value !== "");

  // ── Loading skeleton ─────────────────────────────────────────────
  if (loading)
    return (
      <div className="min-h-[calc(100vh-80px)] bg-gray-50 dark:bg-[#13111C] flex items-center justify-center px-4 py-10 transition-colors duration-300">
        <div className="bg-white dark:bg-[#1e1a2e] rounded-3xl shadow-lg w-full max-w-2xl overflow-hidden animate-pulse">
          <div className="h-52 bg-purple-200 dark:bg-purple-900/40" />
          <div className="px-8 py-8 flex flex-col gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-gray-100 dark:bg-[#2a2040] rounded-2xl" />)}
          </div>
        </div>
      </div>
    );

  // ── Error state ──────────────────────────────────────────────────
  if (error)
    return (
      <div className="min-h-[calc(100vh-80px)] bg-gray-50 dark:bg-[#13111C] flex items-center justify-center px-4 transition-colors duration-300">
        <div className="bg-white dark:bg-[#1e1a2e] rounded-3xl shadow-lg p-10 w-full max-w-md flex flex-col items-center gap-5 text-center border border-gray-100 dark:border-purple-900/30">
          <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 text-3xl font-bold">!</div>
          <p className="text-gray-400 dark:text-gray-500">{error}</p>
          <button onClick={() => navigate("/login")}
            className="w-full py-4 rounded-2xl bg-[#6B21A8] text-white font-semibold hover:bg-purple-800 transition">
            Go to Login
          </button>
        </div>
      </div>
    );

  const tabs = [
    { key: "info",     label: "My Info",         Icon: HiOutlineUser },
    { key: "edit",     label: "Edit Profile",     Icon: HiOutlinePencil },
    { key: "password", label: "Change Password",  Icon: HiOutlineLockClosed },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-100 dark:bg-[#13111C] flex items-center justify-center px-4 py-40 transition-colors duration-300">
      <div className="w-full max-w-6xl">
        <div className="bg-white dark:bg-[#1e1a2e] rounded-3xl shadow-xl dark:shadow-purple-900/20 overflow-hidden border border-gray-100 dark:border-purple-900/30">

          {/* ── Purple Header ── */}
          <div className="relative bg-[#6B21A8] px-8 pt-12 pb-20 flex flex-col items-center overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-56 h-56 bg-purple-500 opacity-25 rounded-full -translate-y-16 translate-x-16" />
            <div className="absolute top-0 left-0 w-40 h-40 bg-purple-400 opacity-20 rounded-full -translate-y-12 -translate-x-10" />
            <div className="absolute bottom-0 right-8 w-32 h-32 bg-purple-300 opacity-20 rounded-full translate-y-10" />

            {/* Avatar */}
            <div className="relative z-10 w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-white dark:bg-[#2a2040] shadow-2xl flex items-center justify-center overflow-hidden ring-4 ring-white/40 mb-5">
              {user?.photo
                ? <img src={user.photo} alt={displayName} className="w-full h-full object-cover" />
                : <span className="text-4xl sm:text-5xl font-black text-purple-700 select-none leading-none">{initials}</span>
              }
            </div>

            <h1 className="relative z-10 text-2xl sm:text-3xl font-bold text-white tracking-wide text-center">{displayName}</h1>
            {user?.role && (
              <span className="relative z-10 mt-3 bg-white/20 text-white text-sm font-semibold px-5 py-1.5 rounded-full capitalize backdrop-blur-sm border border-white/20">
                {user.role}
              </span>
            )}
          </div>

          {/* ── Tabs ── */}
          <div className="px-6 sm:px-10 -mt-6 relative z-10">
            <div className="bg-white dark:bg-[#2a2040] rounded-2xl shadow-md dark:shadow-purple-900/20 flex overflow-hidden mb-6 border border-gray-100 dark:border-purple-800/50">
              {tabs.map((tab) => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors duration-200 ${
                    activeTab === tab.key
                      ? "bg-[#6B21A8] text-white"
                      : "text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  }`}>
                  <tab.Icon className="text-base" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* ── Info Tab ── */}
            {activeTab === "info" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6">
                {infoRows.map(({ label, value, Icon }) => (
                  <div key={label}
                    className="bg-white dark:bg-[#2a2040] rounded-2xl border border-gray-100 dark:border-purple-800/40 shadow-md dark:shadow-purple-900/10 px-5 py-6 flex items-center gap-4 hover:shadow-lg hover:border-purple-100 dark:hover:border-purple-700 transition-all">
                    <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-900/40 flex items-center justify-center shrink-0">
                      <Icon className="text-purple-600 dark:text-purple-400 text-xl" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider leading-none mb-1">{label}</span>
                      <span className="text-sm sm:text-base font-bold text-gray-800 dark:text-white truncate">{String(value)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Edit Tab ── */}
            {activeTab === "edit" && (
              <div className="pb-6">
                <EditProfileTab user={user} onSuccess={() => { fetchUser(); setActiveTab("info"); }} />
              </div>
            )}

            {/* ── Password Tab ── */}
            {activeTab === "password" && (
              <div className="pb-6">
                <ChangePasswordTab />
              </div>
            )}

            {/* ── Bottom Buttons ── */}
            <div className="flex flex-col sm:flex-row gap-3 pb-6">
              <button onClick={() => navigate("/home")}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-semibold hover:border-purple-300 hover:text-purple-600 dark:hover:border-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all text-sm">
                <HiArrowLeft className="text-lg" /> Back to Home
              </button>
              <button onClick={handleLogout}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-red-100 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 text-red-500 font-semibold hover:bg-red-500 hover:text-white hover:border-red-500 transition-all text-sm">
                <HiOutlineLogout className="text-lg" /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}