
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@heroui/react";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import {
  forgetPasswordSchema,
  confirmOTPSchema,
  resetPasswordSchema,
} from "../../lib/vaildationSchemas/authSchema";
import { forgetPassword, confirmOTP, resetPassword } from "../../services/authServices";

const inputStyle = {
  inputWrapper:
    "bg-white border border-gray-200 shadow-none rounded-xl data-[focus=true]:border-purple-400 data-[focus=true]:ring-2 data-[focus=true]:ring-purple-400",
};

const successToast = (msg) =>
  toast.success(msg, {
    position: "top-right",
    autoClose: 3000,
    style: { background: "#6B21A8", color: "#fff", fontWeight: "600", borderRadius: "12px" },
    progressStyle: { background: "#D8B4FE" },
  });

const errorToast = (msg) =>
  toast.error(msg, {
    position: "top-right",
    autoClose: 4000,
    style: { background: "#FEF2F2", color: "#B91C1C", fontWeight: "600", borderRadius: "12px", border: "1px solid #FECACA" },
    progressStyle: { background: "#F87171" },
    icon: "❌",
  });

// ── Step 1: Send OTP ───────────────────────────────────────────────
function StepSendOTP({ onNext }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(forgetPasswordSchema) });

  async function onSubmit({ email }) {
    try {
      await forgetPassword(email);
      successToast("OTP sent to your email 📧");
      onNext(email);
    } catch (err) {
      errorToast(err.response?.data?.message || "Failed to send OTP");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
          📧
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Forgot Password?</h2>
        <p className="text-gray-500 text-sm mt-2">
          Enter your email and we'll send you an OTP
        </p>
      </div>

      <Input
        {...register("email")}
        type="email"
        placeholder="Email address"
        label="Email"
        autoComplete="email"
        errorMessage={errors.email?.message}
        isInvalid={Boolean(errors.email)}
        radius="lg"
        classNames={inputStyle}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-[#6B21A8] hover:bg-purple-800 disabled:opacity-60 text-white font-semibold rounded-xl transition"
      >
        {isSubmitting ? "Sending OTP..." : "Send OTP"}
      </button>

      <p className="text-center text-sm text-gray-500">
        Remember your password?{" "}
        <Link to="/login" className="text-purple-600 font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

// ── Step 2: Confirm OTP ────────────────────────────────────────────
function StepConfirmOTP({ email, onNext, onResend }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(confirmOTPSchema) });

  async function onSubmit({ otp }) {
    try {
      await confirmOTP({ email, otp });
      successToast("OTP verified ✅");
      onNext();
    } catch (err) {
      errorToast(err.response?.data?.message || "Invalid or expired OTP");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
          🔑
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Enter OTP</h2>
        <p className="text-gray-500 text-sm mt-2">
          We sent a code to{" "}
          <span className="font-semibold text-gray-700">{email}</span>
        </p>
      </div>

      <Input
        {...register("otp")}
        placeholder="Enter OTP code"
        label="OTP Code"
        errorMessage={errors.otp?.message}
        isInvalid={Boolean(errors.otp)}
        radius="lg"
        classNames={inputStyle}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-[#6B21A8] hover:bg-purple-800 disabled:opacity-60 text-white font-semibold rounded-xl transition"
      >
        {isSubmitting ? "Verifying..." : "Verify OTP"}
      </button>

      <p className="text-center text-sm text-gray-500">
        Didn't receive the code?{" "}
        <button
          type="button"
          onClick={onResend}
          className="text-purple-600 font-semibold hover:underline"
        >
          Resend OTP
        </button>
      </p>
    </form>
  );
}

// ── Step 3: Reset Password ─────────────────────────────────────────
function StepResetPassword({ email, onDone }) {
  const [show, setShow] = useState({ new: false, re: false });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(resetPasswordSchema) });

  async function onSubmit(data) {
    try {
      await resetPassword({ email, newPassword: data.newPassword, rePassword: data.rePassword });
      successToast("Password reset successfully 🎉");
      onDone();
    } catch (err) {
      errorToast(err.response?.data?.message || "Failed to reset password");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
          🔒
        </div>
        <h2 className="text-2xl font-bold text-gray-800">New Password</h2>
        <p className="text-gray-500 text-sm mt-2">Set your new password below</p>
      </div>

      <Input
        {...register("newPassword")}
        type={show.new ? "text" : "password"}
        placeholder="New Password"
        label="New Password"
        autoComplete="new-password"
        errorMessage={errors.newPassword?.message}
        isInvalid={Boolean(errors.newPassword)}
        radius="lg"
        classNames={inputStyle}
        endContent={
          <button type="button" onClick={() => setShow((s) => ({ ...s, new: !s.new }))}>
            {show.new
              ? <FiEyeOff size={18} className="text-gray-400" />
              : <FiEye size={18} className="text-gray-400" />}
          </button>
        }
      />

      <Input
        {...register("rePassword")}
        type={show.re ? "text" : "password"}
        placeholder="Confirm New Password"
        label="Confirm Password"
        autoComplete="new-password"
        errorMessage={errors.rePassword?.message}
        isInvalid={Boolean(errors.rePassword)}
        radius="lg"
        classNames={inputStyle}
        endContent={
          <button type="button" onClick={() => setShow((s) => ({ ...s, re: !s.re }))}>
            {show.re
              ? <FiEyeOff size={18} className="text-gray-400" />
              : <FiEye size={18} className="text-gray-400" />}
          </button>
        }
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-[#6B21A8] hover:bg-purple-800 disabled:opacity-60 text-white font-semibold rounded-xl transition"
      >
        {isSubmitting ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );
}

// ── Main ───────────────────────────────────────────────────────────
export default function ForgetPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const steps = [
    { num: 1, label: "Send OTP" },
    { num: 2, label: "Verify OTP" },
    { num: 3, label: "Reset" },
  ];

  async function handleResend() {
    try {
      await forgetPassword(email);
      successToast("OTP resent to your email 📧");
    } catch (err) {
      errorToast(err.response?.data?.message || "Failed to resend OTP");
    }
  }

  return (
    <div className="w-full max-w-md mx-auto py-6">

      {/* Progress Bar */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {steps.map((s, i) => (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                step >= s.num
                  ? "bg-[#6B21A8] text-white shadow-md"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              {step > s.num ? "✓" : s.num}
            </div>
            <span
              className={`text-xs font-semibold hidden sm:inline transition-colors duration-300 ${
                step >= s.num ? "text-[#6B21A8]" : "text-gray-400"
              }`}
            >
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <div
                className={`w-10 h-0.5 mx-1 transition-colors duration-300 ${
                  step > s.num ? "bg-[#6B21A8]" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Steps */}
      {step === 1 && (
        <StepSendOTP onNext={(e) => { setEmail(e); setStep(2); }} />
      )}
      {step === 2 && (
        <StepConfirmOTP
          email={email}
          onNext={() => setStep(3)}
          onResend={handleResend}
        />
      )}
      {step === 3 && (
        <StepResetPassword
          email={email}
          onDone={() => navigate("/login")}
        />
      )}

    </div>
  );
}