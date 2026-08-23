# AGENTS.md — calculus-formula-theater（面容整理）

四川专升本高数公式联动记忆系统。**纯静态 HTML 单页应用，无框架、无打包器。**
**中文沟通，commit message 用中文**（`feat` / `style` / `chore` + 中文描述，如 `feat(notes): 新增第二章导数与微分笔记`）。

> 本文件是给编码 agent 的「启动 + 规则 + 完成定义」入口。设计理念、视觉规范见 `docs/design-system.md`；跨会话交接见 `session-handoff.md`；功能状态见 `feature_list.json` 与 `progress.md`。

---

## 1. 项目架构与目录结构

单仓库 = 内容源（`src/`、`notes/`） + 生成器（`scripts/`） + 文档（`docs/`、`README.md`）。
页面是「源码即产物」：浏览器直接读 `src/`，`npm run build` 只是把 `src/` 原样拷到 `dist/output/`，**不改路径、不哈希、不打包**。

```
面容整理/
├── src/                          # 站点源码（即产物，浏览器直接打开）
│   ├── index.html                # 主应用（HTML+CSS+JS 全内联，~328KB）
│   │                             #   当前主视图：.path-home 知识路径首页（7 模块行）
│   │                             #   旧版 Coverflow 剧场 .sidebar-container/.main-stage 已被 CSS 隐藏，别恢复
│   ├── review.html              # 翻卡记忆页；公式数据从 src/data/formulas.js import
│   ├── data/
│   │   └── formulas.js          # 公式共享数据【自动生成，勿手改】
│   └── prototypes/              # 早期原型（保留，勿动）
├── notes/                       # 知识点 Markdown 笔记（按章节，站点内容的文字镜像）
│   ├── 00-笔记索引.md           # 章节目录 + 学习路径，新增笔记务必在此登记
│   ├── 01-函数、极限、连续.md
│   ├── 02-导数与微分.md         # 原 02-导数 + 03-微分 已合并（可导⟺可微）
│   ├── 04-一元函数积分学.md
│   ├── 05-三角函数.md
│   ├── 06-微分方程.md
│   └── 07-线性代数-行列式.md
├── scripts/
│   └── extractFormulas.mjs      # 从 src/index.html 抽提 formulaCard(...) → 重写 src/data/formulas.js
├── docs/
│   ├── design-system.md         # 语义化设计系统（改视觉前必读）
│   └── 第一章-两次修复复盘.md
├── assets/readme/               # README 视觉资产（SVG）
├── .github/workflows/           # deploy.yml：push 到 main 自动发布 GitHub Pages
├── package.json                 # npm run dev / build
├── README.md
└── _all_formulas.json / debug.log   # 临时/调试产物（gitignore 已覆盖前者）
```

### 数据流（关键，务必理解）

```
notes/*.md  ──(人工提供初版 + AI 按个性化要求润色, 风格一致)──►  作为内容源 / 审核基准
                                        │
src/index.html  ── formulaCard(...) 调用（在对应 buildXxxDetail() 内）
        │
        │  node scripts/extractFormulas.mjs
        ▼
src/data/formulas.js  ──(ES module export)──►  review.html 自动同步全部公式
```

**唯一事实来源（source of truth）= `src/index.html` 里的 `formulaCard(...)` 调用。**
`src/data/formulas.js` 是派生产物，永远由脚本生成，禁止手改。

---

## 2. 常用命令

```bash
npm install              # 依赖（registry 走 .npmrc 的 npmmirror 镜像）
npm run dev              # vite dev server，默认 http://localhost:8001，源码热更新（src/ 为根）
npm run build            # 纯拷贝 src/ → dist/output/，不打包、不改路径、不哈希
node scripts/extractFormulas.mjs   # 抽提公式 → 重新生成 src/data/formulas.js
```

没有 lint / test / typecheck，改完手动 `npm run dev` 或直接开浏览器验证。
**不要用 `file://` 打开 `review.html`** —— 它用 ES module `import ... from './data/formulas.js'`，必须走 HTTP。

