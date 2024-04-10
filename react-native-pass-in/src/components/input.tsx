import { ComponentProps, ElementType, createContext, useContext } from "react"
import { TextInput, TextInputProps, View, ViewProps } from "react-native"
import * as tailwindColors from "tailwindcss/colors"

import { colors } from "@/styles/colors"
import { cn } from "@/utils/class-merge"
import { Text } from "./text"
import { MaterialCommunityIcons, createIconSet } from "@expo/vector-icons"


type InputContextProps = {
  errorMessage?: string
}

const InputContext = createContext({} as InputContextProps)

type InputProps = ViewProps & {
  errorMessage?: string
}

function Input({ className, errorMessage, ...props }: InputProps) {
  return (
    <InputContext.Provider value={{ errorMessage }}>
      <View className="gap-1">
        <View className={cn(
          "w-full h-14 flex-row items-center gap-3 p-3 border border-green-400 rounded-lg",
          errorMessage && 'border-rose-500',
          className
        )} {...props} />
        {errorMessage && (
          <Text className="text-rose-500">{errorMessage}</Text>
        )}
      </View>
    </InputContext.Provider>
  )
}

type FieldProps = TextInputProps

function Field({ className, placeholderTextColor, ...props }: FieldProps) {
  const { errorMessage } = useContext(InputContext)

  return (
    <TextInput
      className={cn(
        "flex-1 text-white text-base font-regular",
        errorMessage && 'text-rose-500',
        className
      )}
      placeholderTextColor={
        errorMessage
          ? tailwindColors.rose[500]
          : placeholderTextColor
            ? placeholderTextColor
            : colors.gray[300]
      }
      {...props}
    />
  )
}

type IconProps = ComponentProps<typeof MaterialCommunityIcons> & {
  IconFamily: ElementType
}

function Icon({ IconFamily, color, ...props }: IconProps) {
  const { errorMessage } = useContext(InputContext)

  return <IconFamily color={errorMessage ? tailwindColors.rose[500] : color} {...props} />
}

Input.Field = Field
Input.Icon = Icon

export type { InputProps, FieldProps }
export { Input }
