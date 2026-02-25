import { forwardRef } from 'react';
import { Link as RouterLink, type LinkProps as RouterLinkProps } from 'react-router-dom';
import { cn } from './Button';

export interface LinkProps extends RouterLinkProps {
  variant?: 'primary' | 'ghost' | 'none';
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant = 'none', ...props }, ref) => {
    const variants = {
      primary: 'text-primary hover:underline font-medium',
      ghost: 'hover:bg-black/5 rounded-lg transition-colors',
      none: '',
    };

    return (
      <RouterLink
        ref={ref}
        className={cn(variants[variant], className)}
        {...props}
      />
    );
  }
);

Link.displayName = 'Link';

export { Link };
