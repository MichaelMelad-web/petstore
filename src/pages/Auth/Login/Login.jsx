import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Input } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../../lib/vaildationSchemas/authSchema";
import { loginUser } from "../../../services/authServices";
import { toast } from "react-toastify";

const heroInputStyle = {
  inputWrapper:
    "bg-white border border-gray-200 shadow-none rounded-xl data-[focus=true]:border-purple-400 data-[focus=true]:ring-2 data-[focus=true]:ring-purple-400",
};

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMes, setErrorMes] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "all",
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(formData) {
    setErrorMes("");
    try {
      const { data } = await loginUser(formData);
      const token =
        data?.token ?? data?.Token ?? data?.accessToken ?? data?.data?.token;
      if (token) {
        localStorage.setItem("userToken", token);
        toast.success(data.message || "Login Successfully 🎉");
        navigate("/products");
      } else {
        toast.error("Login response did not include a token.");
      }
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Invalid email or password";
      toast.error(errMsg);
      setErrorMes(errMsg);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Welcome back</h2>
        <p className="text-gray-500 text-sm mt-2">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-purple-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register("email")}
          type="email"
          name="email"
          placeholder="Email"
          aria-label="Email"
          autoComplete="email"
          errorMessage={errors.email?.message}
          isInvalid={Boolean(errors.email)}
          radius="lg"
          classNames={heroInputStyle}
        />

        <Input
          {...register("password")}
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          aria-label="Password"
          autoComplete="current-password"
          errorMessage={errors.password?.message}
          isInvalid={Boolean(errors.password)}
          radius="lg"
          classNames={heroInputStyle}
          endContent={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          }
        />

        {/* Forgot Password Link */}
        <div className="text-right">
          <Link
            to="/forget-password"
            className="text-sm text-purple-600 font-semibold hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        {errorMes && (
          <p className="text-red-500 text-sm text-center">{errorMes}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-semibold rounded-xl transition shadow-sm"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
