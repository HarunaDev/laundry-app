import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { SymbolWeight } from "expo-symbols";
import type {
  // ComponentProps,
  OpaqueColorValue,
  StyleProp,
  TextStyle,
} from "react-native";

import { ComponentProps } from "react";

const MAPPING = {
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "list.bullet": "list",
} as const;

export type IconSymbolName = keyof typeof MAPPING;

type MaterialIconName = ComponentProps<
  typeof MaterialIcons
>["name"];

interface IconSymbolProps {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: IconSymbolProps) {
  const iconName: MaterialIconName = MAPPING[name];

  return (
    <MaterialIcons
      color={color}
      size={size}
      name={iconName}
      style={style}
    />
  );
}