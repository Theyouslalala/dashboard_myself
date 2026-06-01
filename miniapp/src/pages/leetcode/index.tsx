import { View } from "@tarojs/components";
import { useDidShow } from "@tarojs/taro";
import { useDashboard } from "../../store";
import LeetCodeCard from "../../components/LeetCodeCard";
import Loading from "../../components/Loading";
import "./index.scss";

export default function LeetCodePage() {
  const { state, fetchLeetCode } = useDashboard();
  const { data, loading } = state.leetcode;

  useDidShow(() => {
    if (!data && !loading) {
      fetchLeetCode();
    }
  });

  return (
    <View className="leetcode-page">
      {loading && !data ? (
        <Loading />
      ) : (
        <View className="leetcode-page-content">
          <LeetCodeCard />
        </View>
      )}
    </View>
  );
}
