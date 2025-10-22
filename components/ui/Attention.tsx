import {HTMLAttributes, ReactNode} from "react";

type AttentionSpanProps = HTMLAttributes<HTMLSpanElement> & {
    children: ReactNode;
    className?: string;
    color?: AttentionColor;
    size?: AttentionSize;
}

type AttentionColor = "black" | "blue" | "green" | "red";
type AttentionSize = "sm" | "md" | "lg" | "xl";

export default function AttentionSpan({children, className = "", color = "green", size="md", ...props}: AttentionSpanProps) {
    const colorStyle: Record<AttentionColor, string> = {
        black: "bg-gradient-to-r from-gray-100 via-slate-100 to-neutral-100 text-gray-900 border-gray-400",
        blue: "bg-gradient-to-r from-blue-100 via-sky-100 to-cyan-100 text-sky-900 border-sky-400",
        green: "bg-gradient-to-r from-lime-100 via-emerald-100 to-teal-100 text-emerald-900 border-emerald-400",
        red: "",
    }
    const sizeStyle: Record<AttentionSize, string> = {
        sm: "border px-2 rounded-md text-sm md:text-base shadow-sm",
        md: "border px-4 py-1 rounded-md text-sm md:text-base shadow-sm",
        lg: "border px-4 py-2 rounded-md text-sm md:text-base shadow-sm",
        xl: "",
    }

    return (
        <span className={`cursor-pointer font-semibold tracking-wide animate-pulse text-center group-hover:animate-none hover:animate-none text-wrap ${className} ${colorStyle[color]} ${sizeStyle[size]}`} {...props}>
            {children}
        </span>
    )
}