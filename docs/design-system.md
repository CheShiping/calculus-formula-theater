# calculus-formula-theater · 设计系统

> 版本：v0.2（2026-08-10）· 同步自现有实现（`src/index.html` + `src/review.html`）
> 设计参考原型：`src/prototypes/prototype-b-map.html`（知识路径，被选为落地方向）；

---

## 0. 现状与来源（先读这里）

- 纯静态 HTML，无框架、无打包器，「源码 = 产物」。主应用 `src/index.html`（约 260KB，HTML/CSS/JS 全内联），翻卡页 `src/review.html`。
- **主视图**是知识路径首页 `.path-home`（7 模块垂直时间轴）；旧版 Coverflow 卡片剧场（`.sidebar-container`/`.main-stage`）仍在 HTML/JS 里，但被 CSS `display:none` 隐藏，不要恢复。
- **双主题**：`:root` 为暗色默认，浅色用 `html[data-theme="light"]` 覆盖全部 CSS 自定义属性；`<head>` 内有防 FOUC 内联脚本（读 `localStorage('formula-theme')` + `prefers-color-scheme`）。新增任何 UI 都必须同时适配两套主题变量。
- **依赖全走 CDN**：Tailwind（`cdn.tailwindcss.com`，页面内 `tailwind.config` 扩展色板）、KaTeX（`auto-render` 渲染 `$...$`）、Swiper（仅隐藏轮播仍在加载）、Font Awesome。**不加 npm 依赖、不加构建步骤**。
- 公式数据流：`src/index.html` 内联的 `formulaCard(...)` 调用 → `scripts/extractFormulas.mjs` 抽提 → `src/data/formulas.js` → `src/review.html` 以 ES module import。公式数据**勿手改**，改公式一律改 `index.html` 后重跑脚本（详见 §8）。

---

## 1. 设计原则（实际落地）

| # | 原则 | 落地手段 |
|---|------|----------|
| 1 | **文字 + 公式双主体** | 详情页段落（`.chapter-flow-step`/`.pair-card`/`.special-table`）与 `.formula-card` 公式卡是平等的呈现单元，口诀、联动说明、例题标注穿插其中 |
| 2 | **联动 > 罗列** | 每条公式配「记忆口诀 / 联动说明」；导数↔积分、二倍角↔降幂、平方关系↔六边形显式互链 |
| 3 | **暗色科技 + 浅色纸张双主题** | 暗色：`#000` 深底 + 白字 + 低饱和 Apple 模块色；浅色：暖纸底 `#fbf9f2` + 墨字；品牌暖绿 `--color-green` 贯穿两页 |
| 4 | **克制动效，全部 CSS** | 不引 GSAP/Framer；hover 0.2-0.3s、视图切换 0.4-0.55s、翻卡 0.8s，均为 ease-out / ease-in-out |
| 5 | **尊重系统动效偏好** | 两页都有 `@media (prefers-reduced-motion: reduce)` 兜底（入场/翻转/呼吸动画全部禁用） |
| 6 | **响应式先 desktop 后 mobile** | 桌面为两栏/居中大布局；`≤1200px` 隐藏次要导航文案；`≤768px` 收窄 padding、缩小图标按钮（36px）、双列布局转单列 |

---

## 2. 字体系统

### 2.1 字体栈（实际加载）

```html
<link href="https://fonts.font.im/css2?family=Inter:wght@400;600;800&family=JetBrains+Mono:wght@500;700&family=Noto+Sans+SC:wght@400;600;800&display=swap" rel="stylesheet">
```

```css
/* 正文：Inter → Noto Sans SC → sans-serif */
font-family: 'Inter', 'Noto Sans SC', sans-serif;
/* 编号/标签/meta/按钮：JetBrains Mono */
font-family: 'JetBrains Mono', monospace;
```

`tailwind.config` 里同名映射：`sans` = Inter + Noto Sans SC，`mono` = JetBrains Mono。

### 2.2 字阶（实际用值，全部 rem）

