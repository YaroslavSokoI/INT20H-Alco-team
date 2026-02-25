import {type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-white hover:opacity-95',
      outline: 'border border-border bg-white hover:bg-black/5',
      ghost: 'hover:bg-black/5',
    };

    const sizes = {
      sm: 'px-3 py-1 text-xs rounded-md',
      md: 'px-4 py-1.5 text-sm rounded-lg',
      lg: 'px-6 py-2 text-base rounded-xl',
      icon: 'grid place-items-center rounded-lg',
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || props.disabled}
        className={cn(
          'inline-flex items-center justify-center transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 font-medium',
          variants[variant],
          size !== 'icon' && sizes[size],
          size === 'icon' && sizes.icon,
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            {children}
          </div>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, cn };
