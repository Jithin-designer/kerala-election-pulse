"use client";

import {
  GraduationCap,
  Trophy,
  BookOpen,
  Award,
  IndianRupee,
  AlertTriangle,
  Briefcase,
  type LucideIcon,
} from "lucide-react";

export type TagVariant =
  | "education"
  | "winner"
  | "status"
  | "assets"
  | "cases"
  | "profession"
  | "neutral";

interface Props {
  variant: TagVariant;
  text: string;
  size?: "sm" | "xs";
}

interface VariantStyle {
  icon: LucideIcon;
  className: string;
  style?: React.CSSProperties;
}

/* ── Variant → icon + style mapping ── */
function getVariantStyle(variant: TagVariant, text: string): VariantStyle {
  switch (variant) {
    case "education": {
      // Pick icon based on text content
      const lower = text.toLowerCase();
      let icon: LucideIcon = GraduationCap;
      if (lower.includes("graduate professional") || lower.includes("post graduate")) {
        icon = Award;
      } else if (lower.includes("graduate")) {
        icon = GraduationCap;
      } else {
        icon = BookOpen;
      }
      return {
        icon,
        className: "",
        style: {
          background: "var(--theme-border)",
          color: "var(--theme-text-secondary)",
        },
      };
    }
    case "winner":
      return {
        icon: Trophy,
        className: "font-bold",
        style: {
          background: "linear-gradient(135deg, #FFD700, #FFA500)",
          color: "#000",
          boxShadow: "0 2px 8px rgba(255,165,0,0.3)",
        },
      };
    case "status":
      return {
        icon: BookOpen,
        className: "italic",
        style: {
          background: "transparent",
          color: "var(--theme-text-muted)",
          border: "1px dashed var(--theme-border)",
        },
      };
    case "assets":
      return {
        icon: IndianRupee,
        className: "",
        style: {
          background: "var(--theme-border)",
          color: "var(--theme-accent)",
        },
      };
    case "cases":
      return {
        icon: AlertTriangle,
        className: "font-semibold",
        style: {
          background: "rgba(220,38,38,0.1)",
          color: "#dc2626",
          border: "1px solid rgba(220,38,38,0.2)",
        },
      };
    case "profession":
      return {
        icon: Briefcase,
        className: "",
        style: {
          background: "var(--theme-border)",
          color: "var(--theme-text-muted)",
        },
      };
    default:
      return {
        icon: BookOpen,
        className: "",
        style: {
          background: "var(--theme-border)",
          color: "var(--theme-text-muted)",
        },
      };
  }
}

export default function Tag({ variant, text, size = "xs" }: Props) {
  const { icon: Icon, className, style } = getVariantStyle(variant, text);

  const sizeClass =
    size === "xs"
      ? "text-[10px] px-1.5 py-px gap-0.5"
      : "text-[11px] px-2 py-0.5 gap-1";

  const iconSize = size === "xs" ? "w-2.5 h-2.5" : "w-3 h-3";

  return (
    <span
      className={`inline-flex items-center rounded-md ${sizeClass} ${className}`}
      style={style}
    >
      <Icon className={iconSize} />
      {text}
    </span>
  );
}