| 用途 | 选择器 | 字号 | 字重 | 行高 | letter-spacing | 备注 |
|------|--------|------|------|------|----------------|------|
| 知识路径主标题 | `.path-intro h1` | `clamp(2.7rem, 5.2vw, 4.8rem)` | 800 | 1.05 | **-0.075em** | 中文大标题压字距 |
| 页面 H1 | `.hero h1`（review） | 1.75-2rem | 800 | 1.15 | 0 | 翻卡页标题 |
| 路径节点标题 | `.path-node h2` | 1.05rem | 800 | — | — | 模块名 |
| Eyebrow | `.path-eyebrow` | 0.72rem | 800 | — | 0.14em | 绿色「KNOWLEDGE PATH」 |
| Mono 引导条 | `.page-eyebrow` | 0.72rem | 700 | — | — | JetBrains Mono |
| 副标题 | `.hero-subtitle` | 1rem | 700 | — | — | `--color-green` |
| 节点描述 | `.path-node p` | 0.78rem | 400 | 1.7 | 0 | `--path-muted` |
| 引入段 | `.path-intro p` | 0.92rem | 400 | 1.85 | 0 | `--path-muted` |
| 列表条目 | `.chapter-flow-step` | 0.92rem | 400 | 1.75 | 0 | 详情页 |
| 公式标签 | `.formula-label` | 0.7rem | 700 | — | 1px | JetBrains Mono，UPPERCASE，色 = `--card-accent` |
| 公式备注 | `.formula-note` | 0.75rem | 400 | — | 0 | `--text-dim` |
| 公式编号 | `.formula-num` | 0.65rem | 700 | — | — | JetBrains Mono，`--text-ghost`，右上角 |
| 路径 meta | `.path-meta` / `.path-count` | 0.68-0.76rem | 700 | — | — | JetBrains Mono，`--node-color` |
| 筛选 chip | `.chip` | 0.78-0.85rem | 600 | — | — | 翻卡页 |
| 返回按钮 | `.back-btn` | 0.85rem | 400 | — | — | JetBrains Mono |
| 翻卡头 | `.flip-header` | 0.7rem | 700 | — | 0.05em | UPPERCASE |
| KaTeX 公式 | `.formula-card .katex` | 1.05em | — | — | — | 继承 `--text-primary` |

**硬约束**：段落正文 ≥ 0.85rem；大标题（≥ 2rem）允许负 letter-spacing；中文标题不用全大写。

---

## 3. 色板

色板全部走 CSS 自定义属性，无命名空间细分（无 `--space-*`/`--radius-*`/`--shadow-1/2/3`），直接用变量名语义。**新增 UI 必须引用既有变量，不硬编码色值。**

### 3.1 全局主题变量（`src/index.html` 与 `src/review.html` 共享命名）

| 变量 | 暗色（index） | 浅色（两页同） | 用途 |
|------|--------------|----------------|------|
| `--bg-body` | `#000` | `#f5f6f8` | 页面底色 |
| `--bg-main-stage` | radial 渐变 `#0f1117→#000` | `#fff→#eef0f4` | 主舞台背景 |
| `--bg-sidebar` | `rgba(15,15,20,0.7)` | `rgba(255,255,255,0.75)` | 侧栏/顶栏毛玻璃底 |
| `--bg-card` | `rgba(30,32,40,0.5)` | `rgba(255,255,255,0.7)` | 卡片底 |
| `--bg-card-active` | `rgba(40,45,55,0.7)` | `rgba(255,255,255,0.95)` | 激活卡片底 |
| `--bg-elevated` / `-hover` | `rgba(255,255,255,0.03)` / `.06` | `rgba(0,0,0,0.03)` / `.06` | 公式卡、tab 底 |
| `--bg-detail` / `-header` | `#06070a` / `rgba(6,7,10,0.85)` | `#f7f8fa` / `rgba(247,248,250,0.88)` | 详情页/吸顶头 |
| `--bg-formula` | `rgba(0,0,0,0.3)` | `rgba(0,0,0,0.04)` | 公式独立背景 |
| `--text-primary` | `#fff` | `#1a1d24` | 主文本 |
| `--text-secondary` | `#d1d5db` | `#2d3139` | 次级文本 |
| `--text-muted` | `#9ca3af` | `#5a6172` | 弱化文本 |
| `--text-dim` | `#6b7280` | `#767d8c` | 出处、辅助 |
| `--text-faint` / `-ghost` | `rgba(255,255,255,.5)` / `.2` | `rgba(0,0,0,.55)` / `.25` | 极弱文本/编号 |
| `--border-soft` / `-medium` / `-strong` | `.08` / `.12` / `.25` 白 | `.08` / `.12` / `.2` 黑 | 分隔线/描边三级 |
| `--shadow-card` | `0 20px 50px rgba(0,0,0,0.6)` | `0 20px 50px rgba(0,0,0,0.15)` | 卡片主投影 |
| `--shadow-hover` | `0 8px 30px rgba(0,0,0,0.3)` | `0 8px 30px rgba(0,0,0,0.1)` | hover 投影 |
| `--shadow-active` | `0 0 50px rgba(10,132,255,0.15)` | `0 0 50px rgba(10,132,255,0.2)` | 激活卡片辉光 |
| `--accent-yellow` | `#FFD60A` | `#C88800` | 高亮/荧光笔（浅色降饱和保对比度） |
| `--accent-yellow-text` | `#FFD60A` | `#8a5e00` | 黄色背景上的文字 |
| `--color-green` | `#6fae87` | `#5f9977` | **品牌暖绿**（CTA/进度/已掌握） |
| `--color-green-06…60` | `rgba(111,174,135,…)` | `rgba(95,153,119,…)` | 绿色 6%-60% 透明度梯度 |

