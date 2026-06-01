import { View, Text } from "@tarojs/components";
import { useDidShow } from "@tarojs/taro";
import { useDashboard } from "../../store";
import Header from "../../components/Header";
import GitHubCard from "../../components/GitHubCard";
import LeetCodeCard from "../../components/LeetCodeCard";
import SteamSection from "../../components/SteamSection";
import Loading from "../../components/Loading";
import "./index.scss";

export default function Index() {
  const { state, fetchAll } = useDashboard();
  const { mode, github, leetcode, steam } = state;
  const showSteam = mode !== "professional";
  const isLoading = github.loading && leetcode.loading && steam.loading;

  useDidShow(() => {
    // 首次进入时加载数据
    if (!github.data && !github.loading) {
      fetchAll();
    }
  });

  return (
    <View className="index-page">
      <Header />

      {isLoading && !github.data ? (
        <Loading text="加载 Dashboard..." />
      ) : (
        <View className="index-content">
          {/* GitHub 摘要 */}
          <View className="index-card card">
            <View className="card-header">
              <Text className="card-title">GitHub</Text>
            </View>
            <GitHubCard compact />
          </View>

          {/* LeetCode 摘要 */}
          <View className="index-card card">
            <View className="card-header">
              <Text className="card-title">LeetCode</Text>
            </View>
            <LeetCodeCard compact />
          </View>

          {/* Steam 摘要 */}
          {showSteam && (
            <View className="index-card card">
              <View className="card-header">
                <Text className="card-title">Steam</Text>
              </View>
              <SteamSection compact />
            </View>
          )}
        </View>
      )}
    </View>
  );
}
