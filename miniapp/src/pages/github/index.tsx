import { View } from "@tarojs/components";
import { useDidShow } from "@tarojs/taro";
import { useDashboard } from "../../store";
import GitHubCard from "../../components/GitHubCard";
import Loading from "../../components/Loading";
import "./index.scss";

export default function GitHubPage() {
  const { state, fetchGitHub } = useDashboard();
  const { data, loading } = state.github;

  useDidShow(() => {
    if (!data && !loading) {
      fetchGitHub();
    }
  });

  return (
    <View className="github-page">
      {loading && !data ? (
        <Loading />
      ) : (
        <View className="github-page-content">
          <GitHubCard />
        </View>
      )}
    </View>
  );
}