---

## 3. 技术约束（改动时注意）

- 依赖全走 CDN：Tailwind（`cdn.tailwindcss.com`，页面里有 `tailwind.config` 扩展色板）、KaTeX（`auto-render` 渲染 `$...$` / `$$...$$`）、Swiper、Font Awesome。**不加 npm 依赖、不加构建步骤**，保持「源码 = 产物」。
- 主题：`:root` 为暗色默认，浅色用 `html[data-theme="light"]` 覆盖 CSS 自定义属性；`<head>` 里有防 FOUC 内联脚本读 `localStorage('formula-theme')` + `prefers-color-scheme`。新增 UI 必须同时适配双主题。
- `review.html` 的掌握状态存 `localStorage('review-known')`（卡 id 集合）。
- 视觉改动前先对 `docs/design-system.md`（语义化设计系统，纸张/墨色/低饱和路线）。
- 审核过的文档中题目在界面上需要展示，风格与第一章保持一致，一个知识点对应的题放一起，禁止风格是所有知识点放一起所以题目又放一起
- 我的文档里面的内容，必须要一字不落的放上页面，你自己进行智能化组织排版
- 章节内容的tab，第一个一定要是知识地图

---

## 4. 🔑 内容增量工作流（铁律）

> **核心原则：只做增量添加，绝不改动现有页面架构 / 设计 / 风格。**
> 任何「加新内容」的需求，都按下面 5 步走，顺序不可颠倒。

### 第 0 步 · 判定性质
先确认任务是不是「单纯新增内容」：
- ✅ 在已有模块里补充公式/笔记、新增一个章节笔记、补一张翻卡 → 走本流程，**只增量**。
- ❌ 重构页面结构、改视觉基调、改交互方式、重命名模块 → 不在本流程范围，先和用户确认范围，**不要擅自改**。

### 第 1 步 · 先写笔记（notes/，人工初版 + AI 润色）
笔记是「**人工给初版、AI 按用户个性化要求润色**」的协作产物，分三段：

1. **人工提供初版**：用户先给出要涉及的内容/要点，可以很粗糙（手写要点、截图、口述都行），关键是把「要覆盖哪些知识点、哪些公式」讲清楚。AI 不要替用户凭空决定范围。
2. **AI 润色成风格一致的笔记**：把初版整理成符合现有 `notes/` 规范的 Markdown：
   - 文件名遵循 `NN-章节名.md`，并在 `00-笔记索引.md` 登记。
   - 结构对齐现有笔记：一级标题 `# 章节` → 二级 `## 一、xxx` → 三级 `### 1.1 xxx`。
   - 公式用 KaTeX：行内 `$...$`，独立块 `$$...$$`。
   - 记忆口诀 / 联动说明用 `> **要点**：...` 引用块。
   - 分节之间用 `---` 分隔；表格用 Markdown 表格。
   - 不要在这里写任何 HTML / JS；notes 是纯文字内容源。
3. **按个性化要求调整**：润色时主动对齐用户偏好——例如目标难度（专升本/高考）、详略程度、考试侧重、记忆口诀风格、术语/配色习惯等。**若偏好不明确，先向用户提问再润色，不要替用户假设。**

> 这一步的产物是「润色后的笔记草稿」，仍须走第 2 步让用户审核确认，再进页面。

### 第 2 步 · 等用户审核笔记
**把笔记草稿先给用户看，等明确确认后再动页面。** 笔记是内容的审核基准——审核通过才进入页面，避免页面白做、返工。

### 第 3 步 · 笔记定稿后，先改 index.html
只在对应的 `buildXxxDetail()` 函数内**追加** `formulaCard(...)` 调用，保持既有结构不动：
```js
// 例：在 buildDerivativeDetail() 内追加一条
${formulaCard('(19)', '新公式', '$$(x^\\mu)\\' = \\mu x^{\\mu-1}$$', '口诀：指数降一次做系数', '#FFD60A')}
```
- 模块归属由**所在 build 函数**决定（见 §5 映射表），不是由颜色决定。
- 想加新模块时，新增一个 `buildXxxDetail()` 并在 `scripts/extractFormulas.mjs` 的 `sections` 数组里登记（按学习路径排好顺序），**同时更新 `00-笔记索引.md`**。
- 严禁：重排既有 card、改既有 CSS/布局、动 `.path-home` 首页结构、恢复被隐藏的 Coverflow 剧场。

