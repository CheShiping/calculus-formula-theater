# React SPA 重构 Spec

## Why
当前项目 `src/index.html` 是 235KB 单文件 HTML，承载 7 章节内容、3D 卡片剧场、KaTeX 渲染、Tab 切换、主题管理。所有逻辑、CSS、内容都耦合在一个文件里，扩展和维护成本高，且无法享受现代前端框架的工程化能力（组件复用、路由、TypeScript 类型安全、构建优化）。EdgeOne Pages 适合部署 SPA，Vite + React 是当前业界主流、技术成熟、生态完善，能解决单文件可维护性问题，并为后续按 `calculus-formula-prd` 迭代打基础。

## What Changes

- **新增** Vite + React + TypeScript SPA 工程，位于 `app/` 子目录
- **新增** 路由：首页（3D 卡片剧场）、章节详情页（`/chapter/:slug`）
- **新增** 组件目录：`app/src/components/` 下拆 CardTheater / ChapterCard / DetailView / FormulaCard / MemoryBox / KaTeX / ThemeToggle
- **新增** 内容加载：从 `notes/*.md`（`import.meta.glob` + 简单解析）读取章节元数据，详情内容由组件提供
- **新增** KaTeX 客户端集成（`katex` + `rehype-katex` 等价方案 or 直接 `katex.render`）
- **新增** 主题切换：React Context + localStorage
- **新增** 部署配置：EdgeOne Pages 工作流（`edgeone.json` / `.github/workflows/edgeone.yml`）
- **保留** 旧 `src/index.html` 直到新 SPA 全量验证完毕（GH Pages 老链接不断）
- **保留** 现有 `.github/workflows/deploy.yml` 路径（指向 `src/*`），直到新 SPA 切换部署时再调整

未来阶段（不在本次 spec 范围）：
- 第一阶段为脚手架 + 最小可跑首页占位（Hello 卡片）
- 后续阶段按 `calculus-formula-prd` 增量升级

## Impact

- **Affected specs**：第一章等价无穷小表 / 拉普拉斯展开 / 专升本真题等所有教学内容展示形态（最终都会迁到新 SPA）
- **Affected code**：
  - 新增：`app/package.json` · `app/vite.config.ts` · `app/tsconfig.json` · `app/index.html` · `app/src/main.tsx` · `app/src/App.tsx` · `app/src/components/*` · `app/src/styles/globals.css`
  - 暂不动：`src/index.html` · `.github/workflows/deploy.yml` · `package.json`（根）
  - `.gitignore` 增加 `app/dist/` 与 `app/node_modules/`

## ADDED Requirements

### Requirement: Vite + React + TS 脚手架
项目 SHALL 在 `app/` 子目录提供完整的 Vite + React + TypeScript 脚手架，`npm run dev` 可启动开发服务器，`npm run build` 产出 `app/dist/`。

#### Scenario: 安装与启动成功
- **WHEN** 用户在 `app/` 目录执行 `npm install` 然后 `npm run dev`
- **THEN** 本地开发服务器正常启动（如 http://localhost:5173），首页可见占位内容

#### Scenario: 构建成功
- **WHEN** 用户在 `app/` 目录执行 `npm run build`
- **THEN** 输出 `app/dist/index.html` 与静态资源，无 TypeScript 编译错误

### Requirement: React 路由
项目 SHALL 使用 React Router DOM v6+，支持首页 `/` 与章节详情页 `/chapter/:slug`。

#### Scenario: 访问章节详情
- **WHEN** 用户点击首页某张章节卡片
- **THEN** 路由跳转到 `/chapter/:slug` 并渲染对应章节占位

#### Scenario: 返回首页
- **WHEN** 用户点击详情页返回按钮
- **THEN** 路由回退到 `/`

### Requirement: 主题切换
项目 SHALL 支持深色 / 浅色双主题，通过 React Context 注入当前主题，持久化到 `localStorage`，首次访问跟随 `prefers-color-scheme`。

#### Scenario: 切换主题
- **WHEN** 用户点击主题切换按钮
- **THEN** 全局 CSS 变量切换，主题选择持久化

### Requirement: KaTeX 公式渲染
项目 SHALL 在客户端使用 KaTeX 渲染 LaTeX 公式。

#### Scenario: 公式渲染
- **WHEN** 组件挂载后含 `$...$` 或 `$$...$$` 内容
- **THEN** 调用 `katex.render` 输出 HTML

### Requirement: 章节元数据加载
项目 SHALL 通过 `import.meta.glob('/notes/*.md', { query: '?raw', import: 'default', eager: true })` 加载所有 `notes/*.md` 文件名作为章节索引源（实际章节详情内容由组件提供，本阶段不做 markdown 渲染）。

#### Scenario: 列出章节
- **WHEN** 组件读取章节列表
- **THEN** 输出 7 个章节（函数极限连续 / 导数 / 微分 / 积分 / 三角函数 / 微分方程 / 线性代数-行列式）的元信息

### Requirement: EdgeOne Pages 部署配置
项目 SHALL 在仓库根提供 `edgeone.json`，并在 `.github/workflows/` 下提供 `edgeone.yml`，通过 `app/dist/` 部署到 EdgeOne Pages。

#### Scenario: EdgeOne 构建
- **WHEN** EdgeOne Pages 触发构建
- **THEN** 自动安装 `app/` 依赖并执行 `npm run build`，产物指向 `app/dist/`

## MODIFIED Requirements

### Requirement: .gitignore
现有 `.gitignore` SHALL 新增 `app/dist/` 与 `app/node_modules/` 排除规则，避免 SPA 构建产物污染仓库。

## REMOVED Requirements

无（本阶段为新增，不删除任何旧文件）。
