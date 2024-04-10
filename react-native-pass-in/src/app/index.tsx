import { Alert, Image, View } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Link } from 'expo-router';
import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'

import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { StatusBar } from 'expo-status-bar';
import { Text } from '@/components/text';
import { Controller, useForm } from 'react-hook-form';
import { Container } from '@/components/container';

const ticketFormSchema = z.object({
  ticket: z.string({
    required_error: "Informe o código do ingresso"
  }).min(3, 'O código do ingresso deve ter no mínimo 3 caracteres'),
})

type TicketFormData = z.infer<typeof ticketFormSchema>

export default function Home() {
  const { control, handleSubmit } = useForm<TicketFormData>({
    resolver: zodResolver(ticketFormSchema)
  })

  function handleSubmitTicket(data: TicketFormData) {
    Alert.alert(`Ticket`, data.ticket)
  }

  return (
    <Container className="justify-center items-center">
      <StatusBar style="light" />

      <Image source={require('@/assets/logo.png')} className="h-16" resizeMode='contain' />

      <View className='w-full mt-12 gap-3'>
        <Controller
          control={control}
          name='ticket'
          render={({ field: { onBlur, onChange, value }, formState: { errors } }) => (
            <Input errorMessage={errors.ticket?.message}>
              <Input.Icon IconFamily={MaterialCommunityIcons} name='ticket-confirmation-outline' size={20} color='white' />
              <Input.Field
                placeholder='Código do ingresso'
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
              />
            </Input>
          )}
        />
        <Button title="Acessar credencial" onPress={handleSubmit(handleSubmitTicket)} />

        <Link href="/register" className='text-gray-100 text-base font-bold text-center mt-8'>
          Ainda não possui ingresso?
        </Link>
      </View>

    </Container>
  );
}
