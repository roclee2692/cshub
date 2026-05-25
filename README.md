# CS Hub — 计算机科学与技术一站式学习平台

> 面向计算机科学与技术专业学生的交互式学习平台，涵盖数据结构、算法、操作系统、计算机网络、数据库、编译原理、体系结构七大核心学科。

**在线访问：[cshubs.top](https://cshubs.top)**

---

## 功能亮点

- **算法可视化** — 动画演示排序、图论、动态规划等经典算法的执行过程
- **交互式测验** — 每个算法附带选择题，答题后实时反馈正误与解析
- **错题本** — 自动记录答错的题目，方便针对性复习
- **学习进度** — 追踪各学科完成情况，徽章系统激励持续学习
- **本周周报** — 每周学习数据汇总，包含七日练习柱状图
- **学习目标** — 自定义目标算法数量，进度条可视化跟进
- **收藏夹** — 收藏感兴趣的算法，支持自定义文件夹分组
- **连续学习** — Streak 打卡机制，记录最长连续学习天数
- **云端同步** — 可选接入 Supabase，登录后跨设备同步所有进度

## 技术栈

| 层次 | 技术 |
|------|------|
| 前端框架 | React 19 + Vite 8 |
| 样式 | Tailwind CSS v4 |
| 路由 | React Router v7 |
| 后端/Auth | Supabase（PostgreSQL + RLS + GitHub OAuth） |
| 部署 | Vercel |

## 本地运行

```bash
# 克隆项目
git clone https://github.com/Algebraaaa/cshub.git
cd cshub

# 安装依赖
npm install

# 启动开发服务器（无需配置 Supabase，本地模式即可运行）
npm run dev
```

### 可选：启用云同步

复制 `.env.example` 为 `.env.local`，填入 Supabase 项目的 URL 和 anon key：

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

不填则自动切换为本机存储模式，全部数据保存在浏览器 localStorage 中。

## 学科覆盖

- **数据结构** — 数组、链表、栈、队列、树、图、堆、哈希表
- **排序算法** — 冒泡、选择、插入、归并、快速、堆排序等
- **图论算法** — BFS、DFS、Dijkstra、Floyd、Prim、Kruskal
- **动态规划** — LCS、背包、最长递增子序列等经典问题
- **操作系统** — 进程调度、内存管理、文件系统、死锁
- **计算机网络** — TCP/UDP、HTTP、路由算法
- **数据库** — 关系代数、索引、事务、MVCC、查询优化
- **编译原理** — LL(1) 语法分析、LR(0)、中间代码生成

## 项目结构

```
src/
├── pages/          # 页面组件（首页、算法页、个人中心等）
├── components/     # 通用组件（可视化、测验、个人中心模块）
├── contexts/       # 全局状态（进度、成就、认证、主题）
├── data/           # 算法元数据与题目数据
├── layout/         # 顶部导航、底部移动端导航
└── services/       # 本地数据服务（同步、最近访问）
```

## 数据安全

- 所有 Supabase 表均启用行级安全（RLS），用户只能读写自己的数据
- `.env.local` 已加入 `.gitignore`，密钥不会泄露到代码仓库
- `service_role` 密钥仅用于后端/管理员操作，永远不应出现在前端代码中

## License

MIT
