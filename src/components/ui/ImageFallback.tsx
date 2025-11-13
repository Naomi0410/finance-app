'use client'

import Image, { ImageProps } from "next/image";
import { useEffect, useState } from "react";

type ImageFallbackProps = {
  src: string;
  fallbackSrc: string;
  alt: string;
} & Omit<ImageProps, 'src' | 'alt'>;

export default function ImageFallback({
  src,
  fallbackSrc,
  alt,
  ...rest
}: ImageFallbackProps) {
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
