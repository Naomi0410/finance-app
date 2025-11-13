'use client'

import Image from "next/image";
import { useEffect, useState } from "react";

export default function ImageFallback({ src, fallbackSrc, alt, ...rest }) {
  const [imgSrc, set_imgSrc] = useState(src);

  useEffect(() => {
    set_imgSrc(src);
  }, [src]);

  return (
    <Image
      {...rest}
      src={imgSrc}
      alt={alt}
      onError={() => {
        set_imgSrc(fallbackSrc);
      }}
    />
  );
}