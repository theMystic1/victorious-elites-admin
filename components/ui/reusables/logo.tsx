"use client";

import { LogoSizes } from "@/utils/types";
import Image from "next/image";
import Link from "next/link";

const Logo = ({ size = "md" }: { size?: LogoSizes }) => {
  const logoSize = size === "sm" ? 16 : size === "lg" ? 120 : 48;
  return (
    <Link href="/">
      <Image
        src="/images/logo.png"
        alt="Logo"
        width={logoSize}
        height={logoSize}
      />
    </Link>
  );
};

export default Logo;
