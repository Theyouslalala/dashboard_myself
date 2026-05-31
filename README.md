# 个人 Dashboard

一个聚合展示 GitHub、LeetCode、Steam 数据的个人仪表盘。支持游戏模块的隐藏/显示切换，适用于不同场景（日常/求职/游戏行业）。

## 功能特性

- **GitHub 模块** — 贡献热力图、仓库统计、最近活跃仓库
- **LeetCode 模块** — 刷题进度（简单/中等/困难）、全球排名
- **Steam 模块** — 游戏库卡片墙、游玩时长 Top 10 图表、最近活跃游戏
- **模块可见性控制** — 三种模式：全部显示 / 求职模式（隐藏游戏）/ 游戏模式
- **响应式设计** — 桌面三栏、平板两栏、手机单栏
- **暗色主题** — 专为开发者设计的深色 UI

## 技术栈

- [Next.js 14](https://nextjs.org/) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) 样式
- [Recharts](https://recharts.org/) 图表
- [SWR](https://swr.vercel.app/) 数据请求
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
├── app/
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 主页面
│   └── api/                # API 路由（Steam/GitHub/LeetCode）
├── components/             # UI 组件
├── lib/                    # API 封装和配置
├── docs/                   # 学习文档
├── .env.example            # 环境变量模板
└── README.md
```

## 学习文档

详细的搭建教程和实现原理请参考 [docs/tutorial.md](docs/tutorial.md)。

## License

MIT
