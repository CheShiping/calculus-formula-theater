# progress.md — 当前状态与下一步

> 由编码 agent 在每次改动后追加更新；状态以「证据」为准，不以聊天历史为准。

## 当前状态（2026-08-20）

- 7 个模块的内容与翻卡已全部就位，公式总量 **205 条**（6 模块基线 176 + 矩阵 29）。
- **矩阵已独立成章**：`matrix` 是独立于 `linalg`(行列式) 的模块（buildMatrixDetail + 首页独立入口 + 抽提脚本独立 module）。
- 内容增量工作流已固化为 `AGENTS.md` 第 4 节「🔑 内容增量工作流（铁律）」，并补全套 harness 文件。
- `src/data/formulas.js` 已由 `scripts/extractFormulas.mjs` 重新生成（205 条，7 模块齐全）。

## 证据

- 命令：`node scripts/extractFormulas.mjs`
- 输出：`抽出 205 条 formulaCard` / `共 205 条公式，分 7 个模块`
- 模块统计：`{ deriv: 87, integral: 19, trig: 41, diffEq: 9, linalg: 7, matrix: 29, limit: 13 }`
- 矩阵独立成章：2026-08-20 用户要求「新开一章」，将原本误并入 buildLinearDetail 的矩阵内容拆分为独立 `buildMatrixDetail()`（5 tab：特殊矩阵/矩阵运算/逆·伴随/初等变换与秩/矩阵速查，含 29 条 formulaCard）；首页 path-home 新增「矩阵」行、swiper 卡片与详情页相关卡同步；`buildDetailContent` 加 `case 'matrix'`；`extractFormulas.mjs` 的 `sections`/`MODULE_ORDER` 加 matrix。linalg 回到 7 条（仅行列式）。主脚本 `node --check` 通过，dev server 200，29 张 matrix 卡经服务端验证。

## 更新（2026-08-23）— tab 居中 + 首页矩阵配色

- **review 翻卡页 tab 居中**：新增 `centerActiveChip(bar, activeChip)`（index 详情页 `centerActiveDetailTab` 同款逻辑：rAF 双层、按激活 chip 中心点算目标 `scrollLeft`、越界 clamp 到 `[0, maxScroll]`）与 `centerAllBars()`（同时让桌面 `#filterBar` 与移动端 `#mobileCategoryBar` 的激活 chip 居中）。
- **驱动改源码**：桌面端 `.filter-bar` 改为**仅桌面 `(min-width:641px)` 生效**的单行横向滚动吸顶 tab 栏（`flex-wrap:nowrap` + `overflow-x:auto` + `position:sticky` + 隐藏 scrollbar）；移动端保持原换行布局以避让固定顶栏，移动端 tab 导航仍由 `.mobile-category-bar` 承担。
- **滑动内容驱动**：在 `initSwipeNavigation.handleSwipe`（滑动内容切换章节）模块切换后调用 `centerAllBars()` —— 满足「滑动内容 → bar 自动居中」，无需手动滑 bar。
- **首页矩阵配色**：path-home 矩阵 `path-node` 亮蓝色 `#5AC8FA` → 低饱和 `#8b98ba`，与行列式 `#759ba1` 及整体莫兰迪色板协调。
- 验证：用户确认「效果已验证」。

## 下一步（按优先级）

1. **加新内容时**：严格走 AGENTS.md 第 4 节五步流程——先写 `notes/` 笔记 → 等用户审核 → 在 `index.html` 对应 `buildXxxDetail()` 增量追加 `formulaCard` → 跑 `extractFormulas.mjs` → `npm run dev` 核对双主题。
2. **新增模块时**：同步四处——`buildXxxDetail()`、`scripts/extractFormulas.mjs` 的 `sections` / `MODULE_ORDER`、`notes/00-笔记索引.md`、本文件 `feature_list.json`。
3. 视觉相关改动前先读 `docs/design-system.md`。

## 完成定义（Definition of Done）

- [ ] 笔记草稿经用户审核确认
- [ ] `index.html` 仅增量追加，既有结构/设计/风格未变
- [ ] `node scripts/extractFormulas.mjs` 成功，模块齐全、总数 ≥ 176
- [ ] `npm run dev` 下 index 详情页与 review 翻卡页公式正确、双主题无错位
- [ ] `feature_list.json` 与 `progress.md` 已更新
