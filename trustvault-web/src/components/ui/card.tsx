import * as React from 'react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// UI UX PRO MAX — Double-Bezel Card Architecture
// ─────────────────────────────────────────────────────────────────────────────

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'group relative rounded-3xl p-1.5 transition-all duration-300',
        'bg-gradient-to-b from-white/[0.04] to-white/[0.01]',
        'border border-white/[0.05] shadow-[0_8px_32px_-12px_rgba(0,0,0,0.5)]',
        'hover:border-white/[0.08] hover:shadow-[0_12px_48px_-12px_rgba(0,0,0,0.6)]',
        className
      )}
      {...props}
    >
      <div className={cn(
        'relative h-full w-full rounded-[1.35rem] overflow-hidden',
        'bg-[var(--bg-surface)] border border-white/[0.03]',
        'shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
      )}>
        {/* Subtle radial glow on hover */}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(ellipse_at_top_right,rgba(0, 198, 174,0.08)_0%,transparent_50%)]" />
        
        <div className="relative z-10 h-full">
          {children}
        </div>
      </div>
    </div>
  )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-2xl font-semibold leading-none tracking-tight font-display text-white', className)}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-slate-400', className)}
      {...props}
    />
  )
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };




