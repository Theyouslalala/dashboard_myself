import { Canvas } from "@tarojs/components";
import { useEffect, useRef, useCallback } from "react";
import Taro from "@tarojs/taro";
import type { ContributionDay } from "../../types";

interface HeatmapProps {
  days: ContributionDay[];
}

const LEVEL_COLORS = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];

export default function Heatmap({ days }: HeatmapProps) {
  const drawnRef = useRef(false);

  const draw = useCallback(async () => {
    if (drawnRef.current || !days.length) return;
    drawnRef.current = true;

    // 获取 canvas 节点
    const query = Taro.createSelectorQuery();
    query
      .select("#heatmap-canvas")
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res?.[0]?.node) return;

        const canvas = res[0].node;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // 高清适配
        const dpr = Taro.getSystemInfoSync().pixelRatio;
        const displayWidth = res[0].width;
        const displayHeight = res[0].height;
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
        ctx.scale(dpr, dpr);

        // 计算格子尺寸
        const cols = 53; // 约 53 周
        const rows = 7;
        const gap = 3;
        const cellSize = Math.floor((displayWidth - gap * (cols - 1)) / cols);

        // 居中偏移
        const totalWidth = cols * cellSize + (cols - 1) * gap;
        const offsetX = (displayWidth - totalWidth) / 2;

        // 绘制
        ctx.clearRect(0, 0, displayWidth, displayHeight);

        for (let i = 0; i < Math.min(days.length, cols * rows); i++) {
          const col = Math.floor(i / rows);
          const row = i % rows;
          const x = offsetX + col * (cellSize + gap);
          const y = row * (cellSize + gap);

          ctx.fillStyle = LEVEL_COLORS[days[i].level] || LEVEL_COLORS[0];
          ctx.beginPath();
          ctx.roundRect(x, y, cellSize, cellSize, 3);
          ctx.fill();
        }
      });
  }, [days]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <Canvas
      id="heatmap-canvas"
      type="2d"
      className="heatmap-canvas"
      style={{ width: "100%", height: "120px" }}
    />
  );
}
