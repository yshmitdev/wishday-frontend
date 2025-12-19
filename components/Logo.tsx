"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
}

export function Logo({ width = 128, height = 128, className, alt = "WishDay" }: LogoProps) {
  return (
    <Image
      src="/logo.png"
      alt={alt}
      width={width}
      height={height}
      className={cn(
        "rounded-md transition-all duration-300",
        // In dark mode, invert and adjust brightness to make the dark blue logo light
        "dark:brightness-[2] dark:invert dark:hue-rotate-180",
        className
      )}
    />
  );
}

