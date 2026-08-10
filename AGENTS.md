# AGENTS.md

四川专升本高数公式记忆系统（`calculus-formula-theater`）。纯静态 HTML 单页应用，无框架、无打包器。**中文沟通，commit message 用中文**（`feat`/`style`/`chore` + 中文描述，如 `style(src): 统一 index.html 与 review.html 视觉基调`）。

## 常用命令

```bash
npm install          # 依赖（registry 走 .npmrc 的 npmmirror 镜像）
npm run dev          # vite dev server，默认 http://localhost:8001，源码热更新（src/ 为根）
npm run build        # 纯拷贝 src/ → dist/output/，不打包、不改路径、不哈希
```

没有 lint / test / typecheck，改完手动 `npm run dev` 或直接开浏览器验证。**不要用 `file://` 打开 `review.html`** —— 它用 ES module `import ... from './data/formulas.js'`，必须走 HTTP。

## 核心文件与数据流

- `src/index.html`（~260KB）—— 主应用，HTML/CSS/JS 全内联。当前主视图是 `.path-home` 知识路径首页（7 模块行）；旧版 Coverflow 卡片剧场 `.sidebar-container`/`.main-stage` 已被 CSS 隐藏（`#main-view > .sidebar-container, #main-view > .main-stage { display:none }`），别去恢复。详情渲染靠 `enterDetail()` / `exitDetail()` / `switchTab()`。
- `src/review.html` —— 翻卡记忆页，公式数据从 `src/data/formulas.js` import。
- `src/data/formulas.js` —— index.html 与 review.html 共享的公式数据，**自动生成，勿手改**。
- `scripts/extractFormulas.mjs` —— 从 `src/index.html` 抽提 `formulaCard(num, label, formula, note, color)` 调用，按 `buildXxxDetail` 函数位置分模块，重写 `src/data/formulas.js`。

**改公式的正确流程**：改 `src/index.html` 里的 `formulaCard(...)` → 跑 `node scripts/extractFormulas.mjs` 重新生成 `src/data/formulas.js` → 翻卡页自动同步。模块 id 集合固定为 `{ deriv, diff, integral, trig, diffEq, linalg, limit }`（脚本 `splitBySection` 里有硬编码映射，新增 build 函数时要注意）。

## 技术约束（改动时注意）

- 依赖全走 CDN：Tailwind（`cdn.tailwindcss.com`，页面里有 `tailwind.config` 扩展色板）、KaTeX（`auto-render` 渲染 `$...$`）、Swiper、Font Awesome。**不加 npm 依赖、不加构建步骤**，保持"源码 = 产物"。
- 主题：`:root` 为暗色默认，浅色用 `html[data-theme="light"]` 覆盖 CSS 自定义属性；`<head>` 里有防 FOUC 内联脚本读 `localStorage('formula-theme')` + `prefers-color-scheme`。新增 UI 必须同时适配双主题。
- `review.html` 的掌握状态存 `localStorage('review-known')`（卡 id 集合）。
- 设计基准看 `docs/design-system.md`（语义化设计系统，纸张/墨色/低饱和路线）改视觉前先对这份文档。

## 部署与其他

- `.github/workflows/deploy.yml` 在 push 到 `main` 时把 `src/` 直接发布到 GitHub Pages（`.github/workflows/edgeone.yml` 引用不存在的 `app/` 目录，是失效的遗留文件，别依赖它）。
- `notes/` 是站点内容的 Markdown 镜像（按章节），改公式时若影响文字内容需同步。
- 根目录 `_all_formulas.json`、`debug.log` 是临时/调试产物（gitignore 已覆盖前者）。
- `.workbuddy/memory/` 是每日开发日志，改完大改动可追加记录（参考已有格式）。
