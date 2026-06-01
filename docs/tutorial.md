# Dashboard 搭建教程

本文档详细介绍如何从零搭建这个个人 Dashboard 项目，以及各模块的实现原理。

## 目录

1. [环境准备](#1-环境准备)
2. [项目初始化](#2-项目初始化)
3. [Steam API 接入详解](#3-steam-api-接入详解)
4. [GitHub API 接入详解](#4-github-api-接入详解)
5. [LeetCode API 接入详解](#5-leetcode-api-接入详解)
6. [模块可见性机制](#6-模块可见性机制)
7. [如何添加新模块](#7-如何添加新模块)
8. [常见问题 FAQ](#8-常见问题-faq)

---

## 1. 环境准备

- **Node.js** 18+ （推荐 20 LTS）
- **npm** 9+
- 一个文本编辑器（推荐 VS Code）

## 2. 项目初始化

```bash
# 创建 Next.js 项目
npx create-next-app@latest dashboard --typescript --tailwind --app

# 进入项目目录
cd dashboard

# 安装额外依赖
npm install recharts swr
```

### 关键依赖说明

| 包 | 用途 |
|---|------|
| `next` | React 框架，提供 SSR、API Route 等 |
| `tailwindcss` | 原子化 CSS 框架 |
| `recharts` | React 图表库，基于 D3 |
| `swr` | 数据请求库，支持缓存和自动刷新 |

## 3. Steam API 接入详解

### 申请 API Key

1. 登录 Steam 账号
2. 访问 https://steamcommunity.com/dev/apikey
3. 填写域名（本地开发填 `localhost`）
4. 获取 API Key

### 获取 SteamID64

访问 https://steamid.io，输入你的 Steam 个人资料 URL，找到 `SteamID64` 字段。

### 核心 API 接口

```
GET https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/
    ?key={API_KEY}
    &steamid={STEAM_ID}
    &include_appinfo=1
    &include_played_free_games=1
    &format=json
```

返回数据包含：
- `game_count`：拥有的游戏总数
- `games[]`：游戏列表，每项包含 `appid`、`name`、`playtime_forever`（分钟）

### 游戏封面图

Steam 提供免费的 CDN 图片：
```
https://cdn.akamai.steamstatic.com/steam/apps/{appid}/header.jpg
```

### 缓存策略

本项目使用内存 Map 做 10 分钟缓存，避免频繁调用 API（每日限额 100,000 次）。

## 4. GitHub API 接入详解

### 公开 API（无需 Token）

获取用户信息：
```
GET https://api.github.com/users/{username}
```

获取仓库列表：
```
GET https://api.github.com/users/{username}/repos?sort=updated&per_page=6
```

### 贡献热力图

GitHub 贡献数据需要通过 GraphQL API 获取。如果没有配置 Token，会显示空白热力图。

配置 `GITHUB_TOKEN` 后可获取完整贡献数据。

## 5. LeetCode API 接入详解

本项目使用 LeetCode 中国站（leetcode.cn）的 GraphQL API：

```graphql
query userProblemsSolved($username: String!) {
  matchedUser(username: $username) {
    submitStatsGlobal {
      acSubmissionNum {
        difficulty
        count
      }
    }
    profile {
      ranking
    }
  }
  allQuestionsCount {
    difficulty
    count
  }
}
```

请求地址：`https://leetcode.cn/graphql/`

## 6. 模块可见性机制

配置系统在 `lib/config.ts` 中实现：

```typescript
export function isModuleVisible(config, moduleName): boolean {
  const mod = config.modules[moduleName];
  if (mod.visible === "always") return true;    // 始终显示
  if (mod.visible === "hidden") return false;   // 始终隐藏
  return mod.showInModes.includes(config.dashboardMode);  // 按模式判断
}
```

前端通过 `NEXT_PUBLIC_DASHBOARD_MODE` 环境变量控制当前模式。页面顶部的模式切换按钮可以实时切换。

## 7. 如何添加新模块

### Step 1: 创建 API 封装

在 `lib/` 下创建新文件，如 `lib/newservice.ts`：

```typescript
export interface NewServiceData {
  // 定义数据结构
}

export async function getData(): Promise<NewServiceData> {
  // 调用外部 API
}
```

### Step 2: 创建 API Route

在 `app/api/` 下创建 `app/api/newservice/route.ts`：

```typescript
import { NextResponse } from "next/server";
import { getData } from "@/lib/newservice";

export async function GET() {
  const data = await getData();
  return NextResponse.json(data);
}
```

### Step 3: 创建 UI 组件

在 `components/` 下创建 `components/NewServiceCard.tsx`：

```typescript
"use client";
import useSWR from "swr";

export default function NewServiceCard() {
  const { data, error, isLoading } = useSWR("/api/newservice", fetcher);
  // 渲染 UI
}
```

### Step 4: 注册到主页面

在 `app/page.tsx` 中引入并添加到布局中。

### Step 5: 添加到配置系统

在 `lib/config.ts` 的 `AppConfig` 和 `modules` 中添加新模块配置。

## 8. 常见问题 FAQ

### Q: Steam 数据显示"请配置 Steam API Key"

A: 检查 `.env.local` 中的 `STEAM_API_KEY` 和 `STEAM_USER_ID` 是否正确填写。确保 Steam 个人资料设为公开。

### Q: GitHub 热力图全是灰色

A: 需要配置 `GITHUB_TOKEN` 才能通过 GraphQL API 获取贡献数据。在 GitHub Settings > Developer settings > Personal access tokens 创建。

### Q: LeetCode 数据加载失败

A: 确认使用的是 leetcode.cn（国服）的用户名，不是 leetcode.com 的。检查用户名是否拼写正确。

### Q: 如何修改缓存时间

A: 在 `lib/steam.ts`、`lib/github.ts`、`lib/leetcode.ts` 中修改 `CACHE_DURATION` 常量（单位毫秒）。

### Q: 手机访问样式错乱

A: 项目使用 Tailwind 响应式前缀（`sm:` `md:` `lg:`），如遇到问题请检查浏览器宽度断点。

---

## 9. 微信小程序端

### 架构设计

小程序端使用 [Taro 4](https://taro.jd.com/) + React + TypeScript 构建，与 Web 端共享同一套后端 API。

```
小程序 → Taro.request → Vercel API → GitHub/Steam/LeetCode
```

### 为什么用 Taro 而不是原生开发

- **React 范式** — 与 Next.js Web 端保持一致的开发体验
- **TypeScript** — 全量类型安全
- **跨端** — 一套代码可编译到微信/支付宝/抖音等多端
- **工程化** — 内置构建优化、热更新、分包等能力

### 关键实现

#### Canvas 热力图

小程序不支持 SVG，改用 Canvas 2D 手绘：

1. 通过 `Taro.createSelectorQuery()` 获取 Canvas 节点
2. 计算格子尺寸（按屏幕宽度自适应）
3. 逐日绘制圆角矩形，颜色映射 level 0-4
4. 高清适配：`canvas.width = displayWidth * dpr`

#### Canvas 柱状图

Steam Top 10 游戏时长柱状图也用 Canvas 2D：

1. 渐变色填充（cyan → purple）
2. 游戏名超长截断
3. 时长格式化显示

#### 请求层

统一的 `request<T>(path)` 封装：
- 泛型类型安全
- 内存缓存（Map + 10 分钟 TTL）
- 超时控制（10s）
- 统一错误处理

### 开发流程

```bash
cd miniapp
npm install
npm run dev:weapp
```

用微信开发者工具导入 `miniapp/dist` 目录，即可在模拟器中预览。

### 配置说明

| 文件 | 说明 |
|------|------|
| `src/services/request.ts` | 修改 `BASE_URL` 为你的 API 地址 |
| `project.config.json` | 修改 `appid` 为你的小程序 AppID |
| `config/index.ts` | Taro 构建配置 |

### 添加新页面

1. 在 `src/pages/` 下创建目录
2. 创建 `index.tsx` 和 `index.scss`
3. 在 `src/app.config.ts` 的 `pages` 数组中注册
