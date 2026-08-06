# calculus-formula-theater · 设计系统

> 版本：v0.1（2026-08-06）· Phase 3 产物
> 配套原型：[.trae/prototypes/](../.trae/prototypes/) 下的 5 份 HTML
> 上游文档：[.trae/documents/prd-p0p1-implementation-plan.md](../.trae/documents/prd-p0p1-implementation-plan.md)

本文档由 3 个 UI/UX 设计技能联合产出：`design-taste-frontend`（反 slop 基线）+ `stitch-design-taste`（语义化设计系统）+ `gpt-taste`（GSAP 动效蓝图）。它是后续 Phase 4-6 编码实现的唯一参考源——任何与本文档不一致的视觉/交互都需要先回来更新本文档。

---

## 1. 设计原则

| # | 原则 | 落地手段 |
|---|------|----------|
| 1 | **文字 + 公式双主体** | 详情页段落 + 公式卡片是平等的呈现单元，不让公式"抢戏"也不让文字"失声" |
| 2 | **联动 > 罗列** | 公式之间用「联动说明」「记忆口诀」显式连接（积分是导数的逆运算，平方关系由根基除以 cos² 得到） |
| 3 | **反 slop**：拒绝玻璃拟态、紫蓝渐变大标题、3D 拟物图标 | 改用平面 + 1px 细线边框 + 局部渐变（仅 hero 区域、进度条）、SVG 线性图标 |
| 4 | **克制动效**：动效服务于状态变化，不为动而动 | 200-600ms 内完成，spring 仅用于答题反馈；其他用 ease-out 即可 |
| 5 | **响应式先 mobile 后 desktop** | 12-col 网格在 < 900px 折叠为单列；导航链接、控件均触屏可点（44px+） |
| 6 | **零依赖渲染**：仅 KaTeX + 原生 CSS | 不引 Tailwind / styled-components / Framer Motion；翻卡 3D 用纯 CSS |

---

## 2. 字体系统

### 2.1 字体栈

```css
/* 正文字体栈：Geist 优先，回退到系统字体 */
--font-sans: 'Geist', 'Inter Tight', system-ui, -apple-system, 'Noto Sans SC', sans-serif;

/* 公式代码栈：Geist Mono + JetBrains Mono + LaTeX 所需 fallback */
--font-mono: 'Geist Mono', 'JetBrains Mono', 'SF Mono', 'Cascadia Code', monospace;

/* 渲染设置：开启 cv11/ss01/ss03 等 Geist 开放字形特性 */
font-feature-settings: 'cv11', 'ss01', 'ss03';
-webkit-font-smoothing: antialiased;
```

**取用理由**：Geist 提供现代 sans 的几何感 + 中文回落 Noto Sans SC 时仍保持自然字距；Geist Mono 用于「口诀」「提示词」「键盘快捷键」等强语义字符，与公式的 LaTeX 字符视觉协调。

### 2.2 字体阶梯

| 用途 | Token | 字号 | 字重 | 行高 | letter-spacing | 备注 |
|------|-------|------|------|------|----------------|------|
| Hero H1 | `.h-hero` | `clamp(2.4rem, 4.6vw, 4rem)` | 700 | 1.04 | -0.025em | 渐变高亮单词用 `<span class="accent">` |
| 章节 H1 | `.h-section` | `clamp(1.8rem, 3vw, 2.4rem)` | 700 | 1.1 | -0.02em | 框架梳理叙事标题 |
| 页面 H1 | `.h-page` | 32px | 700 | 1.1 | -0.02em | 翻卡/自测/搜索页 |
| 段落 H2 | `.h-2` | 28px | 700 | 1.2 | -0.02em | 章节内子标题 |
| 卡片标题 | `.h-3` | 17-18px | 700 | 1.3 | -0.01em | 入口卡 / 翻卡类别 |
| Body Lede | `.lede` | 17px | 400 | 1.55 | 0 | max-width: 52ch |
| Body | `.body` | 15-15.5px | 400 | 1.6 | 0 | 默认正文 |
| Body Small | `.small` | 13.5px | 400 | 1.55 | 0 | 描述、提示 |
| Caption | `.caption` | 12.5-13px | 400 | 1.5 | 0 | 例题出处、统计 |
| Eyebrow | `.eyebrow` | 11-12px | 600 | 1 | 0.04-0.08em | UPPERCASE 中文场景用 letter-spacing 0.04em |
| Code/Kbd | `.kbd` | 11-12px | 500 | 1 | 0 | Geist Mono + 4px 圆角浅色背景 |
| Formula（行内） | `.tex` | 16-22px | 400 | 1.2 | 0 | KaTeX 渲染，色 = `--accent` |
| Formula（块级） | `.tex-display` | 28px | 400 | 1.2 | 0 | KaTeX displayMode |

