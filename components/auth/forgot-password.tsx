"use client";

import { useRouter } from "next/navigation";
import InputContainer from "../ui/reusables/input-container";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toApiError } from "@/utils/api-error";
import toast from "react-hot-toast";
import { forgotPassword } from "@/lib/api/endpoints/auth";
import ErrorText from "./error-text";

const ForgotPassword = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<{ email: string }>();

  const onSubmit = async (data: { email: string }) => {
    setIsLoading(true);
    toast.loading("Sending reset code...");
    try {
      const { email } = data;

      const res = await forgotPassword(email);
      toast.remove();
      router.push(`/otp?email=${email}`);
      toast.success(res.message ?? "Password reset code sent successfully");
    } catch (error: unknown) {
      const { message } = toApiError(error);
      toast.remove();
      toast.error(message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="flex w-full items-center flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <InputContainer label="Email">
        <input
          type="email"
          className="w-full input input"
          placeholder="Enter email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address",
            },
          })}
        />
      </InputContainer>

      {errors.email && (
        <ErrorText error={errors.email.message?.toString() ?? ""} />
      )}

      <button type="submit" className="btn btn-primary" disabled={isLoading}>
        {isLoading ? "Sending code ...." : "  Send reset code"}
      </button>
    </form>
  );
};

export default ForgotPassword;