### 第 4 步 · 重新生成公式数据
```bash
node scripts/extractFormulas.mjs
```
脚本扫描 `index.html` 全部 `formulaCard(...)`，按 `buildXxxDetail()` 位置分模块，重写 `src/data/formulas.js`。
`review.html` 通过 `import { FORMULAS } from './data/formulas.js'` **自动同步**所有公式——**不要手动改 review.html 的公式列表**。

### 第 5 步 · 验证 + 记录
- `npm run dev` 打开 `http://localhost:8001`，肉眼核对 index 详情页与 review 翻卡页公式正确、双主题无错位。
- 更新 `feature_list.json`（公式数、状态）与 `progress.md`（证据、下一步）。
- 提交：`feat(notes): ...` 或 `feat(index): ...`（中文描述）。

**一句话口诀：笔记(人工初版→AI润色)→用户审核→index.html 增量→extractFormulas→review 自动同步。**

---

## 5. 公式编写规范

`formulaCard(num, label, formula, note, color)` 五参：
| 参数 | 含义 |
|------|------|
| `num` | 序号标签，如 `'定1'`、`'(3)'`、`'则5'`，无则 `''` |
| `label` | 公式名，如 `'幂函数'`、`'链式法则'` |
| `formula` | KaTeX 源码，**整条用 `$$...$$` 包裹**，内部反斜杠写双反斜杠 `\\` |
| `note` | 记忆要点 / 联动说明（短句） |
| `color` | 卡片色，可写十六进制或 `var(--color-green)` 等主题变量 |

模块与 `buildXxxDetail()` 的硬映射（脚本 `splitBySection` 据此分配 module，**顺序即学习路径**）：
| build 函数 | module | 主题色 | 中文 |
|---|---|---|---|
| `buildFunctionDetail` | `limit` | `#FFD60A` | 函数·极限·连续 |
| `buildDerivativeDetail` | `deriv` | `#0A84FF` | 导数与微分（含微分，已合并） |
| `buildIntegralDetail` | `integral` | `#30D158` | 积分 |
| `buildTrigonometricDetail` | `trig` | `#FF3B30` | 三角函数 |
| `buildEquationDetail` | `diffEq` | `#FF9F0A` | 微分方程 |
| `buildLinearDetail` | `linalg` | `#5AC8FA` | 线性代数·行列式 |
| `buildMatrixDetail` | `matrix` | `#5AC8FA` | 线性代数·矩阵 |

> ⚠️ 模块固定集合为 `{ limit, deriv, integral, trig, diffEq, linalg, matrix }`。**没有 `diff` 这个 module**（微分已并入 `deriv`）。`linalg` 与 `matrix` 同属「线性代数」但为**两个独立章节/入口**（行列式 ≠ 矩阵，笔记也是 06/07 两章）。新增 build 函数时注意在脚本 `sections` 与 `MODULE_ORDER` 中同步。

当前公式总量：**205 条**（deriv 87 / integral 19 / trig 41 / diffEq 9 / linalg 7 / matrix 29 / limit 13；6 模块基线为 176，矩阵独立成章后 +29）。

---

## 6. 部署与其他

- `.github/workflows/deploy.yml` 在 push 到 `main` 时把 `src/` 直接发布到 GitHub Pages。
- `notes/` 是站点内容的 Markdown 镜像，改公式若影响文字内容需同步。
- `.workbuddy/memory/` 是每日开发日志，大改动后追加记录（参考已有格式）。
- 根目录 `_all_formulas.json`、`debug.log` 是临时/调试产物。
