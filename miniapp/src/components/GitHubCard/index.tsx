import { View, Text } from "@tarojs/components";
import { useDashboard } from "../../store";
import { formatNumber, getRelativeTime } from "../../utils/format";
import Loading from "../Loading";
import Heatmap from "./Heatmap";
import "./index.scss";

export default function GitHubCard({ compact = false }: { compact?: boolean }) {
  const { state } = useDashboard();
  const { data, loading, error } = state.github;

  if (loading) return <Loading text="加载 GitHub..." />;
  if (error) return <View className="card error-card">{error}</View>;
  if (!data) return null;

  const { user, repos, contributions } = data;

  // 计算总 star 数
  const totalStars = repos.reduce((sum, r) => sum + r.stars, 0);

  return (
    <View className="github-card">
      {/* 统计概览 */}
      <View className="github-stats">
        <View className="stat-block">
          <Text className="stat-block-num">{formatNumber(totalStars)}</Text>
          <Text className="stat-block-label">Stars</Text>
        </View>
        <View className="stat-block">
          <Text className="stat-block-num">{user.publicRepos}</Text>
          <Text className="stat-block-label">Repos</Text>
        </View>
        <View className="stat-block">
          <Text className="stat-block-num">{user.followers}</Text>
          <Text className="stat-block-label">Followers</Text>
        </View>
      </View>

      {/* 贡献热力图 */}
      <View className="github-heatmap">
        <Text className="section-subtitle">贡献热力图</Text>
        <Heatmap days={contributions} />
      </View>

      {/* 仓库列表（compact 模式只显示前 3 个） */}
      {!compact && (
        <View className="github-repos">
          <Text className="section-subtitle">最近更新</Text>
          {repos.slice(0, 6).map((repo) => (
            <View key={repo.name} className="repo-item">
              <View className="repo-header">
                <Text className="repo-name">{repo.name}</Text>
                {repo.language && (
                  <View className="repo-lang">
                    <View
                      className="repo-lang-dot"
                      style={{ background: getLangColor(repo.language) }}
                    />
                    <Text className="repo-lang-text">{repo.language}</Text>
                  </View>
                )}
              </View>
              {repo.description && (
                <Text className="repo-desc">{repo.description}</Text>
              )}
              <View className="repo-footer">
                <Text className="repo-stat">
                  ★ {repo.stars}
                </Text>
                <Text className="repo-stat">
                  ⑂ {repo.forks}
                </Text>
                <Text className="repo-time">
                  {getRelativeTime(repo.updatedAt)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function getLangColor(lang: string): string {
  const map: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    Python: "#3572A5",
    Java: "#b07219",
    Go: "#00ADD8",
    Rust: "#dea584",
    "C++": "#f34b7d",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Vue: "#41b883",
  };
  return map[lang] || "#6b7280";
}
