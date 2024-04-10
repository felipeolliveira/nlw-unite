import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Alert, Modal, ScrollView, Share, TouchableOpacity, View } from "react-native";
import * as ImagePicker from 'expo-image-picker';

import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { CredentialCard } from "@/components/credential-card";
import { Header } from "@/components/header";
import { Text } from "@/components/text";
import { colors } from "@/styles/colors";
import { QRCode } from "@/components/qrcode";
import { badgeActions, useBadge, useBadgeImage } from "@/store/attendee-badge-store";
import { Redirect } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { PaginationModel } from "@/models/pagination-model";
import { EventModel } from "@/models/event-model";
import { api } from "@/server/api";
import { MotiView } from 'moti'

export default function Ticket() {
  const badge = useBadge()
  const badgeImage = useBadgeImage()
  const [isQRCodeExpanded, setIsQRCodeExpanded] = useState(false)

  const { data: event } = useQuery<EventModel>({
    queryKey: ['events', 'single', badge?.eventId],
    queryFn: async () => {
      const { data } = await api.get(`/events/${badge?.eventId}`)
      return data.event
    }
  })

  async function handleImagePicker() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
      })

      if (result.assets && result.assets.length > 0) {
        badgeActions.setBadgeImage(result.assets[0].uri)
      }
    } catch (e) {
      console.log(e)
      Alert.alert('Foto', "Não foi possível selecionar a imagem.")
    }
  }

  async function handleShare() {
    try {
      if (!badge) return

      await Share.share({
        message: badge.checkInUrl,
        title: `Credencial para o evento ${event?.title}`
      })
    } catch (e) {
      Alert.alert('Compartilhar', "Não foi possível compartilhar a credencial.")
    }
  }

  if (!badge) return <Redirect href="/" />

  return (
    <Container className="p-0">
      <StatusBar style="light" />
      <Header title="Minhas credenciais" />

      <ScrollView
        className="-mt-28 -z-10"
        contentContainerClassName="px-8 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <CredentialCard
          event={event}
          badge={badge}
          imageUri={badgeImage}
          onChangeAvatar={handleImagePicker}
          onZoomQRCode={() => setIsQRCodeExpanded(true)}
        />

        <MotiView
          from={{
            translateY: 0
          }}
          animate={{
            translateY: 10
          }}
          transition={{
            loop: true,
            type: 'timing',
            duration: 700,
          }}
        >
          <MaterialCommunityIcons
            name="chevron-double-down"
            size={24}
            color={colors.gray[300]}
            className="self-center my-6"
          />
        </MotiView>


        <Text className="text-white font-bold text-2xl mt-4">Compartilhar credencial</Text>
        <Text className="mt-1 mb-6" >Mostre ao mundo que você vai participar do {event?.title}!</Text>
        <Button title="compartilhar" onPress={handleShare} />
        <TouchableOpacity
          activeOpacity={0.7}
          className="mt-10"
          onPress={badgeActions.remove}
        >
          <Text className="text-center font-bold">Remover Ingresso</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={isQRCodeExpanded} transparent statusBarTranslucent animationType="slide">
        <View className="flex-1 bg-green-500/95 items-center justify-center">
          <TouchableOpacity activeOpacity={0.7} onPress={() => setIsQRCodeExpanded(false)}>
            <QRCode value={badge.checkInUrl} size={300} />
            <Text className="text-center fontbold mt-10 text-orange-500">Clique para fechar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </Container>
  )
}