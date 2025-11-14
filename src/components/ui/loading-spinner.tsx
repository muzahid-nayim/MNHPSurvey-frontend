// src/components/ui/loading-spinner.tsx
'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

const spinnerVariants = cva(
  'animate-spin text-muted-foreground',
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface LoadingSpinnerProps
  extends VariantProps<typeof spinnerVariants> {
  className?: string;
}

export function LoadingSpinner({ size, className }: LoadingSpinnerProps) {
  return (
    <Loader2
      className={spinnerVariants({ size, className })}
      aria-label="Loading"
    />
  );
}