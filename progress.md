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

## 更新（2026-09-05）— 新增「无穷级数」章节（二重积分之后、行列式之前）

- **新模块 `series`（无穷级数）独立成章**：插入学习路径 `dblint` 之后、`linalg` 之前，行列式/矩阵顺延。
- `src/index.html`：
  - 首页 `.path-home` 新增「无穷级数」行（配色 `#FF6B9D`），位于「多元函数积分学（二重积分）」与「行列式」之间。
  - `buildDetailContent` 新增 `case 'series': return buildSeriesDetail();`。
  - 新增 `buildSeriesDetail()`，9 个 tab，**首 tab 为知识地图**：知识地图 / 收敛定义与性质 / 三大基准级数 / 交错级数·莱布尼茨 / 正项级数判别法 / 绝对与条件收敛 / 幂级数·收敛域 / 幂级数·展开 / 幂级数·和函数；知识点与对应例题成对展示，题目使用全国历年专升本/成考真题并标注出处（四川 2025 真题精选、江苏成考 2022、全国成考 2023-2024）。
  - 级数符号严格写全上下限：常数项 `\sum_{n=1}^{\infty} u_n`，幂级数 `\sum_{n=0}^{\infty} a_n x^n`。
- `scripts/extractFormulas.mjs`：`sections` 与 `MODULE_ORDER` 均在 `dblint` 与 `linalg` 之间插入 `series`（color `#FF6B9D`）。
- `notes/11-无穷级数.md`：完整章节笔记，与页面内容一致。
- `notes/00-笔记索引.md`：新增第 08 章「无穷级数」，行列式/矩阵顺延为 09/10，学习路径图同步。
- `src/data/formulas.js`：重新生成，共 **312 条公式，10 个模块**（`series: 29`）。
- 证据：`node scripts/extractFormulas.mjs` 输出 `抽出 312 条 formulaCard` / `共 312 条公式，分 10 个模块`，模块统计 `{ deriv: 87, integral: 69, trig: 41, diffEq: 9, multivar: 10, dblint: 18, series: 29, linalg: 7, matrix: 29, limit: 13 }`。

## 更新（2026-10-04）— 矩阵章节增量（行阶梯/秩 + 逆矩阵公式 + 矩阵方程）

