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