> `review.html` 暗色主题在此基础上**换成暖棕底**（`--bg-body:#17140f`、`--bg-card:rgba(52,44,32,.5)`、`--border-soft:rgba(255,238,210,.10)` 等），浅色与 index 完全一致；token 命名与 index 共用，改一页时注意另一页的暗色变体也要手动同步。

### 3.2 知识路径首页 `.path-home`（纸张变量）

| 变量 | 暗色 | 浅色（纸张） |
|------|------|--------------|
| `--path-paper` | `#1b1a16` | `#fbf9f2` |
| `--path-ink` | `#ecebe2` | `#1e201d` |
| `--path-muted` | `#9b9a8d` | `#77786f` |
| `--path-line` | `rgba(236,235,226,.12)` | `rgba(30,32,29,.14)` |
| `--path-green` | `#6fae87` | `#5f9977` |
| `--path-violet` | `#b3a4cc` | `#a192ba` |
| `--path-blue` | `#8fb0c4` | `#7d9eb3` |
| `--path-amber` | `#c9ab74` | `#b89a65` |
| `--path-coral` | `#cd9b94` | `#bd8b84` |

背景为纸底 + 两处低透明度径向光斑（右上绿 `rgba(111,174,135,.10)`、左下紫 `rgba(179,164,204,.08)`；浅色对应 `.64`/`.52` 更明显的柔光）。7 个节点色：函数极限=`--path-blue`、导数=`--path-violet`、微分=`#a887ad`、积分=`--path-green`、三角=`--path-coral`、微分方程=`--path-amber`、线性代数=`#759ba1`（后两个为行内色值）。

### 3.3 模块色（详情页公式卡 / 翻卡页筛选）

公式卡 `--card-accent` 与 `.formula-label` 取模块色，色值来源为 `extractFormulas.mjs` 里各 `buildXxxDetail` 段的映射：

| 模块 id | 标题 | 颜色 |
|---------|------|------|
| `limit` | 函数·极限·连续 | `#FFD60A` |
| `deriv` | 导数 | `#0A84FF` |
| `diff` | 微分 | `#BF5AF2` |
| `integral` | 积分 | `#30D158`（侧栏轮播用 `var(--color-green)`） |
| `trig` | 三角函数 | `#FF3B30` |
| `diffEq` | 微分方程 | `#FF9F0A` |
| `linalg` | 线性代数 | `#5AC8FA` |

> 注意：`formulas.js` 实际只抽提用到 `formulaCard()` 的 5 个模块（deriv 18 / diff 16 / integral 19 / trig 41 / diffEq 9 = 103 条）；`limit`、`linalg` 的详情用 `.formula-card` 内联 div 书写，不走数据流，翻卡页筛选里看不到它们。

