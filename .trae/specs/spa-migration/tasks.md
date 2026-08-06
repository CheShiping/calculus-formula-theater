# Tasks

- [x] Task 1: 创建 `app/` 脚手架与最小可跑首页（Vite + React + TS + Router + 主题 + KaTeX + 章节元数据）
  - [x] SubTask 1.1: 创建 `app/package.json`（vite / react / react-dom / react-router-dom / @types/* / typescript / katex / @types/katex / @vitejs/plugin-react）
  - [x] SubTask 1.2: 创建 `app/vite.config.ts`（React 插件 + 路径别名 + base 配置）
  - [x] SubTask 1.3: 创建 `app/tsconfig.json` 与 `app/tsconfig.node.json`
  - [x] SubTask 1.4: 创建 `app/index.html`（Vite 入口 + root div）
  - [x] SubTask 1.5: 创建 `app/src/main.tsx`（React 挂载 + BrowserRouter 包裹）
  - [x] SubTask 1.6: 创建 `app/src/App.tsx`（路由配置 `/` 与 `/chapter/:slug`）
  - [x] SubTask 1.7: 创建 `app/src/styles/globals.css`（CSS 变量定义深浅主题 + reset）
  - [x] SubTask 1.8: 创建 `app/src/lib/theme.tsx`（ThemeContext + useTheme hook + localStorage 持久化）
  - [x] SubTask 1.9: 创建 `app/src/lib/katex.ts`（封装 `katex.render` 与自动渲染 `$...$` / `$$...$$`）
  - [x] SubTask 1.10: 创建 `app/src/lib/content.ts`（`import.meta.glob` 加载 `notes/*.md` 文件名清单）
  - [x] SubTask 1.11: 创建 `app/src/components/ThemeToggle/ThemeToggle.tsx`（切换按钮）
  - [x] SubTask 1.12: 创建 `app/src/pages/HomePage.tsx`（占位首页：标题 + 7 张章节卡片占位 + 主题切换按钮）
  - [x] SubTask 1.13: 创建 `app/src/pages/ChapterPage.tsx`（占位详情页：标题 + 返回按钮 + KaTeX 演示公式）
  - [x] SubTask 1.14: 更新根目录 `.gitignore`（增加 `app/dist/` 与 `app/node_modules/`）
  - [x] SubTask 1.15: 在 `app/` 执行 `npm install` 并验证 `npm run dev` 启动成功
  - [x] SubTask 1.16: 在 `app/` 执行 `npm run build` 验证无 TS 错误并产出 `app/dist/index.html`

- [x] Task 2: EdgeOne Pages 部署配置
  - [x] SubTask 2.1: 创建 `edgeone.json`（buildCommand: `cd app && npm install && npm run build`，outputDir: `app/dist`）
  - [x] SubTask 2.2: 创建 `.github/workflows/edgeone.yml`（push 触发，可选 `workflow_dispatch`）

# Task Dependencies
- [Task 2] depends on [Task 1]（依赖 Task 1 的构建产物路径 `app/dist/`）
