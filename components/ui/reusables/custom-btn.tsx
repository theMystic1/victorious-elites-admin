"use client";

import * as React from "react";

type CustomButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  variant?: "primary" | "secondary" | "danger";
};

export const CustomButton = ({
  children,
  variant = "primary",
  className = "",
  ...rest
}: CustomButtonProps) => {
  const btnStyle =
    variant === "primary"
      ? "btn-primary"
      : variant === "secondary"
        ? "bg-white text-black border-gray-400 border"
        : "bg-red-600 text-white translate-y-0.5";

  return (
    <button {...rest} className={`${btnStyle} ${className} btn`}>
      {children}
    </button>
  );
};