### 3.4 Tailwind 扩展色板（`tailwind.config`）

`primary:#0A84FF`、`accent:var(--color-green)`、`warning:#FFD60A`、`danger:#FF3B30`、`purple:#BF5AF2`、`orange:#FF9F0A`、`cyan:#5AC8FA`。**注意 `accent` 绑定的是 CSS 变量**（主题感知），其余为固定 Apple 色。

---

## 4. 间距与圆角

没有 token 化，直接用 rem 书写；常用档位如下：

| 档位 | 值 | 用途 |
|------|-----|------|
| 极密 | 0.4-0.55rem | tab / chip / 按钮内边距 |
| 常规 | 0.75-1.25rem | 卡片 padding（`.formula-card` 1.25rem、`.flip-face` 1.1rem 1.2rem）、按钮 0.5rem 1rem |
| 页面级 | 1.15-2rem | `.detail-body` 2rem、`.detail-header` 1rem 2rem、`.path-home` 2rem 3.4rem |
| 栅格 gap | 0.5-0.6rem | tab 组、chip 组、图标按钮组 |

**圆角**：卡片/翻卡面 16px；tab 8px；返回按钮 10px；筛选 chip 22px（桌面胶囊）/ 8px（移动端压缩）；顶部圆形图标按钮 44×44px `border-radius:50%`；路径 CTA `.path-review` 胶囊 `999px`。**硬约束：卡片圆角统一 16px，圆角上限 22px，不出现更大的「AI 模板大圆角」。**

---

## 5. 阴影与动效

### 5.1 阴影（实际值见 §3.1 表）

三层语义：`--shadow-card`（静态/翻卡面，大而柔）、`--shadow-hover`（hover 浮起，小且贴边）、`--shadow-active`（激活卡片的蓝色辉光）。浮起实现为 `translateY(-2px)` + `--shadow-hover`，配合 `--border-medium`。

### 5.2 动效曲线

```css
--ease-out:     cubic-bezier(0.23, 1, 0.32, 1);   /* 默认出场 */
--ease-in-out:  cubic-bezier(0.77, 0, 0.175, 1);  /* 主题切换 / CTA 呼吸 */
```

### 5.3 关键动效清单（全部 CSS，无 GSAP）

| 场景 | 实现 | 时长 | 缓动 |
|------|------|------|------|
| 主题切换 | body/`#main-view` `background-color .4s` | 400ms | ease |
| 详情页进入/退出 | `#detail-view` opacity + `scale 1.04→1` | 450ms | `--ease-out` |
| 首页 intro 上浮 | `@keyframes fadeUp`（16px→0） | 500ms | ease both |
| 路径行滚动渐显 | IntersectionObserver 加 `.reveal`，`translateY(28px)→0` | 550ms | `cubic-bezier(0.25,0.8,0.25,1)` |
| 翻卡 3D 翻转 | `rotateY(180deg)` + `preserve-3d`，`perspective:1400px` | 800ms | `cubic-bezier(0.25,0.8,0.25,1)` |
| 翻卡成组错峰入场 | `.enter` 逐个添加，`translateY(18px) scale(.98)` | 400ms/张 | 同上 |
| 卡片 hover | `translateY(-2px)` + 边框/阴影过渡 | 200-300ms | ease |
| CTA 呼吸 | `@keyframes ctaBreathe`（x 位移 + 阴影）无限循环 | 2500ms | `--ease-in-out` |
| 全局 reduced-motion | 两页均有 `prefers-reduced-motion: reduce` 兜底，入场/翻转/呼吸全部关闭 | — | — |

---

## 6. 组件

### 6.1 顶部操作区 `.top-actions`

- 固定右上（`top:1.25rem; right:1.5rem`，路径页 `right:3.4rem`），`z-index:200`。
- 纯图标按钮：44×44px 圆形，`--bg-sidebar` 毛玻璃（`backdrop-filter: blur(20px)`）+ `--shadow-card` + 1px `--border-medium`；hover `scale(1.1)` + `--border-strong`。
- 翻卡入口 `.top-action-review`：带文字胶囊，绿系（`--color-green-13` 底 + `--color-green-45` 边框 + `--color-green` 文字），`border-radius:22px`。
- 主题图标用 Font Awesome，`:root` 显示月牙/浅色显示太阳（`.icon-sun`/`.icon-moon` 切换 display）。
- 移动端（≤768px）缩为 36px 圆形。

