import { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/lib/utils'

export type NavLinkProps = ComponentPropsWithoutRef<'a'>

export function NavLink({ className, children, ...props }: NavLinkProps) {
  return (
    <a
      className={cn(['text-sm font-medium text-muted-foreground', className])}
      {...props}
    >
      {children}
    </a>
  )
}
