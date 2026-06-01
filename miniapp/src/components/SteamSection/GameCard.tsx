import { View, Image, Text } from "@tarojs/components";
import { memo } from "react";
import { formatPlaytime, getLastPlayedText } from "../../utils/format";
import type { SteamGameView } from "../../types";

function GameCard({ game }: { game: SteamGameView }) {
  const coverUrl = `https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/header.jpg`;

  return (
    <View className="game-card">
      <Image
        className="game-card-cover"
        src={coverUrl}
        mode="aspectFill"
        lazyLoad
      />
      <View className="game-card-info">
        <Text className="game-card-name">{game.name}</Text>
        <Text className="game-card-time">
          {formatPlaytime(game.playtimeForever)}
        </Text>
        <Text className="game-card-last">
          {getLastPlayedText(game.lastPlayed)}
        </Text>
      </View>
    </View>
  );
}

export default memo(GameCard);
