
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Input, Select, SelectItem } from "@heroui/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { regSchema } from "../../../lib/vaildationSchemas/authSchema";
import { toast } from "react-toastify";
import { registerUser } from "../../../services/authServices";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRePass, setShowRePass] = useState(false);
  const [errorMes, setErrorMes] = useState("");
  const [successMes, setSuccessMes] = useState("");

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(regSchema),
    mode: "all",
    defaultValues: {
      userName: "",
  
      email: "",
      password: "",
      rePassword: "",
      age: "",
      gender: "",
      phone: "",
    },
  });

  async function onSubmit(data) {
    setErrorMes("");
    setSuccessMes("");
    try {
      const response = await registerUser(data);
      setSuccessMes(response.data.message);
      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      console.log(error);
      const message = error.response?.data?.message || "Something went wrong";
      setErrorMes(message);
      toast.error(message);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Create account</h2>
        <p className="text-gray-500 text-sm mt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

        {/* Username */}
        <Input
          {...register("userName")}
          placeholder="Username"
          aria-label="Username"
          autoComplete="username"
          errorMessage={errors.userName?.message}
          isInvalid={Boolean(errors.userName)}
          radius="lg"
          isRequired
          classNames={{
            inputWrapper:
              "bg-white border border-gray-200 shadow-none focus-within:ring-2 focus-within:ring-purple-400",
          }}
        />

  

        {/* Email */}
        <Input
          {...register("email")}
          type="email"
          placeholder="Email"
          aria-label="Email"
          autoComplete="email"
          errorMessage={errors.email?.message}
          isInvalid={Boolean(errors.email)}
          radius="lg"
          isRequired
          classNames={{
            inputWrapper:
              "bg-white border border-gray-200 shadow-none focus-within:ring-2 focus-within:ring-purple-400",
          }}
        />

        {/* Phone */}
        <Input
          {...register("phone")}
          type="tel"
          placeholder="Phone"
          aria-label="Phone"
          autoComplete="tel"
          errorMessage={errors.phone?.message}
          isInvalid={Boolean(errors.phone)}
          radius="lg"
          isRequired={false}
          classNames={{
            inputWrapper:
              "bg-white border border-gray-200 shadow-none focus-within:ring-2 focus-within:ring-purple-400",
          }}
        />

        {/* Age */}
        <Input
          {...register("age")}
          type="number"
          placeholder="Age"
          aria-label="Age"
          errorMessage={errors.age?.message}
          isInvalid={Boolean(errors.age)}
          radius="lg"
          isRequired
          classNames={{
            inputWrapper:
              "bg-white border border-gray-200 shadow-none focus-within:ring-2 focus-within:ring-purple-400",
          }}
        />

        {/* Gender */}
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <Select
              placeholder="Select Gender"
              selectedKeys={field.value ? [field.value] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0];
                field.onChange(value);
              }}
              aria-label="Gender"
              errorMessage={errors.gender?.message}
              isInvalid={Boolean(errors.gender)}
              radius="lg"
              isRequired
              classNames={{
                trigger:
                  "bg-white border border-gray-200 shadow-none focus:ring-2 focus:ring-purple-400",
              }}
            >
              <SelectItem key="male" value="male">Male</SelectItem>
              <SelectItem key="female" value="female">Female</SelectItem>
            </Select>
          )}
        />

        {/* Password */}
        <Input
          {...register("password")}
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          aria-label="Password"
          autoComplete="new-password"
          errorMessage={errors.password?.message}
          isInvalid={Boolean(errors.password)}
          radius="lg"
          isRequired
          endContent={
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400">
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          }
          classNames={{
            inputWrapper:
              "bg-white border border-gray-200 shadow-none focus-within:ring-2 focus-within:ring-purple-400",
          }}
        />

        {/* Confirm Password */}
        <Input
          {...register("rePassword")}
          type={showRePass ? "text" : "password"}
          placeholder="Confirm Password"
          aria-label="Confirm Password"
          autoComplete="new-password"
          errorMessage={errors.rePassword?.message}
          isInvalid={Boolean(errors.rePassword)}
          radius="lg"
          isRequired
          endContent={
            <button type="button" onClick={() => setShowRePass(!showRePass)} className="text-gray-400">
              {showRePass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          }
          classNames={{
            inputWrapper:
              "bg-white border border-gray-200 shadow-none focus-within:ring-2 focus-within:ring-purple-400",
          }}
        />

        {errorMes && (
          <p className="text-red-500 text-sm text-center">{errorMes}</p>
        )}

        {successMes && (
          <p className="text-green-500 text-sm text-center">{successMes}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition shadow-sm"
        >
          {isSubmitting ? "Creating..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}



