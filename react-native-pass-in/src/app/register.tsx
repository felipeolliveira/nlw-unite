import { ActivityIndicator, Alert, Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Link } from 'expo-router';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { StatusBar } from 'expo-status-bar';
import { Container } from '@/components/container';
import { api } from '@/server/api';
import { useQuery } from '@tanstack/react-query';
import { PaginationModel } from '@/models/pagination-model';
import { EventModel } from '@/models/event-model';
import { Text } from '@/components/text';
import { colors } from '@/styles/colors';
import { Header } from '@/components/header';
import { EventLogo } from '@/components/event-logo';
import { AxiosError } from 'axios';
import { router } from 'expo-router';

const credentialFormSchema = z.object({
  name: z.string({
    required_error: "Nome obrigatório"
  }).min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: z.string({
    required_error: "E-mail obrigatório"
  }).email('Informe um e-mail válido'),
  event: z.object({
    id: z.string(),
    slug: z.string(),
    title: z.string(),
    imageUrl: z.string().nullable()
  }, {
    required_error: "Selecione um evento"
  })
})

type CredentialFormData = z.infer<typeof credentialFormSchema>

export default function Register() {
  const { control, handleSubmit, formState: { isSubmitting } } = useForm<CredentialFormData>({
    resolver: zodResolver(credentialFormSchema)
  })

  const { data: events, isLoading, refetch } = useQuery<PaginationModel<EventModel>>({
    queryKey: ['events'],
    queryFn: async () => {
      const { data } = await api.get('/events')
      return data
    }
  })

  async function handleSubmitCredential({ email, event, name }: CredentialFormData) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      await api.post(`/events/${event.id}/attendees`, {
        name,
        email
      })

      Alert.alert('Inscrição', 'Inscrição realizada com sucesso!', [
        { text: 'Ok', onPress: () => router.replace('/ticket') }
      ])
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          return Alert.alert('Inscrição', "Este e-mail já foi cadastrado em um evento")
        }
      }

      Alert.alert('Erro', 'Ocorreu um erro desconhecido ao realizar a inscrição')
    }
  }

  if (isLoading) {
    return (
      <Container className="justify-center items-center gap-2">
        <ActivityIndicator size={40} color={colors.orange[500]} />
        <Text className='text-2xl text-orange-500'>Carregando eventos</Text>
      </Container>
    )
  }

  if (!events) {
    return (
      <Container className="justify-center items-center gap-6">
        <Text className='text-2xl'>Nenhum evento encontrado</Text>
        <Button title="Tentar novamente" isLoading={isLoading} onPress={() => refetch()} />
        <Link href="/" className='text-gray-100 text-base font-bold text-center mt-8'>
          Já possui ingresso? Voltar!
        </Link>
      </Container>
    )
  }

  return (
    <Controller
      control={control}
      name='event'
      render={({ field: { onChange, value } }) => {
        if (!value && events) {
          return (
            <Container className="p-0">
              <StatusBar style="light" />
              <Header title='Selecione um evento' />

              <ScrollView>
                <View className='flex-1 flex-row flex-wrap'>
                  {events.data.map(event => {
                    return (
                      <View key={event.id} className='w-full p-2'>
                        <TouchableOpacity activeOpacity={0.7} onPress={() => onChange({
                          id: event.id,
                          slug: event.slug,
                          title: event.title,
                          imageUrl: event.imageUrl
                        })}>
                          <View key={event.id} className='flex-row p-4 gap-4 items-center border rounded-lg border-gray-700'>
                            <EventLogo imageUrl={event.imageUrl} />
                            <View className='flex-1'>
                              <Text className='text-xl text-orange-500'>{event.title}</Text>
                              <Text className='text-white/50'>tag: {event.slug}</Text>
                            </View>
                            <MaterialCommunityIcons name='chevron-right' size={24} color='white' className='opacity-50' />
                          </View>
                        </TouchableOpacity>
                      </View>
                    )
                  })}
                </View>
              </ScrollView>

              <Link href="/" className='text-gray-100 text-base font-bold text-center my-8 p-2'>
                Já possui ingresso? Voltar!
              </Link>

            </Container>
          )
        }

        return (
          <Container className="justify-center items-center">
            <StatusBar style="light" />

            <EventLogo imageUrl={value?.imageUrl} title={value.title} className='size-32' />
            {value.imageUrl && <Text className='text-orange-500 text-2xl text-center mt-4'>{value.title}</Text>}

            <View className='w-full mt-12 gap-3'>
              <Controller
                control={control}
                name='name'
                render={({ field: { onBlur, onChange, value }, formState: { errors } }) => (
                  <Input errorMessage={errors.name?.message}>
                    <Input.Icon IconFamily={MaterialCommunityIcons} name='account-circle-outline' size={20} color='white' />
                    <Input.Field onBlur={onBlur} onChangeText={onChange} value={value} placeholder='Nome completo' />
                  </Input>
                )}
              />
              <Controller
                control={control}
                name='email'
                render={({ field: { onBlur, onChange, value }, formState: { errors } }) => (
                  <Input errorMessage={errors.email?.message}>
                    <Input.Icon IconFamily={MaterialCommunityIcons} name='email-outline' size={20} color='white' />
                    <Input.Field onBlur={onBlur} onChangeText={onChange} value={value} placeholder='E-mail' keyboardType='email-address' />
                  </Input>
                )}
              />

              <Button title="Realizar inscrição" isLoading={isSubmitting} onPress={handleSubmit(handleSubmitCredential)} />

              <Link href="/" className='text-gray-100 text-base font-bold text-center mt-8'>
                Já possui ingresso? Voltar!
              </Link>

              <TouchableOpacity activeOpacity={0.7} onPress={() => onChange(undefined)} className='p-2 mt-12 self-center flex-row items-center gap-2'>
                <MaterialCommunityIcons name='arrow-left' size={24} color={colors.orange[500]} />
                <Text className='text-orange-500'>Escolher outro evento</Text>
              </TouchableOpacity>
            </View>

          </Container>
        )
      }}
    />
  );
}
