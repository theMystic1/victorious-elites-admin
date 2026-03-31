"use client";

import { IMAGES } from "@/lib/helpers/constants";
import { Cols } from "./cols-rows";
import Image from "next/image";

const Empty = ({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) => {
  const { emptyBoxImg } = IMAGES;
  return (
    <Cols className="h-full w-full min-h-56 gap-3 items-center justify-center">
      <div className="h-40 w-40 relative">
        <Image
          src={emptyBoxImg}
          alt="empty box"
          layout="fill"
          objectFit="contain"
          loading="eager"
        />
      </div>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </Cols>
  );
};

export default Empty;
