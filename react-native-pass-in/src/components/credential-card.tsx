import { Image, ImageBackground, TouchableOpacity, View, useWindowDimensions } from "react-native"
import { MotiView } from "moti"
import { MaterialCommunityIcons } from "@expo/vector-icons"

import { Text } from "./text"
import { colors } from "@/styles/colors"
import { QRCode } from "./qrcode"
import { AttendeeBadgeModel } from "@/models/attendee-badge-model"
import { EventModel } from "@/models/event-model"

export type CredentialCardProps = {
  event?: EventModel | null
  badge: AttendeeBadgeModel
  imageUri?: string | null
  onChangeAvatar?: () => void
  onZoomQRCode?: () => void
}

export function CredentialCard({ event, badge, imageUri, onChangeAvatar, onZoomQRCode }: CredentialCardProps) {
  const { height } = useWindowDimensions()

  return (
    <MotiView
      className="w-full self-stretch items-center"
      from={{
        opacity: 0,
        transform: [
          { translateY: -height },
          { rotateZ: '50deg' },
          { rotateX: '30deg' },
          { rotateY: '30deg' },
        ],
      }}
      animate={{
        opacity: 1,
        transform: [
          { translateY: 0 },
          { rotateZ: '0deg' },
          { rotateX: '0deg' },
          { rotateY: '0deg' },
        ],
      }}
      transition={{
        type: 'spring',
        damping: 20,
        rotateZ: {
          damping: 15,
          mass: 3
        }
      }}
    >
      <Image
        source={require('@/assets/ticket/band.png')}
        className="w-24 h-52 z-10"
      />

      <View className="bg-black/20 self-stretch items-center pb-6 border border-white/10 mx-3 rounded-2xl -mt-5">
        <ImageBackground
          source={require('@/assets/ticket/header.png')}
          className="px-6 py-8 h-40 items-center self-stretch border-b border-white/10 overflow-hidden"
        >
          <View className="w-full flex-row items-center justify-between">
            <Text className="text-zinc-50 text-sm font-bold">{event?.title ?? '...'}</Text>
            <Text className="text-zinc-50 text-sm font-bold">#{badge?.ticketCode ?? '...'}</Text>

          </View>

          <View className="size-40 bg-black rounded-full" />

        </ImageBackground>

        {imageUri ? (
          <TouchableOpacity activeOpacity={0.9} onPress={onChangeAvatar}>
            <Image
              source={{ uri: imageUri }}
              className="size-36 rounded-full -mt-24"
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.9}
            className="size-36 rounded-full -mt-24 bg-gray-400 items-center justify-center"
            onPress={onChangeAvatar}
          >
            <MaterialCommunityIcons name="camera-outline" color={colors.green[400]} size={32} />
          </TouchableOpacity>
        )}


        <Text className="font-bold text-2xl text-zinc-50 mt-4">
          {badge.name}
        </Text>

        <Text className="font-regular text-base text-zinc-300 mb-4">
          {badge.email}
        </Text>


        <TouchableOpacity activeOpacity={0.7} onPress={onZoomQRCode}>
          <QRCode value={badge.checkInUrl} size={120} />
          <Text className="font-regular text-orange-500 text-sm mt-6 text-center">
            Ampliar QRCode
          </Text>
        </TouchableOpacity>
      </View>
    </MotiView>
  )
}
