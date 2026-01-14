import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type LoaderIconProps = {
  size?: number;
};

const LoaderIcon = ({ size = 16 }: LoaderIconProps) => (
  <svg
    fill="none"
    height={size}
    viewBox="0 0 16 16"
    width={size}
    className="animate-spin"
  >
    <title>Loader</title>
    <g clipPath="url(#clip0_2393_1490)">
      <path d="M8 0V4" stroke="currentColor" strokeOpacity="0.7" />
      <path d="M8 16V12" stroke="currentColor" strokeOpacity="0.1" />
      <path d="M0 8H4" stroke="currentColor" strokeOpacity="0.3" />
      <path d="M16 8H12" stroke="currentColor" strokeOpacity="0.6" />
      <path
        d="M2.34277 13.6567L5.17119 10.8283"
        stroke="currentColor"
        strokeOpacity="0.2"
      />
      <path
        d="M13.6567 2.34326L10.8283 5.17169"
        stroke="currentColor"
        strokeOpacity="0.7"
      />
      <path
        d="M2.34277 2.34326L5.17119 5.17169"
        stroke="currentColor"
        strokeOpacity="0.4"
      />
      <path
        d="M13.6567 13.6567L10.8283 10.8283"
        stroke="currentColor"
        strokeOpacity="0.5"
      />
    </g>
    <defs>
      <clipPath id="clip0_2393_1490">
        <rect fill="white" height="16" width="16" />
      </clipPath>
    </defs>
  </svg>
);

export type LoaderProps = HTMLAttributes<HTMLDivElement> & {
  size?: number;
};

export const Loader = ({ className, size = 16, ...props }: LoaderProps) => (
  <div
    className={cn("flex items-center justify-center", className)}
    {...props}
  >
    <LoaderIcon size={size} />
  </div>
);
