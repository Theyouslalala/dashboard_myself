import { View, Image, Text } from "@tarojs/components";
import { useDashboard } from "../../store";
import type { DashboardMode } from "../../types";
import "./index.scss";

const MODES: { key: DashboardMode; label: string }[] = [
  { key: "normal", label: "Normal" },
  { key: "professional", label: "Work" },
  { key: "gaming", label: "Gaming" },
];

export default function Header() {
  const { state, setMode } = useDashboard();
  const { github, mode } = state;
  const user = github.data?.user;

  return (
    <View className="header">
      {user && (
        <View className="header-profile">
          <Image
            className="header-avatar"
            src={user.avatarUrl}
            mode="aspectFill"
          />
          <View className="header-info">
            <Text className="header-name">{user.login}</Text>
            {user.bio && <Text className="header-bio">{user.bio}</Text>}
            <View className="header-stats">
              <Text className="stat-item">
                <Text className="stat-num">{user.publicRepos}</Text> repos
              </Text>
              <Text className="stat-item">
                <Text className="stat-num">{user.followers}</Text> followers
              </Text>
            </View>
          </View>
        </View>
      )}

      <View className="header-modes">
        {MODES.map((m) => (
          <View
            key={m.key}
            className={`mode-btn ${mode === m.key ? "mode-btn--active" : ""}`}
            onClick={() => setMode(m.key)}
          >
            <Text className="mode-btn-text">{m.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
