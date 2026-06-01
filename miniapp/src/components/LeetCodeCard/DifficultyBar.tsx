import { View, Text } from "@tarojs/components";

interface DifficultyBarProps {
  label: string;
  solved: number;
  total: number;
  color: string;
}

export default function DifficultyBar({
  label,
  solved,
  total,
  color,
}: DifficultyBarProps) {
  const pct = total > 0 ? Math.round((solved / total) * 100) : 0;

  return (
    <View className="difficulty-bar">
      <View className="difficulty-bar-header">
        <Text className="difficulty-bar-label" style={{ color }}>
          {label}
        </Text>
        <Text className="difficulty-bar-count">
          {solved} / {total}
        </Text>
      </View>
      <View className="difficulty-bar-track">
        <View
          className="difficulty-bar-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </View>
      <Text className="difficulty-bar-pct">{pct}%</Text>
    </View>
  );
}