**正文字号硬约束**：段落正文不得小于 15px（移动端 16px）。这是与 PRD「框架梳理是文字描述」项目主体定位匹配——文字是主要阅读对象，不能因为公式卡片好看就压制文字。

---

## 3. 色板

### 3.1 中性色（Canvas / Surface / Ink）

| Token | 值 | 用途 |
|-------|-----|------|
| `--canvas` | `#F9FAFB` | 页面底色（接近白但保留 3% 灰，避免与卡片对比过强） |
| `--surface` | `#FFFFFF` | 卡片、按钮、搜索框表面 |
| `--ink` | `#18181B` | 主文本（接近黑，比纯黑柔） |
| `--ink-2` | `#3F3F46` | 次级文本、副标题、说明 |
| `--muted` | `#71717A` | 弱化文本、出处、辅助 |
| `--line` | `rgba(24,24,27,0.08)` | 1px 分隔线、卡片描边 |

**反 slop 自查**：「黑灰白」饱和度都 < 5%，避免常见 AI 模板的「#000 黑 + #FFF 纯白」硬反差。

### 3.2 主色（Accent）

| Token | 值 | 用途 |
|-------|-----|------|
| `--accent` | `#4F6BFF` | 主品牌色（电光蓝），用于品牌 mark、CTA hover、链接 active、公式着色 |
| `--accent-soft` | `rgba(79,107,255,0.08)` | 链接背景、tab 高亮底色、搜索框 focus halo |
| `--accent-2` | `#B14BFF` | 渐变收尾色（**仅**用于 hero 标题渐变、进度条、状态点 pulse） |
| `--accent-deep` | `#0A84FF` | 章节详情页主色（章节色之一），与全局 accent 区分以示层级 |

**反 slop 自查**：除 hero 标题 + 进度条 + brand mark 之外，**禁止**单独使用 `--accent-2` 紫；它必须依附于蓝色出现，避免「紫蓝渐变标题」典型 AI 模板套路。

### 3.3 状态色

| Token | 值 | 用途 |
|-------|-----|------|
| `--success` | `#00C48C` | 答题正确、翻面后的「已掌握」高亮 |
| `--success-soft` | `rgba(0,196,140,0.10)` | 答题正确选项背景 |
| `--success-ink` | `#007a55` | success-soft 背景上的文字色（保证 4.5:1 对比度） |
| `--warn` | `#FFB800` | 「注意」「高频考点」标签 |
| `--danger` | `#FF4D6D` | 答题错误、删除、不可用 |
| `--danger-soft` | `rgba(255,77,109,0.10)` | 答题错误选项背景 |
| `--danger-ink` | `#b1223a` | danger-soft 背景上的文字色 |

### 3.4 模块色（7 章节）

| Token | 值 | 模块 | 软色背景 | 软色文字 |
|-------|-----|------|----------|----------|
| `--m-limit` | `#FFD60A` | 01 函数极限 | `rgba(255,214,10,0.15)` | `#8a5e00` |
| `--m-deriv` | `#0A84FF` | 02 导数 | `rgba(10,132,255,0.12)` | `#0A84FF` |
| `--m-diff` | `#5AC8FA` | 03 微分 | `rgba(90,200,250,0.18)` | `#0e6e90` |
| `--m-integral` | `#30D158` | 04 积分 | `rgba(48,209,88,0.15)` | `#1a7a36` |
| `--m-trig` | `#FF9F0A` | 05 三角 | `rgba(255,159,10,0.15)` | `#9a5a00` |
| `--m-diffEq` | `#BF5AF2` | 06 微分方程 | `rgba(191,90,242,0.15)` | `#6e21a3` |
| `--m-linalg` | `#FF3B30` | 07 线性代数 | `rgba(255,59,48,0.12)` | `#a31810` |

**取色逻辑**：遵循 Apple SF Pro 系统色板习惯（iOS Dark Mode 默认色），视觉统一 + WCAG AA 通过率 > 95%（每对软色+文字对比度 > 4.5:1）。**不**使用 Material Tailwind 默认调色板的紫红粉组合。

