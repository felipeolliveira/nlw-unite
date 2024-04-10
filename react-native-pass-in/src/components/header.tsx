import { View } from "react-native"
import { Text } from "./text"

export type HeaderProps = {
  title: string
}

export function Header({ title }: HeaderProps) {
  return (
    <View className="w-full flex-row h-28 items-end bg-black/20 px-8 pb-4 border border-white/10" >
      <Text className="flex-1 text-lg text-center">
        {title}
      </Text>
    </View>
  )
}