### 6.2 知识路径首页 `.path-home`

- `.path-nav`：左 `.path-brand`（绿点 + 800 字重标题），右 `.path-nav-copy`（Mono 文案，≤1200px 隐藏）。
- `.path-intro`：Eyebrow（绿，`ls .14em`）+ H1 `clamp(2.7rem,5.2vw,4.8rem)` + 引入段 + 右上 `.path-count`（Mono，`22 公式` 之类）。
- `.learning-path`：相对定位容器，`:before` 为**中央 1px 竖线时间轴**；`.path-row` 三栏网格 `1fr 120px 1fr`，`.path-node` 左右交替，`.path-row::after` 为 10px 圆点节点标记，`.path-node::after` 为 55px 短横线连向中轴。
- `.path-node`：无边框按钮，上边框 `1px currentColor`（模块色）；hover 向中轴方向 `translateX(±5px)`；`:focus-visible` 有 2px ink 描边。内部：`h2`（ink）+ `p`（muted）+ `.path-meta`（Mono，色点 + 「N 条公式 · 标签」）。
- `.path-footer`：上边框分隔，左侧说明文字，右侧 `.path-review` 胶囊 CTA（ink 底 + paper 字 + 呼吸动画）。

### 6.3 详情页 `#detail-view`

- 全屏 overlay（fixed），默认 `opacity:0; pointer-events:none; scale(1.04)`，`.active` 时过渡进入；`z-index:100`。
- `.detail-header`：sticky 吸顶，`--bg-detail-header` + `backdrop-filter: blur(30px)` + 底部 1px `--border-soft`；含 `.back-btn`（Mono、圆角 10px）、`h2` 标题（颜色 = 当前模块色）、`.detail-tabs`。
- `.detail-tab`：0.8rem/600，`.active` 用 `--tab-color`/`--tab-border`（模块色 20%/40% 透明度）作底和边框，`border-radius:8px`。
- `.detail-body`：`max-width:1200px; margin:0 auto; padding:2rem`；内部 `.detail-section` 按 tab 显示/隐藏。
- 内容区块：`.group-title` 小节标题、`.formula-card`（见 6.4）、`.chapter-flow-step` 网格行（5.5rem 时列 + 文本）、`.pair-card`、`.special-table`、`.chapter-example-card` 真题卡、交互式六边形 SVG（`.hex-vertex` 等，顶点填充 `--hex-vertex-fill`、标签色 `--hex-label-color`）。
- 移动端有「左右滑动切换」提示 `.swipe-hint`。

### 6.4 公式卡 `.formula-card`

```css
.formula-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border-soft);
  border-radius: 16px; padding: 1.25rem;
  position: relative; overflow: hidden;
  transition: all .3s ease;
}
.formula-card::before {      /* 左侧 3px 模块色条 */
  content: ''; position: absolute; top: 0; left: 0;
  width: 3px; height: 100%;
  background: var(--card-accent, #0A84FF); opacity: .6;
}
.formula-card:hover {
  background: var(--bg-elevated-hover);
  border-color: var(--border-medium);
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}
```

内部结构：`.formula-num`（右上角 Mono 编号）、`.formula-label`（模块色大写标签）、`.formula-block`（KaTeX `$$...$$`，可带独立 `--bg-formula` 背景）、`.formula-note`（口诀/联动说明，`.formula-meta` 等）。`--card-accent` 由每张卡内联设定。

### 6.5 翻卡 `.flip-card`（`review.html`）

