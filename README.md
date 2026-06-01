# 个人 Dashboard

一个聚合展示 GitHub、LeetCode、Steam 数据的个人仪表盘。支持游戏模块的隐藏/显示切换，适用于不同场景（日常/求职/游戏行业）。

包含 **Web 端** 和 **微信小程序端** 两个前端，共享同一套后端 API。

## 功能特性

- **GitHub 模块** — 贡献热力图、仓库统计、最近活跃仓库
- **LeetCode 模块** — 刷题进度（简单/中等/困难）、全球排名
- **Steam 模块** — 游戏库卡片墙、游玩时长 Top 10 图表、最近活跃游戏
- **模块可见性控制** — 三种模式：全部显示 / 求职模式（隐藏游戏）/ 游戏模式
- **响应式设计** — 桌面三栏、平板两栏、手机单栏
- **暗色主题** — 专为开发者设计的深色 UI
- **微信小程序** — Taro + React + TypeScript 跨端小程序，Canvas 热力图和图表

## 技术栈

### Web 端
- [Next.js](https://nextjs.org/) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) 样式
- [Recharts](https://recharts.org/) 图表
- [SWR](https://swr.vercel.app/) 数据请求

### 微信小程序端
- [Taro 4](https://taro.jd.com/) + React + TypeScript
- Canvas 2D 手绘热力图和柱状图
- Context + useReducer 状态管理
- 统一请求层（缓存、超时、错误处理）

### 后端 API
- Steam Web API / GitHub REST API / LeetCode GraphQL API

## 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/Theyouslalala/dashboard_myself.git
cd dashboard_myself
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制 `.env.example` 为 `.env.local`，填入你的信息：

```bash
cp .env.example .env.local
```

需要配置的项：

| 变量 | 说明 | 获取方式 |
|------|------|---------|
| `STEAM_API_KEY` | Steam Web API Key | [steamcommunity.com/dev/apikey](https://steamcommunity.com/dev/apikey) |
| `STEAM_USER_ID` | SteamID64 | [steamid.io](https://steamid.io) 查询 |
| `GITHUB_USERNAME` | GitHub 用户名 | 你的 GitHub 用户名 |
| `GITHUB_TOKEN` | GitHub Token（可选） | 提高 API 限额 |
| `LEETCODE_USERNAME` | LeetCode 用户名 | leetcode.cn 用户名 |
| `NEXT_PUBLIC_DASHBOARD_MODE` | 显示模式 | `normal` / `professional` / `gaming` |

### 4. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看效果。

## 模块可见性配置

通过环境变量 `NEXT_PUBLIC_DASHBOARD_MODE` 控制：

| 模式 | 说明 | 显示的模块 |
|------|------|-----------|
| `normal` | 日常模式 | GitHub + LeetCode + Steam |
| `professional` | 求职模式 | GitHub + LeetCode |
| `gaming` | 游戏行业求职 | GitHub + LeetCode + Steam |

## 微信小程序

### 开发

```bash
cd miniapp
npm install
npm run dev:weapp
```

用微信开发者工具导入 `miniapp/dist` 目录即可预览。

### 架构

```
小程序 → Taro.request → Vercel API → GitHub/Steam/LeetCode
```

小程序通过 HTTP 请求调用部署在 Vercel 的 Next.js API 路由，后端负责数据聚合和缓存。

### 关键实现

- **Canvas 热力图** — 使用 Canvas 2D API 手绘 GitHub 贡献热力图，高清适配
- **Canvas 柱状图** — 手绘 Top 10 游戏时长柱状图，渐变色填充
- **请求层** — 统一封装，内存缓存（10 分钟 TTL），超时控制
- **状态管理** — Context + useReducer，轻量够用

### 配置

小程序中的 API 地址需要修改 `miniapp/src/services/request.ts` 中的 `BASE_URL`，指向你的 Vercel 部署地址。

## 部署到 Vercel

1. 推送代码到 GitHub
2. 登录 [vercel.com](https://vercel.com)
3. 导入你的仓库
4. 在 Vercel 项目设置中添加环境变量
5. 部署完成

每次推送到 `main` 分支会自动重新部署。

## 项目结构

```
dashboard/
├── app/                    # Next.js Web 端
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 主页面
│   └── api/                # API 路由（Steam/GitHub/LeetCode）
├── components/             # Web 端 UI 组件
├── lib/                    # API 封装、缓存、类型定义
├── miniapp/                # 微信小程序端（Taro）
│   ├── src/
│   │   ├── services/       # 请求封装 + API 调用
│   │   ├── store/          # Context 状态管理
│   │   ├── components/     # 小程序组件
│   │   └── pages/          # 页面
│   └── config/             # Taro 构建配置
├── docs/                   # 学习文档
├── .env.example            # 环境变量模板
└── README.md
```

## 学习文档

详细的搭建教程和实现原理请参考 [docs/tutorial.md](docs/tutorial.md)。

## License

MIT