---

## 4. 间距与圆角

### 4.1 间距尺度（4px 基准）

```css
--space-1: 4px;   /* 极小间距，icon 与文字 */
--space-2: 8px;   /* 标签内边距、gap 紧凑列表 */
--space-3: 12px;  /* 卡片内元素间距、按钮 padding-x 起始 */
--space-4: 16px;  /* 卡片内 padding、网格 gap */
--space-5: 24px;  /* section 间距、卡片 padding 充裕版 */
--space-6: 32px;  /* 大区段间距、hero 内 padding */
--space-7: 48px;  /* section 上下 padding */
--space-8: 64px;  /* hero 上下 padding、章节详情页大标题区 */
--space-9: 96px;  /* 章节底部预留、footer 上方 */
```

**反 slop 自查**：所有 padding/margin 必须是 4 的倍数，禁止 7px / 11px / 13px 等「约数」值。

### 4.2 圆角

| Token | 值 | 适用对象 |
|-------|-----|----------|
| `--radius-xs` | 4px | kbd 键帽、tag 内部小元素 |
| `--radius-sm` | 8px | 小标签、brand mark、icon-btn、kbd 提示 |
| `--radius-md` | 12-14px | 按钮、输入框、卡片（主体） |
| `--radius-lg` | 18-22px | 大型卡片（quiz 容器、search-wrap）、hero 装饰 |
| `--radius-pill` | 999px | pill 按钮、eyebrow、tag |

**反 slop 自查**：不允许 `border-radius: 24px+` 出现（这是 AI 模板「圆角卡片 + 软阴影」最常见套路）；卡片最大圆角锁在 22px。

---

## 5. 阴影与动效

### 5.1 阴影

```css
--shadow-1: 0 1px 2px rgba(24,24,27,.04), 0 1px 1px rgba(24,24,27,.03);
/* 1px 微浮起：card 静态 */

--shadow-2: 0 6px 24px rgba(24,24,27,.06), 0 1px 2px rgba(24,24,27,.04);
/* 中等浮起：card hover、stage-card 装饰 */

--shadow-3: 0 24px 60px rgba(24,24,27,.10);
/* 大型投影：hero-figure、quiz 配置面板 */
```

**反 slop 自查**：阴影必须是「多层组合」（主投影 + 1px 紧贴次投影），**禁止**单层 `0 0 50px rgba(0,0,0,.2)` 的虚化阴影（这是 glassmorphism 残留套路）。

### 5.2 动效曲线与时长

| Token | 值 | 用途 |
|-------|-----|------|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | 默认出场曲线（`expo-out` 类） |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 答题反馈弹性（仅 1 处） |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | 主题切换全局过渡 |
| `--t-fast` | 200ms | hover 颜色、边框、cursor 变化 |
| `--t-base` | 360ms | 卡片 transform 浮起 |
| `--t-slow` | 600ms | 翻卡 3D 翻转、hero stage-card hover 错峰 |

### 5.3 关键动效蓝图（GSAP 映射）

| 场景 | 实现方式 | 时长 | 缓动 |
|------|----------|------|------|
| 翻卡 3D 翻转 | `transform: rotateY(180deg)` + `transform-style: preserve-3d` | 600ms | `--ease-out` |
| Hero stage-card hover 错峰 | 3 张卡片 translateX ±6px + rotate ±2deg，stagger 0 | 600ms | `--ease-out` |
| 章节卡片入场 | stagger 80ms × 7，opacity 0→1，translateY 16px→0 | 400ms / 张 | `--ease-out` |
| 自测答题反馈（正确） | scale 1 → 1.04 → 1 + 背景滑入 | 280ms | `--ease-spring` |
| 自测答题反馈（错误） | translateX -6px → 6px → 0（震动） + 背景滑入 | 320ms | `--ease-out` |
| 搜索结果下拉 | height 0→auto + opacity 0→1，stagger 30ms | 200ms / 条 | `--ease-out` |
| 主题切换 | CSS 变量 `transition: all 0.4s` 全局过渡 | 400ms | `--ease-in-out` |
| Pulse（hero 状态点） | opacity 0.4↔1 + scale 0.8↔1，无限循环 | 2400ms | ease-in-out |

**GSAP 用量原则**：能用 CSS transition 实现的（hover、按钮、tab 切换）一律 CSS；GSAP 仅用于 stagger 序列与 3D 翻面（性能与可维护性更优）。

