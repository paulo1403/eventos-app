import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = "",
      variant = "primary",
      fullWidth = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variants = {
      primary:
        "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
      secondary:
        "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500",
      outline:
        "border border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500",
    };

    const widthClass = fullWidth ? "w-full" : "";
    const disabledClass = disabled ? "opacity-60 cursor-not-allowed" : "";

    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${widthClass} ${disabledClass} ${className}`}
        disabled={disabled}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
