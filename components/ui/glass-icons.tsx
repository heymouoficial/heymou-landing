import React from "react";

// Interfaces
export interface GlassIconsItem {
    icon: React.ReactElement;
    color: string;
    label?: string;
    customClass?: string;
}

export interface GlassIconsProps {
    items: GlassIconsItem[];
    className?: string;
}

// Gradient mapping using darker, more dramatic gradients
const gradientMapping: Record<string, string> = {
    blue: "linear-gradient(135deg, #001A4D, #0059FF)", // Much darker blue to primary
    primary: "linear-gradient(135deg, #000B1A, #00153D)", // Very dark to dark primary
    light: "linear-gradient(135deg, #003366, #1F6DFF)", // Dark blue to primary-light
};

// Component definition
export const Component = ({ items, className }: GlassIconsProps): React.JSX.Element => {
    const getBackgroundStyle = (color: string): React.CSSProperties => {
        if (gradientMapping[color]) {
            return { background: gradientMapping[color] };
        }
        return { background: color };
    };

    return (
        <div
            className={`grid gap-[2em] grid-cols-2 md:grid-cols-3 mx-auto py-[2em] overflow-visible ${className || ""
                }`}
        >
            {items.map((item, index) => (
                <button
                    key={index}
                    type="button"
                    aria-label={item.label || 'Icon'}
                    className={`relative bg-transparent outline-none w-[4.5em] h-[4.5em] [perspective:24em] [transform-style:preserve-3d] [-webkit-tap-highlight-color:transparent] group ${item.customClass || ""
                        }`}
                >
                    {/* Back layer */}
                    <span
                        className="absolute top-0 left-0 w-full h-full rounded-[1.25em] block transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] origin-[100%_100%] rotate-[15deg] group-hover:[transform:rotate(25deg)_translate3d(-0.5em,-0.5em,0.5em)]"
                        style={{
                            ...getBackgroundStyle(item.color),
                            boxShadow: "0.5em -0.5em 0.75em hsla(223, 10%, 10%, 0.15)",
                        }}
                    ></span>

                    {/* Front layer */}
                    <span
                        className="absolute top-0 left-0 w-full h-full rounded-[1.25em] bg-[hsla(0,0%,100%,0.08)] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] origin-[80%_50%] flex backdrop-blur-[0.75em] [-webkit-backdrop-filter:blur(0.75em)] transform group-hover:[transform:translateZ(2em)]"
                        style={{
                            boxShadow: "0 0 0 0.1em hsla(0, 0%, 100%, 0.2) inset",
                        }}
                    >
                        <span
                            className="m-auto w-[1.5em] h-[1.5em] flex items-center justify-center"
                            aria-hidden="true"
                        >
                            {item.icon}
                        </span>
                    </span>

                    {/* Label - only show if provided */}
                    {item.label && (
                        <span className="absolute top-full left-0 right-0 text-center whitespace-nowrap leading-[2] text-base opacity-0 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] translate-y-0 group-hover:opacity-100 group-hover:[transform:translateY(20%)]">
                            {item.label}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
};