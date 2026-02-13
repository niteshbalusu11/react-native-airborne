import type { ReactNode } from "react";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";

type FormInputProps = {
  label: string;
  value: string;
  placeholder?: string;
  hint?: string;
  keyboardType?: "default" | "email-address" | "number-pad" | "numeric" | "phone-pad";
  autoComplete?: "off" | "email" | "password" | "one-time-code" | "name" | "username" | "tel";
  textContentType?:
    | "none"
    | "emailAddress"
    | "password"
    | "oneTimeCode"
    | "name"
    | "username"
    | "telephoneNumber";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  secureTextEntry?: boolean;
  labelRight?: ReactNode;
  onChangeText: (value: string) => void;
};

export function FormInput({
  label,
  value,
  placeholder,
  hint,
  keyboardType = "default",
  autoComplete = "off",
  textContentType = "none",
  autoCapitalize = "none",
  secureTextEntry = false,
  labelRight,
  onChangeText,
}: FormInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{label}</Text>
        {labelRight}
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        autoComplete={autoComplete}
        textContentType={textContentType}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`rounded-2xl border px-4 py-3.5 text-base text-zinc-900 dark:text-zinc-100 ${
          isFocused
            ? "border-zinc-500 bg-white dark:border-zinc-400 dark:bg-zinc-900"
            : "border-zinc-300 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
        }`}
        placeholderTextColor="#71717a"
      />
      {hint ? <Text className="text-xs text-zinc-500 dark:text-zinc-400">{hint}</Text> : null}
    </View>
  );
}
