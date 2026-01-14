"use client";

import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export type ShimmerProps = HTMLAttributes<HTMLDivElement>;

export const Shimmer = ({ className, ...props }: ShimmerProps) => (
  <div
    className={cn(
      "relative overflow-hidden rounded-md bg-muted",
      "before:absolute before:inset-0 before:-translate-x-full",
      "before:animate-[shimmer_2s_infinite]",
      "before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent",
      className
    )}
    {...props}
  />
);

export type ShimmerLineProps = HTMLAttributes<HTMLDivElement> & {
  width?: string | number;
};

export const ShimmerLine = ({
  className,
  width = "100%",
  ...props
}: ShimmerLineProps) => (
  <Shimmer
    className={cn("h-4", className)}
    style={{ width: typeof width === "number" ? `${width}%` : width }}
    {...props}
  />
);

export type ShimmerBlockProps = HTMLAttributes<HTMLDivElement>;

export const ShimmerBlock = ({ className, ...props }: ShimmerBlockProps) => (
  <div className={cn("space-y-2", className)} {...props}>
    <ShimmerLine width="90%" />
    <ShimmerLine width="100%" />
    <ShimmerLine width="75%" />
  </div>
);
