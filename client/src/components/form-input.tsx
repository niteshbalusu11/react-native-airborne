import { Text, TextInput, View } from "react-native";

type FormInputProps = {
  label: string;
  value: string;
  placeholder?: string;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  secureTextEntry?: boolean;
  onChangeText: (value: string) => void;
};

export function FormInput({
  label,
  value,
  placeholder,
  autoCapitalize = "none",
  secureTextEntry = false,
  onChangeText,
}: FormInputProps) {
  return (
    <View className="gap-2">
      <Text className="text-sm font-medium text-zinc-800 dark:text-zinc-100">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        className="rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        placeholderTextColor="#71717a"
      />
    </View>
  );
}
