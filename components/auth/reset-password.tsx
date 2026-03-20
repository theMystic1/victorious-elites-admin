"use client";

import { useRouter, useSearchParams } from "next/navigation";
import InputContainer from "../ui/reusables/input-container";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toApiError } from "@/utils/api-error";
import toast from "react-hot-toast";
import { resetPassword } from "@/lib/api/endpoints/auth";
import ErrorText from "./error-text";

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const otp = searchParams.get("otp");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const passwordValue = watch("password");

  const onSubmit = async (data: any) => {
    setLoading(true);
    toast.loading("Ressetting password...");

    try {
      const res = await resetPassword(email!, otp!, data.password);
      toast.remove();
      toast.success(res?.message || "Password reset successfully");
      router.push("/login");
    } catch (error: unknown) {
      const { message } = toApiError(error);
      toast.remove();
      toast.error(message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="flex w-full items-center flex-col gap-4 "
      onSubmit={handleSubmit(onSubmit)}
    >
      <InputContainer label="Password">
        <div className="w-full input flex items-center justify-between">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full iput"
            placeholder="Enter password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
          />

          <button
            type="button"
            className="text-xs font-black text-blue-950"
            onClick={() => setShowPassword((sh) => !sh)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {errors.password && (
          <ErrorText error={errors.password.message?.toString() ?? ""} />
        )}
      </InputContainer>
      <InputContainer label="Confirm Password">
        <div className="w-full input flex items-center justify-between">
          <input
            type={showConfirmPassword ? "text" : "password"}
            className="w-full iput"
            placeholder="Enter confirm password"
            {...register("confirmPassword", {
              required: "Confirm password is required",
              validate: (value) =>
                value === passwordValue || "Passwords do not match",
            })}
          />

          <button
            type="button"
            className="text-xs font-black text-blue-950"
            onClick={() => setShowConfirmPassword((sh) => !sh)}
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>
        {errors.confirmPassword && (
          <ErrorText error={errors.confirmPassword.message?.toString() ?? ""} />
        )}
      </InputContainer>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Resetting..." : "Reset"}
      </button>
    </form>
  );
};

export default ResetPassword;
