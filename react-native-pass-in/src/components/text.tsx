import { cn } from '@/utils/class-merge'
import { TextProps as NativeTextProps, Text as NativeText } from 'react-native'

export type TextProps = NativeTextProps

export function Text({ className, ...props }: TextProps) {
  return (
    <NativeText
      className={cn(
        "text-white text-base font-medium",
        className,
      )}
      {...props}
    />
  )
}
