"use client";

import Link from "next/link";
import InputContainer from "../ui/reusables/input-container";
import { useForm } from "react-hook-form";
import { signin } from "@/lib/api/endpoints/auth";
import { toApiError } from "@/utils/api-error";
import toast from "react-hot-toast";
import { useState } from "react";
import { LoginForm } from "@/utils/types";
import ErrorText from "./error-text";
import { setCookie, validatePassword } from "@/lib/helpers/helper";
import { useRouter } from "next/navigation";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    toast.loading("Logging in...");
    try {
      const res = await signin(data.email, data.password);
      toast.remove();
      toast.success(res?.message ?? "Logged in successfully");

      if (res?.token) {
        setCookie(
          process.env.NEXT_PUBLIC_ACCESS_TOKEN ?? "access_token",
          res.token,
          { expires: 365, path: "/" },
        );
      }

      router.push("/");
    } catch (error: any) {
      const { message } = toApiError(error);
      console.error(message);
      toast.remove();
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form
      className="flex w-full items-center flex-col gap-4 "
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
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Invalid email address",
            },
          })}
        />
        {errors.email && (
          <ErrorText error={errors.email.message?.toString() ?? ""} />
        )}
      </InputContainer>

      <InputContainer
        label="Password"
        rightItem={
          <Link
            href="/forgot-password"
            className="text-sm text-blue-600 font-semibold"
          >
            Forgot password?
          </Link>
        }
      >
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
              // validate: {
              //   matchesPassword: (value) =>
              //     validatePassword(value) || "Invalid password",
              // },
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

      <button type="submit" className="btn btn-primary" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default Login;
