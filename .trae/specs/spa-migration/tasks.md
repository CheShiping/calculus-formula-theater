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

- [x] Task 3: Phase 1 公式数据层
  - [x] SubTask 3.1: `app/src/data/deriveFormulas.mjs` 一次性抽提脚本
  - [x] SubTask 3.2: `app/src/data/formulas.ts` 120 条公式（7 模块）+ FORMULAS_BY_MODULE / MODULES 索引

- [x] Task 4: Phase 2 章节内容层
  - [x] SubTask 4.1: `app/src/data/deriveChapterContent.mjs` markdown 解析脚本
  - [x] SubTask 4.2: `app/src/data/chapterContent.ts` 7 章节正文（intro + sections + paragraphs）
  - [x] SubTask 4.3: `app/src/lib/content.ts` 改为从 chapterContent 派生（修复 Vite 根目录限制）
  - [x] SubTask 4.4: `app/src/pages/ChapterPage.tsx` 接入动态章节正文 + KaTeX

- [x] Task 5: Phase 4 翻卡记忆模块（P0）
  - [x] SubTask 5.1: `app/src/components/FlipCard/FlipCard.tsx` 3D 翻面组件（纯 CSS，无 GSAP/Framer）
  - [x] SubTask 5.2: `app/src/pages/ReviewPage.tsx` 翻卡记忆页（模块筛选 + 全部翻面 + 类别分组）
  - [x] SubTask 5.3: `app/src/App.tsx` 新增 `/review` 路由
  - [x] SubTask 5.4: `app/src/pages/HomePage.tsx` 新增「翻卡记忆」入口卡
  - [x] SubTask 5.5: `app/src/styles/globals.css` 翻卡 + Quick Access 样式
  - [x] SubTask 5.6: `tsc --noEmit` 无错 + `vite build` 产物 OK

- [ ] Task 6: Phase 5 自测练习模块（P0）
  - [ ] SubTask 6.1: `app/src/lib/quiz.ts` 题目生成器（选择/填空/判断）
  - [ ] SubTask 6.2: `app/src/components/Quiz/QuestionCard.tsx` + `QuizResult.tsx` + `QuizConfig.tsx`
  - [ ] SubTask 6.3: `app/src/pages/QuizPage.tsx` config → answering → result 状态机
  - [ ] SubTask 6.4: `app/src/lib/storage.ts` 自测历史（保留最近 100 条）
  - [ ] SubTask 6.5: 路由 + 首页入口 + 即时反馈样式

- [ ] Task 7: Phase 6 公式搜索模块（P1）
  - [ ] SubTask 7.1: `app/src/lib/searchIndex.ts` 前端索引（3 匹配方式 + 200ms debounce）
  - [ ] SubTask 7.2: `app/src/components/SearchBar/SearchBar.tsx` 顶部固定 + `/` 聚焦 + `Esc` 清空
  - [ ] SubTask 7.3: `app/src/pages/ChapterPage.tsx` 支持 `?q=&fid=` 自动滚动 + 2s 高亮
  - [ ] SubTask 7.4: `app/src/main.tsx` 包裹全局 Layout 承载 SearchBar

- [ ] Task 8: Phase 7 集成与部署验证
  - [ ] SubTask 8.1: 首页 7 章节卡 + 翻卡/自测/搜索 3 入口
  - [ ] SubTask 8.2: `npm run build` 无 TS 错误
  - [ ] SubTask 8.3: 主题切换深/浅色贯穿所有新页面
  - [ ] SubTask 8.4: EdgeOne Pages 部署验证

# Task Dependencies
- [Task 2] depends on [Task 1]（依赖 Task 1 的构建产物路径 `app/dist/`）