---

## 6. 组件库

### 6.1 原子组件清单

| 组件 | 来源 | 复用页面 |
|------|------|----------|
| `Brand` | 导航 logo | 全站 |
| `NavLink` | 导航链接 | 全站 |
| `IconButton` | 主题切换 | 全站 |
| `SearchTrigger` | 搜索入口 | 全站顶部 |
| `Button.Primary` | CTA | 首页、自测配置、搜索 |
| `Button.Ghost` | 次要 CTA | 首页、详情页 |
| `PillButton` | 范围/题量/模块选择 | 自测配置、翻卡模块切换 |
| `SegmentedControl` | tab 切换 | 翻卡模块 |
| `EntryCard` | 三入口卡 | 首页 |
| `ChapterCard` | 章节 Bento 卡 | 首页 |
| `FormulaCard` | 公式卡 | 详情页、搜索结果 |
| `FlipCard` | 3D 翻面卡 | 翻卡页 |
| `Callout` | 高亮提示 | 详情页 |
| `Example` | 真题例题 | 详情页 |
| `Kbd` | 键盘键帽 | 搜索页 |
| `ResultRow` | 搜索结果行 | 搜索页 |
| `QuizOption` | 答题选项 | 自测页 |
| `ProgressBar` | 进度条 | 自测页 |
| `Feedback` | 答题反馈条 | 自测页 |

### 6.2 关键组件骨架

#### 6.2.1 `FlipCard`（3D 翻卡）

```tsx
// 结构骨架（TSX）
<div className={`flip ${colorClass} ${flipped ? 'flipped' : ''}`} onClick={onToggle}>
  <div className="flip-inner">
    <div className="face front">
      <span className="tag">{label}</span>
      <div className="tex">{promptTex}</div>   {/* KaTeX 渲染 */}
      <div className="prompt">{flipped ? '' : '回忆一下，再翻面看答案'}</div>
    </div>
    <div className="face back">
      <span className="tag">{label}</span>
      <div className="tex">{fullTex}</div>      {/* KaTeX 渲染 */}
      <div className="hint">{hintText}</div>    {/* 联动说明或口诀 */}
    </div>
  </div>
</div>
```

```css
.flip { perspective: 1200px; cursor: pointer; }
.flip-inner {
  position: relative; width: 100%; min-height: 200px;
  transform-style: preserve-3d;
  transition: transform 600ms var(--ease-out);
}
.flip.flipped .flip-inner { transform: rotateY(180deg); }
.face {
  position: absolute; inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: 16px; padding: 20px;
  background: var(--surface); border: 1px solid var(--line);
  display: flex; flex-direction: column; justify-content: space-between;
  box-shadow: var(--shadow-1);
  transition: border-color 200ms, box-shadow 360ms var(--ease-out);
}
.face:hover { border-color: var(--accent); box-shadow: 0 12px 40px rgba(24,24,27,.10); }
.face.back { transform: rotateY(180deg); background: linear-gradient(160deg, #fff, var(--canvas)); }
.face.back .tex { color: var(--accent); }
```

#### 6.2.2 `EntryCard`（首页三入口）

```tsx
<a className="entry" href={to}>
  <span className="num">{num}</span>      {/* "01" / "02" / "03" */}
  <h3>{title}</h3>
  <p>{desc}</p>
  <span className="arrow">→</span>
</a>
```

```css
.entry {
  position: relative; padding: 22px 20px;
  border-radius: var(--radius-md);
  background: var(--surface); border: 1px solid var(--line);
  transition: transform var(--t-base) var(--ease-out), border-color var(--t-fast);
  overflow: hidden;
}
.entry:hover { transform: translateY(-3px); border-color: var(--ink); }
.entry .num { font-size: 11px; color: var(--muted); letter-spacing: 0.08em; font-weight: 600; }
.entry h3 { margin: 6px 0 4px; font-size: 17px; font-weight: 700; letter-spacing: -0.01em; }
.entry p { margin: 0; color: var(--muted); font-size: 13.5px; line-height: 1.55; }
.entry .arrow {
  position: absolute; top: 18px; right: 18px;
  color: var(--muted);
  transition: transform var(--t-fast);
}
.entry:hover .arrow { transform: translate(4px, -4px); color: var(--accent); }
```

#### 6.2.3 `ChapterCard`（Bento 章节卡）

