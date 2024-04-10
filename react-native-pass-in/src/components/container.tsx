import { cn } from "@/utils/class-merge"
import { View, ViewProps } from "react-native"

export type ContainerProps = ViewProps

export function Container({ className, ...props }: ContainerProps) {
  return (
    <View
      className={cn(
        "flex-1 bg-green-500 p-8",
        className
      )}
      {...props}
    />
  )
}
