# PRD P0+P1 全量实施计划

## Summary

基于 `calculus-formula-prd/calculus-formula-prd.html`（v2.0, 2026-08-05）制定本计划。  
PRD 把 SPA 从「好看的公式展示工具」升级为「完整的专升本高数复习产品」。本计划覆盖 PRD 阶段 0 之后的所有 P0+P1 任务：①抽提并结构化 60+ 条公式数据；②用 3 个 UI 设计技能（`design-taste-frontend` / `stitch-design-taste` / `gpt-taste`）重新设计 4 模块高保真原型并产出 `docs/design-system.md`；③实现 P0 翻卡记忆 + 自测练习；④实现 P1 公式搜索。P2 分享卡片明确不在本计划范围。**用户已确认项目核心是「框架梳理」——文字描述与公式都是内容主体，原型与设计文档中必须同时体现。**

## Current State Analysis

### 已完成（来自既有 spec/tasks/checklist）
- `app/` 脚手架：Vite 5 + React 18 + TypeScript + React Router 6 + KaTeX 0.16
- 路由：`/` 首页 + `/chapter/:slug` 详情页（占位）
- 主题：React Context + `cft.theme` localStorage 持久化
- 章节元数据：`import.meta.glob('/notes/*.md', { query: '?raw' })` 加载 7 个 .md 文件名
- EdgeOne Pages 部署：`edgeone.json` + `.github/workflows/edgeone.yml`

### 关键现状
- `app/src/pages/HomePage.tsx`：仅渲染 7 张章节占位卡 + 主题切换
- `app/src/pages/ChapterPage.tsx`：硬编码 4 条 DEMO_FORMULAS 演示 KaTeX
- `app/src/lib/content.ts`：返回 `ChapterMeta[]`（slug/title/desc/color），不解析 markdown 正文
- `app/src/lib/katex.ts`：`renderKatex(tex, display)` + `renderMixedText(text)` 封装
- `app/src/lib/theme.tsx`：ThemeProvider / useTheme
- `app/src/components/ThemeToggle/ThemeToggle.tsx`：圆形切换按钮
- `src/index.html`（旧单文件，235KB）含 60+ 条 `formulaCard('(N)', label, '$$tex$$', note, color)` 调用，散布在 5 个 Tab 的 `renderTab*()` 函数内——是公式数据源
- `notes/*.md`：7 章节文字笔记（含框架梳理、口诀、例题），是「文字描述」内容源

### 用户在当前会话内的关键约束
1. **翻卡无评分/无队列**（PRD 业务逻辑为准）— 翻卡页只做翻面 + 「全部翻面」按钮
2. **公式数据用结构化 TS 文件**（推荐方案）— 不用解析旧 HTML，也不引入 markdown 解析器
3. **原型必须体现「文字描述 + 公式」双重内容**— 框架梳理是项目主体，公式记忆是其中一部分
4. **先设计原型**— 调用相关技能（`card-theater` / `huashu-design`）输出可视原型

## Proposed Changes

### Phase 1 · 公式数据层（formulas.ts）

**目标**：从 `src/index.html` 的 60+ 条 `formulaCard()` 调用中抽提，输出强类型 TS 数据文件。

