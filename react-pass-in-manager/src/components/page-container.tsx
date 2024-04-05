import { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/lib/utils'

export type PageContainerProps = ComponentPropsWithoutRef<'div'>

export function PageContainer({
  className,
  children,
  ...props
}: PageContainerProps) {
  return (
    <main
      className={cn(['mx-auto max-w-[1216px] px-5 py-5', className])}
      {...props}
    >
      {children}
    </main>
  )
}
