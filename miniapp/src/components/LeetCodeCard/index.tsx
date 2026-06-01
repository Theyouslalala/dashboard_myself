import { View, Text } from "@tarojs/components";
import { useDashboard } from "../../store";
import { formatNumber } from "../../utils/format";
import Loading from "../Loading";
import DifficultyBar from "./DifficultyBar";
import "./index.scss";

export default function LeetCodeCard({
  compact = false,
}: {
  compact?: boolean;
}) {
  const { state } = useDashboard();
  const { data, loading, error } = state.leetcode;

  if (loading) return <Loading text="加载 LeetCode..." />;
  if (error) return <View className="card error-card">{error}</View>;
  if (!data) return null;

  return (
    <View className="leetcode-card">
      {/* 总览 */}
      <View className="leetcode-overview">
        <View className="leetcode-total">
          <Text className="leetcode-total-num">{data.totalSolved}</Text>
          <Text className="leetcode-total-label">已解题</Text>
        </View>
        <View className="leetcode-meta">
          <View className="leetcode-meta-item">
            <Text className="meta-label">排名</Text>
            <Text className="meta-value">{formatNumber(data.ranking)}</Text>
          </View>
          <View className="leetcode-meta-item">
            <Text className="meta-label">积分</Text>
            <Text className="meta-value">{data.contributionPoints}</Text>
          </View>
        </View>
      </View>

      {/* 难度进度条 */}
      {!compact && (
        <View className="leetcode-difficulties">
          <DifficultyBar
            label="Easy"
            solved={data.easySolved}
            total={data.totalEasy}
            color="#34d399"
          />
          <DifficultyBar
            label="Medium"
            solved={data.mediumSolved}
            total={data.totalMedium}
            color="#fb923c"
          />
          <DifficultyBar
            label="Hard"
            solved={data.hardSolved}
            total={data.totalHard}
            color="#f87171"
          />
        </View>
      )}
    </View>
  );
}