**新增文件**：
- [app/src/data/formulas.ts](file:///e:/Users/Shiping/面容整理/app/src/data/formulas.ts) — 60+ 条 `Formula` 对象的静态数组
- [app/src/data/deriveFormulas.mjs](file:///e:/Users/Shiping/面容整理/app/src/data/deriveFormulas.mjs) — 一次性 Node 脚本：从 `src/index.html` 用正则扫描 `formulaCard\(['"](.*?)['"],\s*['"](.*?)['"],\s*['"]([\s\S]*?)['"]` 抽提 4 个字段 + 模块色，生成 `formulas.ts`（仅本地运行，不入仓；首次手写 60 条后存档以便后续 review）

**`Formula` 接口**（lib 中）：

```ts
export type Module = 'limit' | 'deriv' | 'diff' | 'integral' | 'trig' | 'diffEq' | 'linalg';
export type Category = string; // 例如 '三角函数类' / '幂函数类' / 'a² 积分'

export interface Formula {
  id: string;          // 稳定主键，如 'deriv_trig_tan'，供 localStorage / URL / 自测错题使用
  module: Module;      // 所属模块（用于自测范围、搜索过滤）
  category: Category;  // 子分类（用于翻卡分组）
  label: string;       // 短名，如 '正切'
  lhs: string;         // 公式左侧（LaTeX），如 '\\tan x'
  rhs: string;         // 公式右侧（LaTeX），如 '\\sec^2 x'；微分/积分为 '0' / 'kx + c'
  display?: 'lhs' | 'rhs' | 'full' | 'blank'; // 翻卡正面展示方式
  hint: string;        // 记忆口诀 / 联动说明
  color: string;       // 模块色
}
```

**关键 ID 命名规则**：`${module}_${category短拼音}_${序号}`，例如 `deriv_trig_tan`、`integral_basic_pow`、`trig_double_sin2a`、`diffEq_separable`、`limit_equiv_2`。

**来源映射**（按 PRD 第 1 章业务逻辑与笔记文件）：
- 01-函数、极限、连续（limit）：等价无穷小、间断点、极限运算法则 → ~12 条
- 02-导数（deriv）：18 条
- 03-微分（diff）：16 条
- 04-积分（integral）：11 条常用 + 8 条特殊 = 19 条
- 05-三角函数（trig）：二倍角、降幂、平方、倒数 → ~18 条
- 06-微分方程（diffEq）：3 条方程类型
- 07-线性代数-行列式（linalg）：克拉默法则 + 拉普拉斯

### Phase 2 · 文字内容层（chapterContent.ts）

**目标**：把 `notes/*.md` 的框架梳理文字从「仅做文件名清单」升级为「可被详情页消费的章节正文」。

**新增文件**：
- [app/src/data/chapterContent.ts](file:///e:/Users/Shiping/面容整理/app/src/data/chapterContent.ts) — 7 个章节的 `ChapterContent` 静态对象

**结构**：

```ts
export interface ChapterSection {
  heading: string;       // '一、定义' / '二、18 条导数公式' 等
  paragraphs: string[];  // 已 KaTeX 处理：含 $...$ 的纯文本，传给 renderMixedText
  formulaIds: string[];  // 本节关联的公式 id，详情页点击公式可联动回章节
}

export interface ChapterContent {
  slug: string;
  intro: string;         // 章节导言
  sections: ChapterSection[];
  examples: { id: string; problem: string; answer: string; source?: string }[]; // 专升本真题
}
```

**实现**：
- 复用 `import.meta.glob('/notes/*.md', { query: '?raw', import: 'default', eager: true })` 读原始 markdown 文本
- 用纯字符串解析（不引第三方）切分 `##` / `###` 标题与段落——保守实现，只取 `##` 标题下到下一个 `##` 前的全部文本，公式区段按 `$$...$$` 整段提取为 `formulaIds` 占位
- 段落内 KaTeX 渲染走 `renderMixedText`（已有）
- 章节内容按 ID 排序（与现有 `content.ts` 一致）

### Phase 3 · UI 设计技能调用（重新设计原型 + 产出设计文档）

**目标**：调用 3 个 UI/UX 设计技能（`design-taste-frontend` / `stitch-design-taste` / `gpt-taste`）系统性重新设计 4 模块的高保真原型，并沉淀为可被开发者直接消费的设计文档。

**调用顺序与分工**：
1. **`design-taste-frontend`（先调）** — 反 slop / 反模板化设计基线。审计当前 PRD 描述与旧 `src/index.html` 的视觉套路（玻璃拟态 + 渐变标题 + 章节卡片），输出 4 模块的「反 slop 设计原则」清单（配色纪律、排版层级、构图变化、CTA 多样性、第二眼细节）。
2. **`stitch-design-taste`（中调）** — 语义化设计系统。产出一份 `docs/design-system.md`，定义：
   - 字体阶梯（H1-H6 / 正文 / 公式 / 代码）
   - 色板（主色 4F6BFF + 7 模块色 + 中性 7 阶 + 成功/警告/错误）
   - 间距尺度（4 / 8 / 12 / 16 / 24 / 32 / 48 / 64）
   - 圆角（4 / 8 / 12 / 20）
   - 阴影（card / hover / active / overlay）
   - 组件原子（Button / Card / Badge / Tag / Input / SearchBar / FlipCard / QuizOption）
   - 动效曲线（`cubic-bezier(0.4, 0, 0.2, 1)` 等 3 档）
3. **`gpt-taste`（后调）** — 高级 GSAP 动效工程师。设计关键动效蓝图：
   - 翻卡：3D Y 轴翻转 600ms + 阴影同步变化
   - 章节卡片入场：stagger 80ms 错峰 + 透明度 + Y 偏移
   - 自测答题：选项弹性反馈（spring）+ 正确/错误色块滑入
   - 搜索下拉：高度 + 透明度 stagger 30ms
   - 主题切换：CSS 变量 0.4s ease 全局过渡

**原型产出**（每模块一份独立 HTML，存放在 `.trae/prototypes/`）：
1. **首页** — 7 章节入场 + 翻卡/自测/搜索入口（响应 PRD 主页导航栏）
2. **章节详情** — 侧边栏叙事 + 3D 公式卡片剧场（保留旧 235KB 单文件的核心体验：联动手册 + 口诀高亮 + 章节例题真题）
3. **翻卡记忆** — 全部翻面按钮、3D 翻面动画、类别切换
4. **自测练习** — 选择/填空/判断三题型 + 即时反馈 + 成绩单
5. **公式搜索** — 全局搜索框 + 实时下拉 + 键盘快捷键

**设计文档产出**（新增 `[docs/design-system.md](file:///e:/Users/Shiping/面容整理/docs/design-system.md)`）：
- 由 `stitch-design-taste` 主导生成 + `design-taste-frontend` 注入反 slop 规则
- 文档结构：
  1. 设计原则（4-6 条）
  2. 字体系统
  3. 色板（含色值 + 用途）
  4. 间距与圆角
  5. 阴影与动效
  6. 组件库（每个原子组件 1 张截图 + 1 段代码骨架）
  7. 4 模块原型截图/HTML 路径
  8. 反 slop 自查清单

**Phase 3 验证标准**：
- 5 个原型 HTML 在浏览器可直接打开、点击交互可工作
- `docs/design-system.md` 完整覆盖字体/色板/间距/组件/动效
- 文字描述与公式都能在原型中体现（呼应「框架梳理是主体」）
- 翻面动画、全部翻面、即时反馈等关键交互可见可点
- 设计与 PRD § 验收标准 1:1 对应

### Phase 4 · 翻卡记忆模块（P0）

**目标**：无评分、无队列的极简翻卡工具。

**新增/修改文件**：
- [app/src/pages/ReviewPage.tsx](file:///e:/Users/Shiping/面容整理/app/src/pages/ReviewPage.tsx)（新增）
- [app/src/components/FlipCard/FlipCard.tsx](file:///e:/Users/Shiping/面容整理/app/src/components/FlipCard/FlipCard.tsx)（新增）— 3D 翻面动画
- [app/src/components/FlipCard/FlipCard.css](file:///e:/Users/Shiping/面容整理/app/src/components/FlipCard/FlipCard.css)（新增）
- [app/src/lib/storage.ts](file:///e:/Users/Shiping/面容整理/app/src/lib/storage.ts)（新增）— localStorage 封装
- [app/src/App.tsx](file:///e:/Users/Shiping/面容整理/app/src/App.tsx)（修改：新增 `/review` 路由）
- [app/src/pages/HomePage.tsx](file:///e:/Users/Shiping/面容整理/app/src/pages/HomePage.tsx)（修改：新增「翻卡」入口卡）
- [app/src/styles/globals.css](file:///e:/Users/Shiping/面容整理/app/src/styles/globals.css)（追加 CSS 变量）

**`FlipCard` 组件**：
- props: `{ formula: Formula; flipped: boolean; onToggle: () => void }`
- 正面：根据 `formula.display` 渲染 `lhs` / `rhs` / `完整公式` / `挖空`；点击翻面
- 背面：完整 LaTeX + 联动说明 + 记忆口诀
- 3D 动画：`transform: rotateY(180deg)` + `transform-style: preserve-3d` + `transition: transform 0.5s`

**`ReviewPage` 行为**：
- 顶部：模块选择器（limit/deriv/diff/integral/trig/diffEq/linalg）+ 「全部翻面/全部翻回」按钮
- 主体：当前模块的公式卡网格（按 `category` 分组）
- 类别切换：按钮状态重置（PRD 验收项）
- 不写 localStorage（PRD：「不做进度追踪」）

### Phase 5 · 自测练习模块（P0）

**新增/修改文件**：
- [app/src/pages/QuizPage.tsx](file:///e:/Users/Shiping/面容整理/app/src/pages/QuizPage.tsx)（新增）
- [app/src/components/Quiz/](file:///e:/Users/Shiping/面容整理/app/src/components/Quiz/)（新增子目录）
  - `QuestionCard.tsx`（按题型分渲染）
  - `QuizResult.tsx`（成绩单）
  - `QuizConfig.tsx`（范围/题量选择）
- [app/src/lib/quiz.ts](file:///e:/Users/Shiping/面容整理/app/src/lib/quiz.ts)（新增）— 题目生成器
- [app/src/lib/storage.ts](file:///e:/Users/Shiping/面容整理/app/src/lib/storage.ts)（扩展：自测历史 API）

**题目生成规则**（按 PRD § 题型规则）：
- 选择题：从本模块其他公式随机取 3 条作为干扰项 + 当前公式 `rhs` 打乱顺序
- 填空题：在公式文本中挖空 `rhs`（首字符或关键函数名），如 `(tan x)' = ___`
- 判断题：随机把 `rhs` 替换成另一条公式的 rhs，问「这个变形对吗」

**自测页面状态机**：`config → answering → result`
- config 阶段：选择 `module`（单选/全部）+ `count`（10/20/随机）
- answering 阶段：进度条（题号/总数 + 当前正确率）+ 题目渲染 + 即时反馈（正确标绿、错误标红、同时正确答案也标绿、显示联动说明）+ 「下一题」按钮
- result 阶段：成绩单（总分/正确率/各模块正确率/错题列表）+ 「错题加入翻卡」按钮

**localStorage**：
- `calculus_quiz_history`：JSON 数组，元素 `{ date, module, total, correct, accuracy, wrong_ids }`，保留最近 100 条（PRD 风险：5MB 限制应对）
- 「错题加入翻卡」：因翻卡本身不存状态（PRD 无评分），改为把错题 ID 写入 `calculus_review_pending`（仅用于在 `ReviewPage` 顶部展示「上次自测错题 5 个」快捷入口）

**键盘交互**：←/→ 切题、Enter 下一题、数字键 1-4 选选项（选择题）。

### Phase 6 · 公式搜索模块（P1）

**新增/修改文件**：
- [app/src/components/SearchBar/SearchBar.tsx](file:///e:/Users/Shiping/面容整理/app/src/components/SearchBar/SearchBar.tsx)（新增）— 全局固定搜索框
- [app/src/lib/searchIndex.ts](file:///e:/Users/Shiping/面容整理/app/src/lib/searchIndex.ts)（新增）— 前端搜索索引
- [app/src/pages/ChapterPage.tsx](file:///e:/Users/Shiping/面容整理/app/src/pages/ChapterPage.tsx)（修改：支持 `?q=xxx&fid=xxx` URL 参数，自动滚动到公式并 2 秒高亮闪烁）
- [app/src/App.tsx](file:///e:/Users/Shiping/面容整理/app/src/App.tsx)（修改：把 SearchBar 提升到全局 Layout）

**`searchIndex.ts` 设计**：
- 在模块加载时构建一次 `SearchEntry[]`，每条含：`{ id, lhs, rhs, display: '完整渲染', module, category, hint, aliases: string[] }`
- aliases 从 `hint` 与 `label` 中提取关键词（正切 / tan / 求导 / 高频 / sec² 等）
- 匹配方式（按 PRD 验收项 5）：
  1. 精确匹配函数名（`tan` 出现在 `rhs` 中）
  2. 匹配中文名（输入「二倍角」匹配 `trig_double_*`）
  3. 匹配口诀关键词（输入「正变余」匹配所有三角求导公式）
- 相关度排序：精确 > 函数名包含 > 关键词包含，最多 20 条
- 用 200ms debounce（PRD 验收项 1）

**SearchBar UI**：
- 顶部固定（fixed top），含输入框 + 搜索按钮
- 输入时下拉浮层展示结果（点击外部 / Esc 关闭）
- 快捷键：`/` 聚焦（输入框外的页面任意位置）、`Esc` 清空并失焦
- 点击结果：`navigate('/chapter/${slug}?q=${query}&fid=${formulaId}')` → 详情页 `useEffect` 监听 query string，定位并高亮

### Phase 7 · 集成与部署验证

**修改文件**：
- [app/src/main.tsx](file:///e:/Users/Shiping/面容整理/app/src/main.tsx)（修改：包裹 Layout 组件承载 SearchBar）
- [app/src/App.tsx](file:///e:/Users/Shiping/面容整理/app/src/App.tsx)（修改：路由表 + 嵌套 Layout）

**验证步骤**：
1. `cd app && npm run build` 无 TS 错误
2. `npm run dev` 启动 5173，手动跑通：
   - 首页 → 7 章节卡 + 翻卡/自测/搜索三个新入口
   - 章节详情 → 文字描述 + 公式联动渲染
   - `/review` → 选择模块 → 翻卡翻面 + 全部翻面 + 类别切换重置
   - `/quiz` → 选范围/题量 → 三种题型 → 即时反馈 → 成绩单 → 错题入口
   - 全局 `/` 搜索「tan」→ 下拉 → 点击 → 跳详情页 → 2 秒高亮
3. 主题切换深/浅色贯穿所有新页面
4. `calculus_quiz_history` 在 DevTools Application 中可见且 < 50KB
5. EdgeOne Pages 部署工作流不破坏（仅 `app/dist/` 变化）

## Assumptions & Decisions

1. **公式 ID 稳定性是核心** — 一旦写入 localStorage，ID 不能改；Phase 1 完成后需在 `formulas.ts` 顶部注释明确「禁止修改已发布 ID，仅可新增」。
2. **不引入新依赖** — 翻卡 3D 动画纯 CSS，自测无第三方状态机库，搜索无 fuse.js（手写 includes/排序足够 60+ 条规模）。
3. **不解析 markdown** — `chapterContent.ts` 用保守的字符串切分（`##` 切段），不引 remark/rehype，避免 bundle 膨胀。
4. **`notes/*.md` 保留为「文字源」** — 详情页段落直接从 .md raw 文本渲染，不破坏既有笔记文件。
5. **旧 `src/index.html` 不删除** — 直到新 SPA 全量验证完毕（PRD 「技术架构迁移」段已声明）。
6. **EdgeOne Pages 部署** — 沿用现有 `edgeone.json`（`buildCommand: cd app && npm install && npm run build`，`outputDir: app/dist`），不修改。
7. **原型先于代码 + 3 个 UI 设计技能驱动** — 用户明确要求「用 UI 设计技能重新设计原型并产出设计文档」。Phase 3 调用 `design-taste-frontend`（反 slop 基线）→ `stitch-design-taste`（设计系统 + 设计文档）→ `gpt-taste`（GSAP 动效蓝图），产出 5 个 HTML 原型 + 一份 `docs/design-system.md`，经用户确认后再进入 Phase 4-6。
8. **翻卡不做进度追踪** — 用户已选「无评分/无队列」；`calculus_review_state` 字段不写（仅「错题加入翻卡」写到 `calculus_review_pending` 用于入口展示）。

## Verification

### 自动化
- `npm run build` 通过且 `app/dist/index.html` 产物存在
- `tsc -b` 无错误（含新增页面/组件的 strict 模式）
- 路由刷新测试：`/`, `/chapter/02-导数`, `/review`, `/quiz` 均不白屏

### 手动验收（按 PRD § 验收标准）
- 翻卡：3D 翻面 ✓ · 全部翻面切换 ✓ · 类别隔离 ✓ · 无评分按钮 ✓
- 自测：三种题型生成 ✓ · 即时反馈正确/错误同时标绿 ✓ · 成绩统计准确 ✓ · 错题联动写入 `calculus_review_pending` ✓ · 进度条实时更新 ✓
- 搜索：200ms 内响应 ✓ · 三种匹配方式 ✓ · 跳转并高亮 2 秒 ✓ · `/` 与 `Esc` 快捷键 ✓ · 空结果提示 ✓
- 非功能：首屏 ≤ 2s（用 Lighthouse 本地跑）· 桌面/移动 Chrome 可用 · 深浅主题适配 · localStorage < 2MB

### 用户验收
- **Phase 3 用户验收点**：5 个 HTML 原型 + `docs/design-system.md` 出炉后先让用户 spot-check 视觉与交互
- 每 Phase 完成后跑 `npm run dev` 让用户 spot-check
- 最后 Phase 7 整体走查通过后提交 + 推送
