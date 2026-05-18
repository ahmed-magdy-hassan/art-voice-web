import { cva, type VariantProps } from 'class-variance-authority'

// Mossy Studio button. Base + variants compose into the .btn-* CSS
// defined in src/assets/css/tailwind.css.
export const buttonVariants = cva('btn', {
  variants: {
    variant: {
      default: 'btn-primary',
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      ghost: 'btn-ghost',
      destructive: 'btn-danger',
      outline: 'btn-secondary',
      link: 'btn-ghost underline-offset-4 hover:underline',
    },
    size: {
      default: '',
      sm: 'btn-sm',
      lg: 'btn-lg',
      icon: 'btn-icon',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

export type ButtonVariants = VariantProps<typeof buttonVariants>