```tsx
<a className="ch-card" href={to} style={{ borderColor: moduleColor }}>
  <span className="tag" style={{ background: tagBg, color: tagFg }}>{number}</span>
  <h3>{title}</h3>
  <p>{desc}</p>
  <div className="kpi"><strong>{count}</strong> 公式 · {examples} 例题</div>
  <div className="swatch" style={{ background: moduleColor }} />
</a>
```

```css
.ch-card {
  position: relative; padding: 22px;
  border-radius: var(--radius-md);
  background: var(--surface); border: 1px solid var(--line);
  min-height: 160px; overflow: hidden;
  transition: transform var(--t-base) var(--ease-out), border-color var(--t-fast);
}
.ch-card:hover { transform: translateY(-3px); border-color: var(--ink); }
.ch-card .swatch {
  position: absolute; right: -32px; top: -32px;
  width: 110px; height: 110px; border-radius: 50%; opacity: 0.10;
}
/* 7 章节 bento 排布 */
.ch-card:nth-child(1) { grid-column: span 6; }
.ch-card:nth-child(2) { grid-column: span 4; }
.ch-card:nth-child(3) { grid-column: span 2; }
.ch-card:nth-child(4) { grid-column: span 3; }
.ch-card:nth-child(5) { grid-column: span 3; }
.ch-card:nth-child(6) { grid-column: span 3; }
.ch-card:nth-child(7) { grid-column: span 3; }
```

#### 6.2.4 `QuizOption`（答题选项）

```tsx
<button
  className={`q-opt ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}
  data-correct={correct}
  onClick={onSelect}
>
  <span className="key">{keyIndex}</span>   {/* "1" / "2" / "3" / "4" */}
  <span className="opt-tex">{texHTML}</span>  {/* KaTeX 渲染 */}
</button>
```

```css
.q-opt {
  padding: 14px 16px; border: 1.5px solid var(--line);
  border-radius: 12px; cursor: pointer;
  font-size: 14px; color: var(--ink);
  transition: all 200ms var(--ease-out);
  position: relative;
}
.q-opt:hover { border-color: var(--ink); transform: translateY(-1px); }
.q-opt.correct { border-color: var(--success); background: var(--success-soft); color: var(--success-ink); }
.q-opt.wrong   { border-color: var(--danger);  background: var(--danger-soft);  color: var(--danger-ink); }
.q-opt .key {
  position: absolute; top: 10px; right: 12px;
  font-size: 11px; color: var(--muted); font-family: var(--font-mono);
}
```

#### 6.2.5 `SearchBar`（全局搜索框）

```tsx
<div className="search-wrap">
  <SearchIcon className="search-icon" />
  <input
    className="search-input"
    type="text"
    placeholder="搜索公式 · tan / 二倍角 / sec²"
    value={query}
    onChange={onChange}
  />
  <span className="kbd-hint">/</span>
