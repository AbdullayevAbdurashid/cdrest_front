/* eslint-disable @next/next/no-img-element */
import React from "react";
import cls from "./fallbackImage.module.scss";

type Props = {
  src?: string;
  alt?: string;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  priority?: boolean;
  onError?: () => void;
};

export default function FallbackImage({ src, alt, onError }: Props) {
  return <img src={src} alt={alt} className={cls.root} onError={onError} />;
}
