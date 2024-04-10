import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Alert, Modal, ScrollView, TouchableOpacity, View } from "react-native";
import * as ImagePicker from 'expo-image-picker';

import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { CredentialCard } from "@/components/credential-card";
import { Header } from "@/components/header";
import { Text } from "@/components/text";
import { colors } from "@/styles/colors";
import { QRCode } from "@/components/qrcode";

export default function Ticket() {
  const [isQRCodeExpanded, setIsQRCodeExpanded] = useState(false)
  const [image, setImage] = useState<string | null>(null)

  async function handleImagePicker() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
      })

      if (result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri)
      }
    } catch (e) {
      console.log(e)
      Alert.alert('Foto', "Não foi possível selecionar a imagem.")
    }
  }

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
          imageUri={image}
          onChangeAvatar={handleImagePicker}
          onZoomQRCode={() => setIsQRCodeExpanded(true)}
        />

        <MaterialCommunityIcons
          name="chevron-double-down"
          size={24}
          color={colors.gray[300]}
          className="self-center my-6"
        />


        <Text className="text-white font-bold text-2xl mt-4">Compartilhar credencial</Text>
        <Text className="mt-1 mb-6" >Mostre ao mundo que você vai participar do Unite Summit!</Text>
        <Button title="compartilhar" />
        <TouchableOpacity
          activeOpacity={0.7}
          className="mt-10"
        >
          <Text className="text-center font-bold">Remover Ingresso</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={isQRCodeExpanded} transparent statusBarTranslucent animationType="slide">
        <View className="flex-1 bg-green-500/95 items-center justify-center">
          <TouchableOpacity activeOpacity={0.7} onPress={() => setIsQRCodeExpanded(false)}>
            <QRCode value="teste" size={300} />
            <Text className="text-center fontbold mt-10 text-orange-500">Clique para fechar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </Container>
  )
}