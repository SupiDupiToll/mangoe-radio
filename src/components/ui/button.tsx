import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap text-sm font-medium outline-none transition-colors select-none focus-visible:ring-[3px] focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground active:bg-primary/85',
        destructive: 'bg-red-500 text-white active:bg-red-500/85',
        outline:
          'border border-border bg-card text-foreground active:bg-muted',
        secondary: 'bg-muted text-foreground active:bg-input',
        ghost: 'text-foreground active:bg-muted',
        link: 'text-primary underline-offset-4 hover:underline'
      },
      size: {
        default: 'h-10 rounded-xl px-4',
        sm: 'h-9 rounded-lg px-3 text-[13px]',
        lg: 'h-12 rounded-2xl px-6 text-[15px]',
        icon: 'size-10 rounded-full',
        iconSm: 'size-8 rounded-full [&_svg]:size-4'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp: React.ElementType = asChild ? Slot.Root : 'button'
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