- **初等变换·秩 tab**：丰富 4.3 行阶梯型与行最简型（核心原则「只用初等行变换」+ 三种行变换 + 定义要点三条），新增 3 道例题（3×3 满秩化行阶梯、继续化行最简、2×4 非满秩）、「行阶梯 vs 行最简」对比表；丰富 4.4 矩阵的秩（定理「初等行变换不改变秩」+ 标准步骤 + 小结论三条）、「专升本易错坑」块、练习题为「化行阶梯→求秩→化行最简」。
- **逆·伴随 tab**：新增 3.7 逆矩阵运算公式总结（$(A^{-1})^{-1}=A$、$(AB)^{-1}=B^{-1}A^{-1}$、$(\lambda A)^{-1}=\frac1\lambda A^{-1}$、$(A^\mathrm{T})^{-1}=(A^{-1})^\mathrm{T}$、$|A^{-1}|=1/|A|$、$|A^*|=|A|^{n-1}$、$A^{-1}=A^*/|A|$）；新增 3.8 矩阵方程的类型与解法（口诀「乘法分左右；框框·框框的逆=E；狗·E=狗」、四类方程表、求逆三条路）。
- **三种求逆方法各配一例**（同一 3×3 矩阵贯穿，结果互相印证）：① 伴随法 $A^{-1}=A^*/|A|$；② 初等行变换 $(A\mid E)\to(E\mid A^{-1})$；③ 增广矩阵 $(A\mid B)\to(E\mid A^{-1}B)$。另含基础型 $AX=B$ 例题与 **2022 重庆专升本第 19 题**（$AX=A+2X$，两处 $X$：移项→提 $X$→乘逆）真题例题。
- **速查公式卡**：mat-summary 新增 8 条（逆3 逆的逆与积逆 / 逆4 数乘的逆 / 逆5 逆的行列式 / 伴5 伴随的行列式 / 方1/方2 矩阵方程 / 幂1 矩阵高次幂 / 秩3 已知秩求参数），matrix 29 → **37 条**。
- **新增 3.9 求矩阵的 n 次方（相似法 $AP=PB$）**（置于矩阵方程例题下方）：核心 $AP=PB\Rightarrow A=PBP^{-1}\Rightarrow A^n=PB^nP^{-1}$；难度递进三例——① 基础（2 阶，$B$ 对角）② 进阶（2 阶，$B$ 上三角需先找 $B^n$ 规律）③ 高阶（3 阶求逆 + 对角元含 $-1$ 分奇偶）。
- **新增题型「已知矩阵的秩，求参数」**（4.4 矩阵的秩内，含 1 道真题 + 2 道提升）：核心「秩 = 行阶梯非零行数」；小结论补 ④「$R(A)=r$ ⟹ 所有 $(r+1)$ 阶子式全为 0」。真题为 **四川 2024 专升本 填空第16题**（$A=[[2,2,a],[2,a,2],[a,2,2]]$ 秩为 2，答 $a=-4$）；4 阶提升题 $A=[[t,1,1,1],[1,t,1,1],[1,1,t,1],[1,1,1,t]]$，$R(A)=3$，答 $t=-3$（含完整初等行变换链）；子式法例题（3×4，$R(A)=2$ ⟹ 取一个 3 阶子式令其 $=0$ 求 $a=3$，含 2 阶子式非零验证）。
- `notes/10-矩阵.md`：§六 新增 6.6 逆矩阵运算公式、6.7 矩阵方程类型与解法（含 5 道例题）、6.8 求矩阵的 n 次方（相似法 $AP=PB$，含 3 道例题）；§八 重排为 8.1–8.6（行阶梯/行最简/秩/已知秩求参数/满秩与行列式/易错坑，含对比表与练习题）；速查总表补 逆运算公式/逆的行列式/矩阵方程/矩阵高次幂/已知秩求参数 五行。
- 知识地图 ③ 分支补「矩阵方程（看 X 位置定左右乘）」。
- 证据：`node scripts/extractFormulas.mjs` → `抽出 320 条 formulaCard` / `共 320 条公式，分 10 个模块`，`matrix: 37`；主脚本（inline script#3，~480KB）`new Function` 语法检查通过（errors=0）。

## 更新（2026-10-08）— 第一章「求函数的表达式」补第三种方法（方程组法·消元法）

- `notes/01-函数、极限、连续.md` §1.2：方法表新增「方程组法（消元法）」一行；「本质」说明由两类改三类；新增子节「方法三：方程组法（消元法｜专升本必考）」，含题型特征、思路、类型①（含 $f(x)$ 与 $f(-x)$，例 3）与类型②（含 $f(x)$ 与 $f(1/x)$，例 4）完整解答，末尾附口诀。
- `src/index.html`（`buildFunctionDetail()` 内 1.2 节）：小节标题「（两类方法）」→「（三类方法）」；`formula-grid` 新增第三张卡「方法三：方程组法（消元法）⭐必考」（紫色 `#BF5AF2`）；新增两条 `exampleBox`（例题① $2f(x)+f(-x)=3x$、例题② $f(x)+2f(1/x)=1/x$，含 `\begin{cases}` 联立方程组）与一条 `memoryBox`「方程组法口诀」；同步扩充「选择建议」。知识地图 1.2 分支补「方程组法」。
- 仅新增内容，未改既有结构/视觉；本小节用原生 `formula-card` 组件而非 `formulaCard(...)`，**公式总量不变**（limit 仍 13），无需重跑 `extractFormulas.mjs`。
- 证据：dev server `http://localhost:8001` 200；浏览器核对 1.2 节三张方法卡与两个新例题框均正常渲染，`cases` 方程组/分式 KaTeX 排版无误、无原始 LaTeX 泄漏，暗/浅双主题标签可读、无横向溢出。

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
