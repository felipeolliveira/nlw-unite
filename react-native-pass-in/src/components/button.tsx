import { cn } from "@/utils/class-merge"
import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps, View } from "react-native"

export type ButtonProps = TouchableOpacityProps & {
  title: string
  isLoading?: boolean
}

export function Button({ className, children, title, isLoading = false, ...props }: ButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={isLoading}
      className={cn(
        "w-full h-14 bg-orange-500 items-center justify-center rounded-lg",
        isLoading && "bg-orange-500/80",
        className
      )}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator className="text-white" />
      ) : (
        <Text className="text-green-500 textbase font-bold uppercase">
          {title}
        </Text>
      )}

    </TouchableOpacity>
  )
}