- 结构：`.flip-card > .flip-card-inner > .flip-face.front / .back`；`perspective:1400px`，卡高 240px。
- 翻转：`.flipped .flip-card-inner { transform: rotateY(180deg) }`，`transform-style:preserve-3d`，800ms；hover 时 `translateY(-2px)` 微浮起。
- 卡面 `.flip-face`：圆角 16px、1px `--border-soft`、`--bg-elevated` + `backdrop-filter: blur(20px)`、`--shadow-card`；`:before` 左侧 3px 模块色条（与 `.formula-card` 完全同款）；hover 加深为 `--bg-elevated-hover` + `--border-medium` + `--shadow-hover`。
- 卡内结构：正反面都是 `.flip-header`（`num` Mono 编号 + `label` UPPERCASE 标签）、`.flip-body`、`.flip-footer`。
  - 正面：`.question-formula`（题目公式，答案一侧被遮）、`.flip-footer` 提示「点击翻面」+ 模块名。
  - 反面：`.answer-formula`（完整答案 KaTeX）+ `.note`（口诀/联动说明），`.flip-footer` 内 `.know-btn`（「标记掌握」↔「已掌握」）+「点击翻回」。
- 页面骨架：顶部 `.hero`（`.page-eyebrow` Mono 引导 + `h1` + `.hero-subtitle` 绿副题 + 描述，底部 1px 分隔），`.filter-bar` 模块筛选 chips（桌面 22px 胶囊、移动端 8px 双列），`#cardGrid .card-grid` 网格（`repeat(auto-fill, minmax(280px, 1fr))`），底部 `.toolbar`（统计 + 批量翻面/重置按钮）。
- 掌握状态存 `localStorage('review-known')`（卡 id 集合），已掌握卡用 `--color-green` 系标记（`.know-btn.is-known`）；模块筛选 `.chip` 带 `count` 徽标。

---

## 7. 页面与模块清单

| 页面 | 文件 | 视图/模块 |
|------|------|-----------|
| 主应用 | `src/index.html` | `.path-home`（7 模块入口）+ `#detail-view`（7 个 `buildXxxDetail` + overview） |
| 翻卡记忆 | `src/review.html` | 模块筛选 + 翻卡网格（103 张，来自 `formulas.js`） |
| 公式数据 | `src/data/formulas.js` | 自动生成（见 §8） |
| 原型 | `src/prototypes/` | 4 份设计探索（含被选中的 `prototype-b-map.html`） |

模块 id 固定集合：`{ deriv, diff, integral, trig, diffEq, linalg, limit }`（+ 总览 `overview`）。注意 `linalg`、`limit` 的详情内容存在但不进入公式数据流。

---

## 8. 数据流与改公式流程

```
src/index.html 内联 formulaCard(num, label, formula, note, color)
        │  node scripts/extractFormulas.mjs
        ▼
src/data/formulas.js  ← 自动生成，勿手改
        │  ES module import
        ▼
src/review.html（翻卡页）
```

- **改公式**：改 `src/index.html` 里的 `formulaCard(...)`（或 `buildXxxDetail` 段内容）→ 跑 `node scripts/extractFormulas.mjs` 重新生成 `src/data/formulas.js` → 翻卡页自动同步。线性代数/函数极限模块的内容是 `.formula-card` 内联 div，不在数据流里，改了不会进翻卡页。
- 脚本按 `function buildXxxDetail` 的位置切分模块（`splitBySection` 硬编码映射），新增 build 函数时同步更新脚本的 `sections` 数组。
- 若改动影响 `notes/` 的文字内容，需同步 Markdown 镜像。

---

## 9. 维护自查清单

- [ ] **双主题**：新增 UI 全部引用 CSS 变量，`[data-theme="light"]` 有对应覆盖；改 index 的暗色变量时检查 review 的暖棕变体是否同步
- [ ] **reduced-motion**：入场/翻转/循环动画加 `prefers-reduced-motion: reduce` 兜底
- [ ] **依赖**：只走 CDN，不加 npm 依赖、不加构建步骤；公式用 KaTeX `$...$`/`$$...$$` 而非图片
- [ ] **公式数据**：数据改在 `index.html`，重跑 `scripts/extractFormulas.mjs`，不直接编辑 `formulas.js`
- [ ] **视觉基准**：改样式前对照本文档与 `docs/design-qa.md`、`docs/oiloil-design-review.md`；与实现不一致时以代码为准并回填文档
- [ ] **不恢复**已废弃的 Coverflow 剧场（`.sidebar-container`/`.main-stage` 保持 `display:none`）
