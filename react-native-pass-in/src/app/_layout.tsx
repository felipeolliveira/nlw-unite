import "@/styles/global.css";

import { Roboto_700Bold, Roboto_500Medium, Roboto_400Regular } from "@expo-google-fonts/roboto"
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { Loading } from "@/components/loading";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/utils/query-client";


export default function Layout() {
  const [fontsLoaded, _fontsError] = useFonts({
    Roboto_700Bold,
    Roboto_500Medium,
    Roboto_400Regular
  })

  if (!fontsLoaded) return <Loading />

  return (
    <QueryClientProvider client={queryClient}>
      <Slot />
    </QueryClientProvider>
  )
}