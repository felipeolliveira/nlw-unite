import { Image, ImageBackground, TouchableOpacity, View } from "react-native"

import { Text } from "./text"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { colors } from "@/styles/colors"
import { QRCode } from "./qrcode"

export type CredentialCardProps = {
  imageUri?: string | null
  onChangeAvatar?: () => void
  onZoomQRCode?: () => void
}

export function CredentialCard({ imageUri, onChangeAvatar, onZoomQRCode }: CredentialCardProps) {
  return (
    <View className="w-full self-stretch items-center">
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
            <Text className="text-zinc-50 text-sm font-bold">Unite summit</Text>
            <Text className="text-zinc-50 text-sm font-bold">#123</Text>

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
          Felipe Oliveira
        </Text>

        <Text className="font-regular text-base text-zinc-300 mb-4">
          felipe@email.com
        </Text>


        <TouchableOpacity activeOpacity={0.7} onPress={onZoomQRCode}>
          <QRCode value="teste-a-b" size={120} />
          <Text className="font-regular text-orange-500 text-sm mt-6 text-center">
            Ampliar QRCode
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
