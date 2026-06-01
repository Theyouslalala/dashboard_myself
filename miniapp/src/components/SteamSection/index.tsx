import { View, Text, ScrollView } from "@tarojs/components";
import { useDashboard } from "../../store";
import { formatPlaytime } from "../../utils/format";
import Loading from "../Loading";
import GameCard from "./GameCard";
import StatsChart from "./StatsChart";
import "./index.scss";

export default function SteamSection({ compact = false }: { compact?: boolean }) {
  const { state } = useDashboard();
  const { data, loading, error } = state.steam;

  if (loading) return <Loading text="加载 Steam..." />;
  if (error) return <View className="card error-card">{error}</View>;
  if (!data) return null;

  const { stats, games } = data;

  return (
    <View className="steam-section">
      {/* 统计概览 */}
      <View className="steam-stats">
        <View className="steam-stat">
          <Text className="steam-stat-num">{stats.totalGames}</Text>
          <Text className="steam-stat-label">游戏</Text>
        </View>
        <View className="steam-stat">
          <Text className="steam-stat-num">
            {formatPlaytime(stats.totalPlaytime)}
          </Text>
          <Text className="steam-stat-label">总时长</Text>
        </View>
        <View className="steam-stat">
          <Text className="steam-stat-num">{stats.recentGamesCount}</Text>
          <Text className="steam-stat-label">近 2 周</Text>
        </View>
      </View>

      {/* Top 10 柱状图 */}
      {!compact && (
        <View className="steam-chart">
          <Text className="section-subtitle">游玩时长 Top 10</Text>
          <StatsChart games={games} />
        </View>
      )}

      {/* 游戏卡片列表 */}
      <View className="steam-games">
        <Text className="section-subtitle">
          {compact ? "最近游玩" : "全部游戏"}
        </Text>
        <ScrollView scrollY className="steam-games-scroll">
          {games.slice(0, compact ? 3 : 20).map((game) => (
            <GameCard key={game.appid} game={game} />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
