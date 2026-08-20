# session-handoff.md — 跨会话交接

给「下一会话」的冷启动摘要。读完即可在不依赖聊天历史的前提下继续工作。

## 这是什么
四川专升本高数公式联动记忆系统 `calculus-formula-theater`（本地目录「面容整理」）。
纯静态 HTML 单页应用，无框架、无打包器，浏览器直接读 `src/`。

## 关键不变量（违反即出错）
1. **只增量、不改架构**：加内容就在既有结构里追加，绝不重构页面/改设计/改风格。
2. **公式唯一事实来源 = `src/index.html` 的 `formulaCard(...)` 调用**。
3. `src/data/formulas.js` 是派生产物，永远由 `scripts/extractFormulas.mjs` 生成，**禁止手改**。
4. 模块固定 `{ limit, deriv, integral, trig, diffEq, linalg }`，**没有 `diff`**（微分已并入 deriv）。
5. `review.html` 的公式列表是自动同步的，禁手动改。
6. 所有改动必须同时适配暗/浅双主题。

## 加新内容的标准流程（必须按序）
1. 在 `notes/` 写笔记——**人工先给初版（要覆盖哪些内容/公式），AI 再按用户个性化要求润色成风格一致的 Markdown**，并在 `00-笔记索引.md` 登记。偏好不明时先向用户提问。
2. **先给用户看笔记草稿，等审核确认**，再动页面。
3. 在 `src/index.html` 对应 `buildXxxDetail()` 内**增量追加** `formulaCard(num, label, formula, note, color)`。
4. 跑 `node scripts/extractFormulas.mjs` → 重写 `formulas.js` → `review.html` 自动同步。
5. `npm run dev` 打开 `http://localhost:8001` 核对 index 详情页与 review 翻卡页（双主题），更新 `feature_list.json` / `progress.md`。

> 口诀：**笔记先写 → 用户审核 → index.html 增量 → extractFormulas → review 自动同步**。

## 模块 ↔ build 函数 ↔ 笔记 映射
| module | build 函数 | 笔记 | 主题色 |
|---|---|---|---|
| limit | buildFunctionDetail | notes/01-函数、极限、连续.md | #FFD60A |
| deriv | buildDerivativeDetail | notes/02-导数与微分.md | #0A84FF |
| integral | buildIntegralDetail | notes/04-积分.md | #30D158 |
| trig | buildTrigonometricDetail | notes/05-三角函数.md | #FF3B30 |
| diffEq | buildEquationDetail | notes/06-微分方程.md | #FF9F0A |
| linalg | buildLinearDetail | notes/07-线性代数-行列式.md | #5AC8FA |

## 当前进度
6 模块全部就位，公式总量 **176 条**（deriv 87 / integral 19 / trig 41 / diffEq 9 / linalg 7 / limit 13）。
详见 `progress.md` 与 `feature_list.json`。

## 常用命令
```bash
npm run dev                          # http://localhost:8001
node scripts/extractFormulas.mjs     # 重新生成公式数据（验证门禁）
bash init.sh                         # 验证门禁：生成 + 校验 + 提示
```

## 不要碰的东西
- `.path-home` 首页结构、被 CSS 隐藏的 Coverflow 剧场（`.sidebar-container` / `.main-stage`）、`prototypes/`、`assets/readme/`、`.github/workflows/edgeone.yml`（失效遗留）。
- 任何 `var(--...)` 主题变量定义与防 FOUC 脚本。
