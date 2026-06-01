import { Canvas } from "@tarojs/components";
import { useEffect, useRef, useCallback, useMemo } from "react";
import Taro from "@tarojs/taro";
import { formatPlaytime } from "../../utils/format";
import type { SteamGameView } from "../../types";

interface StatsChartProps {
  games: SteamGameView[];
}

export default function StatsChart({ games }: StatsChartProps) {
  const drawnRef = useRef(false);

  const top10 = useMemo(
    () =>
      [...games]
        .sort((a, b) => b.playtimeForever - a.playtimeForever)
        .slice(0, 10),
    [games]
  );

  const draw = useCallback(async () => {
    if (drawnRef.current || !top10.length) return;
    drawnRef.current = true;

    const query = Taro.createSelectorQuery();
    query
      .select("#stats-chart")
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res?.[0]?.node) return;

        const canvas = res[0].node;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = Taro.getSystemInfoSync().pixelRatio;
        const w = res[0].width;
        const h = res[0].height;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.scale(dpr, dpr);

        const maxTime = Math.max(...top10.map((g) => g.playtimeForever), 1);
        const barHeight = 20;
        const gap = 12;
        const labelWidth = 160;
        const valueWidth = 80;
        const barAreaWidth = w - labelWidth - valueWidth - 16;
        const startY = 10;

        ctx.clearRect(0, 0, w, h);

        top10.forEach((game, i) => {
          const y = startY + i * (barHeight + gap);
          const barWidth =
            (game.playtimeForever / maxTime) * barAreaWidth;

          // 游戏名
          ctx.fillStyle = "#94a3b8";
          ctx.font = "11px sans-serif";
          ctx.textAlign = "right";
          ctx.textBaseline = "middle";
          const name =
            game.name.length > 12
              ? game.name.slice(0, 12) + "…"
              : game.name;
          ctx.fillText(name, labelWidth - 8, y + barHeight / 2);

          // 柱状条
          const gradient = ctx.createLinearGradient(
            labelWidth,
            0,
            labelWidth + barWidth,
            0
          );
          gradient.addColorStop(0, "#22d3ee");
          gradient.addColorStop(1, "#a78bfa");
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.roundRect(labelWidth, y, Math.max(barWidth, 4), barHeight, 4);
          ctx.fill();

          // 时长
          ctx.fillStyle = "#94a3b8";
          ctx.font = "10px sans-serif";
          ctx.textAlign = "left";
          ctx.fillText(
            formatPlaytime(game.playtimeForever),
            labelWidth + barWidth + 8,
            y + barHeight / 2
          );
        });
      });
  }, [top10]);

  useEffect(() => {
    draw();
  }, [draw]);

  if (!top10.length) return null;

  const chartHeight = top10.length * 32 + 20;

  return (
    <Canvas
      id="stats-chart"
      type="2d"
      className="stats-chart-canvas"
      style={{ width: "100%", height: `${chartHeight}px` }}
    />
  );
}
