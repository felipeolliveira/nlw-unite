import { ActivityIndicator } from "react-native"

export type LoadingProps = {}

export function Loading(props: LoadingProps) {
  return (
    <ActivityIndicator size={60} className="flex-1 justify-center items-center bg-green-500 text-orange-500" />
  )
}
