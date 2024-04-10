import { Image, View } from "react-native"
import { Text } from "./text"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { colors } from "@/styles/colors"
import { cn } from "@/utils/class-merge"
import { api } from "@/server/api"

type EventLogoProps = {
  title?: string
  imageUrl?: string | null
  className?: string
}

export function EventLogo({ imageUrl, title, className }: EventLogoProps) {
  // const eventLogoBySlug = {
  //   'unite': () => require('@/assets/logo.png'),
  //   'evento-react': () => require('@/assets/logo.png'),
  // } as Record<string, any>

  if (!imageUrl) {
    return (
      <View className={cn(
        "size-20 bg-orange-500/10 rounded-lg justify-center items-center",
        className
      )}>
        <MaterialCommunityIcons name="badge-account-horizontal-outline" size={28} color={colors.orange[500]} className="opacity-70" />
        {title && <Text className="mt-2 text-center font-bold text-xl text-orange-500">{title}</Text>}
      </View>
    )
  }

  return (
    <View className={cn(
      "size-20 bg-orange-500/10 rounded-lg justify-center items-center p-3",
      className
    )}>
      <Image source={{ uri: `${api.defaults.baseURL}/${imageUrl}` }} className="size-full" resizeMode='contain' />
    </View>
  )
}