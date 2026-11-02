import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 transition-all duration-100 ease-out select-none translate-y-0 active:translate-y-[3px] active:shadow-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_4px_0_0_oklch(0.6_0_0)] hover:shadow-[0_6px_0_0_oklch(0.6_0_0)] hover:-translate-y-[2px] active:shadow-[0_1px_0_0_oklch(0.6_0_0)]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-[0_4px_0_0_oklch(0.4_0.2_25)] hover:shadow-[0_6px_0_0_oklch(0.4_0.2_25)] hover:-translate-y-[2px] active:shadow-[0_1px_0_0_oklch(0.4_0.2_25)]",
        outline:
          "border border-input bg-background shadow-[0_4px_0_0_oklch(0.34_0_0)] hover:shadow-[0_6px_0_0_oklch(0.34_0_0)] hover:-translate-y-[2px] hover:bg-accent hover:text-accent-foreground active:shadow-[0_1px_0_0_oklch(0.34_0_0)]",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[0_4px_0_0_oklch(0.18_0_0)] hover:shadow-[0_6px_0_0_oklch(0.18_0_0)] hover:-translate-y-[2px] active:shadow-[0_1px_0_0_oklch(0.18_0_0)]",
        ghost: "hover:bg-accent hover:text-accent-foreground shadow-none",
        link: "text-primary underline-offset-4 hover:underline shadow-none",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
