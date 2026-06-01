# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Web 端 (Next.js)
```bash
npm run dev          # 开发服务器 http://localhost:3000
npm run build        # 生产构建（TypeScript 检查已通过 ignoreBuildErrors 跳过）
npm run lint         # ESLint 检查
npx tsc --noEmit     # TypeScript 类型检查（推荐用这个替代 build 来验证类型）
```

### 微信小程序端 (Taro)
```bash
cd miniapp
npm install
npm run build:weapp  # 构建微信小程序，输出到 miniapp/dist/
npm run dev:weapp    # 开发模式（watch）
npx tsc --noEmit     # TypeScript 类型检查
```

## Architecture

**双前端共享后端 API** 的架构：

```
Web (Next.js)  ──┐
                  ├──→  /api/github, /api/leetcode, /api/steam  ──→  GitHub/Steam/LeetCode
小程序 (Taro)  ──┘        (Next.js API Routes)                       (外部 API)
```

### Web 端 (`/app`, `/components`, `/lib`)
- **Next.js 16 (App Router)** + React 19 + TypeScript + Tailwind CSS 4
- **SWR** 客户端数据获取，三个卡片组件各自调用 `/api/*` 路由
- **Recharts** 图表（Steam 模块）
- 页面根组件管理 `DashboardMode` 状态（normal/professional/gaming），控制 Steam 模块显示

### 微信小程序端 (`/miniapp`)
- **Taro 4** + React 18 + TypeScript
- **Canvas 2D** 手绘热力图和柱状图（小程序不支持 SVG）
- **Context + useReducer** 全局状态管理
- 请求层封装在 `src/services/request.ts`：泛型类型安全、内存缓存（10min TTL）、超时控制
- `BASE_URL` 指向 Vercel 部署地址，修改后需重新 `build:weapp`

### 后端 API 路由 (`/app/api`)
三个 GET 路由，各自调用 lib 模块获取数据并返回 JSON：
- `/api/github` → `lib/github.ts`（REST + GraphQL）
- `/api/steam` → `lib/steam.ts`（Steam Web API）
- `/api/leetcode` → `lib/leetcode.ts`（leetcode.cn GraphQL）

共用基础设施：
- `lib/cache.ts` — 泛型缓存工厂 `createCache<T>(maxSize, durationMs)`
- `lib/config.ts` — 环境变量读取 + 模块可见性逻辑
- `lib/errors.ts` — `apiError()` 统一错误响应
- `lib/types.ts` — Web 端和 API 共享的接口定义

### 类型系统
- `lib/types.ts` 定义 API 契约类型（GitHubData, LeetCodeStats, SteamData 等）
- 小程序端 `miniapp/src/types/index.ts` 独立维护相同接口（不直接引用 Web 端文件）
- lib 模块内部的 raw API 类型（如 GitHubUser, SteamOwnedGamesResponse）保持 non-exported

## Key Conventions

- **环境变量**：API Key 等敏感信息通过 `.env.local` 配置，不提交到代码库。参考 `.env.example`
- **next.config.ts** 中 `typescript.ignoreBuildErrors: true` 是因为 Vercel 构建环境的 TypeScript 检查超时，本地用 `npx tsc --noEmit` 验证
- **AGENTS.md** 中的 Next.js 16 注意事项仍然适用 — 写代码前检查 `node_modules/next/dist/docs/` 中的指南
- 小程序端的 TabBar 图标在 `miniapp/src/assets/` 中，是程序生成的 81x81 PNG
- 部署到 Vercel 时需要配置环境变量（Settings → Environment Variables）
