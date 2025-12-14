import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient:
          "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg transition-all duration-300 ease-in-out hover:from-purple-600 hover:to-blue-600 hover:shadow-xl hover:scale-105",
        gradientOutline:
          "relative bg-card text-foreground p-0 overflow-hidden group hover:shadow-lg transition-all duration-300 rounded-md",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    if (variant === "gradientOutline") {
      const buttonContent = (
        <span className="relative z-10 flex h-full w-full items-center justify-center bg-background px-8 rounded-md transition-colors group-hover:bg-background/90">
          <span className="absolute -left-1.5 top-0 h-full w-4 bg-purple-500 rounded-l-md blur-sm group-hover:bg-purple-600 transition-colors" />
          <span className="absolute -right-1.5 top-0 h-full w-4 bg-blue-500 rounded-r-md blur-sm group-hover:bg-blue-600 transition-colors" />
          {props.children}
        </span>
      );

      if (asChild) {
        return (
          <Slot
            className={cn(buttonVariants({ variant, size, className }))}
            ref={ref}
            {...props}
          >
           {/* We need to wrap the children of Slot with a span to make it a single child */}
            <>{buttonContent}</>
          </Slot>
        )
      }

      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {buttonContent}
        </Comp>
      )
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
