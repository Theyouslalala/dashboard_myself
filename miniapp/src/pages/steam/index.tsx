import { View } from "@tarojs/components";
import { useDidShow } from "@tarojs/taro";
import { useDashboard } from "../../store";
import SteamSection from "../../components/SteamSection";
import Loading from "../../components/Loading";
import "./index.scss";

export default function SteamPage() {
  const { state, fetchSteam } = useDashboard();
  const { data, loading } = state.steam;

  useDidShow(() => {
    if (!data && !loading) {
      fetchSteam();
    }
  });

  return (
    <View className="steam-page">
      {loading && !data ? (
        <Loading />
      ) : (
        <View className="steam-page-content">
          <SteamSection />
        </View>
      )}
    </View>
  );
}
