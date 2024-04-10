import { Alert, Image, View } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Link, Redirect } from 'expo-router';
import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { StatusBar } from 'expo-status-bar';
import { Text } from '@/components/text';
import { Controller, useForm } from 'react-hook-form';
import { Container } from '@/components/container';
import { api } from '@/server/api';
import { AttendeeBadgeModel } from '@/models/attendee-badge-model';
import { badgeActions, useBadge } from '@/store/attendee-badge-store';
import { AxiosError } from 'axios';

const ticketFormSchema = z.object({
  ticket: z.string({
    required_error: "Informe o código do ingresso"
  }).min(3, 'O código do ingresso deve ter no mínimo 3 caracteres'),
})

type TicketFormData = z.infer<typeof ticketFormSchema>

export default function Home() {
  const badge = useBadge()
  const { control, handleSubmit } = useForm<TicketFormData>({
    resolver: zodResolver(ticketFormSchema)
  })

  const { mutateAsync: handleGetAttendeeBadge, isPending } = useMutation({
    mutationKey: ['attendees', 'ticket'],
    mutationFn: async ({ ticket }: TicketFormData) => {
      const response = await api.get<{ badge: AttendeeBadgeModel }>(`/attendees/ticket/${ticket.toUpperCase()}/badge`)
      return response.data.badge
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 404) {
        return Alert.alert('Ingresso não encontrado', 'Verifique o código do ingresso e tente novamente.')
      }
      return Alert.alert('Ingresso', 'Não foi possível acessar o ingresso. Tente novamente.')
    },
    onSuccess: (badge) => {
      badgeActions.set(badge)
    }
  })

  async function handleSubmitTicket(data: TicketFormData) {
    await handleGetAttendeeBadge(data)
  }

  if (badge?.checkInUrl) return <Redirect href='/ticket' />

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
                autoCapitalize='characters'
                keyboardType='default'
                placeholder='Código do ingresso'
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
              />
            </Input>
          )}
        />
        <Button title="Acessar credencial" onPress={handleSubmit(handleSubmitTicket)} isLoading={isPending} />

        <Link href="/register" className='text-gray-100 text-base font-bold text-center mt-8'>
          Ainda não possui ingresso?
        </Link>
      </View>

    </Container>
  );
}