</div>
```

```css
.search-input {
  width: 100%; padding: 18px 20px 18px 56px;
  font-family: inherit; font-size: 17px; color: var(--ink);
  background: var(--surface); border: 1.5px solid var(--line);
  border-radius: 14px;
  transition: border-color 200ms, box-shadow 200ms;
  outline: none;
}
.search-input:focus { border-color: var(--accent); box-shadow: 0 0 0 4px var(--accent-soft); }
```

---

## 7. 4 模块原型路径

| 模块 | 原型路径 | 核心交互 |
|------|----------|----------|
| 首页 | [.trae/prototypes/01-home.html](../.trae/prototypes/01-home.html) | 7 章节 Bento + 三入口卡 + 框架梳理叙事 |
| 章节详情 | [.trae/prototypes/02-chapter.html](../.trae/prototypes/02-chapter.html) | 侧边栏目录 + 公式网格 + 真题例题 + 记忆口诀 |
| 翻卡记忆 | [.trae/prototypes/03-review.html](../.trae/prototypes/03-review.html) | 模块切换 + 类别分组 + 单张翻面 + 全部翻面 + 切换重置 |
| 自测练习 | [.trae/prototypes/04-quiz.html](../.trae/prototypes/04-quiz.html) | config 阶段 → 答题阶段（3 题型 + 即时反馈）→ 成绩单 |
| 公式搜索 | [.trae/prototypes/05-search.html](../.trae/prototypes/05-search.html) | 搜索框 + 实时结果下拉 + `/` 聚焦 + `Esc` 清空 |

> **所有原型均为独立 HTML，单文件打开即可运行**（CDN 加载 KaTeX）。生产实现见 `app/src/pages/*` 与 `app/src/components/*`。

---

## 8. 反 slop 自查清单

每完成一个模块，用以下清单逐条检查：

### 8.1 视觉层
- [ ] **未使用**任何形式的玻璃拟态（`backdrop-filter` 仅限 nav 顶栏，且必须配合 0.72 透明度）
- [ ] **未使用**紫蓝渐变作为大标题（仅 hero H1 局部单词可用）
- [ ] **未使用** Material Tailwind 默认调色板（粉红/亮紫/橙红等饱和度 > 70% 的色）
- [ ] **未使用** emoji 作为图标
- [ ] **未使用** `border-radius` > 22px
- [ ] **未使用**单层 `0 0 Xpx rgba(0,0,0,.2)` 虚化阴影
- [ ] **未使用**Lorem Ipsum 占位文案；所有文字必须是有意义的（PRD 框架梳理或口诀）
- [ ] **未使用**「Get Started」「Learn More」等通用 CTA；按钮文案必须说明动作

### 8.2 排版层
- [ ] Hero H1 字号 ≤ 4rem，禁用全大写
- [ ] 段落正文 ≥ 15px
- [ ] `letter-spacing` 仅在大字号（≥ 28px）使用负值
- [ ] 字体栈优先 Geist，缺失时优雅降级到 system-ui
- [ ] 行高：标题 1.04-1.2 / 正文 1.55-1.6 / 公式 1.2

### 8.3 交互层
- [ ] 所有可点击元素 ≥ 44×44px 触屏热区
- [ ] 焦点态可见（`outline` 或 `box-shadow` halo 4px 软色）
- [ ] 键盘可达：Tab 顺序合理，`/` `Esc` `←` `→` `Enter` 至少 1 个快捷键
- [ ] 200-600ms 内完成动效，禁用 > 1s 的进场动画
- [ ] 错误态用 danger-soft 而非纯红背景（保护对比度）

### 8.4 内容层
- [ ] 详情页段落与公式卡数量比例 ≥ 1:1（避免「公式海洋」）
- [ ] 每个翻卡背面都有「联动说明」或「记忆口诀」（避免单条孤立的公式）
- [ ] 真题例题标注来源（省 + 年份 + 题型）
- [ ] 自测反馈包含「正确答案 + 联动说明」（不只是「对/错」）

---

## 9. 实施 Checklist（Phase 4-6 引用）

- [ ] `app/src/styles/tokens.css` — 导出本文档全部 CSS 变量
- [ ] `app/src/components/Brand/Brand.tsx` — 品牌组件
- [ ] `app/src/components/Nav/Nav.tsx` — 顶部导航
- [ ] `app/src/components/EntryCard/EntryCard.tsx` — 首页入口卡
- [ ] `app/src/components/ChapterCard/ChapterCard.tsx` — Bento 章节卡
- [ ] `app/src/components/FormulaCard/FormulaCard.tsx` — 公式卡（详情页 + 搜索）
- [ ] `app/src/components/FlipCard/FlipCard.tsx` — 3D 翻卡
- [ ] `app/src/components/QuizOption/QuizOption.tsx` — 答题选项
- [ ] `app/src/components/QuizFeedback/QuizFeedback.tsx` — 答题反馈条
- [ ] `app/src/components/SearchBar/SearchBar.tsx` — 搜索框
- [ ] `app/src/components/SearchResult/SearchResult.tsx` — 搜索结果行
- [ ] `app/src/pages/ReviewPage.tsx` — 翻卡页（拼装 FlipCard + SegmentedControl）
- [ ] `app/src/pages/QuizPage.tsx` — 自测页（3 状态机）
- [ ] `app/src/pages/SearchPage.tsx` — 搜索页（实时结果）

---

## 附录 A · 配色调试工具

```bash
# 查看当前所有 token 实际渲染值
open "data:text/html,<style>$(cat app/src/styles/tokens.css)</style><body style='font:14px monospace;padding:32px;'><script>$(cat app/src/styles/tokens.css | head -1)</script></body>"
```

## 附录 B · 反 slop 案例截图

> Phase 3.5 阶段补充：在 `docs/anti-slop/` 目录归档「典型 AI 模板 vs 本项目实际效果」对比截图，作为后续维护的视觉锚点。
