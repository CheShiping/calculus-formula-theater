import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ALL_FORMULAS, FORMULAS_BY_MODULE, MODULES } from '../data/formulas';
import { CHAPTERS } from '../lib/content';
import { renderKatex } from '../lib/katex';

/**
 * 首页 · 严格对齐 prototype 01-home.html
 *  1) Hero（eyebrow + 标题 + 副文 + CTA + 右侧 3 张 stage-card）
 *  2) 三入口卡（翻卡 / 自测占位 / 搜索占位）
 *  3) 七章 Bento 网格（12-col 不等宽）
 *  4) 框架梳理叙事（左侧文案 + 右侧 chain）
 *  5) Footer
 */
export default function HomePage() {
  // 三个舞台卡：直接挑出 3 条具有联动关系的真实公式
  const stage1 = useMemo(
    () => ALL_FORMULAS.find((f) => f.id === 'deriv_正切_5'),
    []
  );
  const stage2 = useMemo(
    () => ALL_FORMULAS.find((f) => f.id === 'integral_正割平方_8'),
    []
  );
  const stage3 = useMemo(
    () => ALL_FORMULAS.find((f) => f.id === 'trig_核心平方_59'),
    []
  );

  // 七章 KPI
  const chapterCards = useMemo(
    () =>
      CHAPTERS.map((ch) => {
        const moduleId = mapSlugToModuleId(ch.slug);
        const count = moduleId ? (FORMULAS_BY_MODULE[moduleId]?.length ?? 0) : 0;
        return { ...ch, count };
      }),
    []
  );

  return (
    <>
      <main className="shell">
        {/* ========== Hero ========== */}
        <section className="hero section">
          <div>
            <span className="hero-eyebrow">
              <span className="dot" />
              四川专升本高数 · 框架梳理
            </span>
            <h1>
              把 {ALL_FORMULAS.length}+ 条公式，
              <br />
              <span className="accent">串成可以复习的知识网络</span>
            </h1>
            <p className="lede">
              从函数极限到线性代数，每条公式都带有联动说明、记忆口诀和章节正文。
              不只是看公式，是用翻卡、章节、搜索三件套把公式记下来。
            </p>
            <div className="hero-cta">
              <Link className="btn btn-primary" to={`/chapter/${encodeURIComponent(CHAPTERS[0].slug)}`}>
                开始浏览章节
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </Link>
              <Link className="btn btn-ghost" to="/review">
                直接进入翻卡
              </Link>
            </div>
          </div>

          <div className="hero-figure" aria-hidden="true">
            {stage1 && (
              <div className="stage-card l">
                <div className="label">导数 · 三角函数</div>
                <div
                  className="tex"
                  dangerouslySetInnerHTML={{
                    __html: renderKatex(`${stage1.lhs} = ${stage1.rhs}`, false),
                  }}
                />
              </div>
            )}
            {stage2 && (
              <div className="stage-card c">
                <div className="label">积分 · 高频</div>
                <div
                  className="tex"
                  dangerouslySetInnerHTML={{
                    __html: renderKatex(`${stage2.lhs} = ${stage2.rhs}`, false),
                  }}
                />
              </div>
            )}
            {stage3 && (
              <div className="stage-card r">
                <div className="label">三角 · 平方关系</div>
                <div
                  className="tex"
                  dangerouslySetInnerHTML={{
                    __html: renderKatex(`${stage3.lhs} = ${stage3.rhs}`, false),
                  }}
                />
              </div>
            )}
          </div>
        </section>

        {/* ========== 三入口 ========== */}
        <section className="section">
          <div className="section-head">
            <h2>从「看了」到「会了」</h2>
            <span className="hint">三个核心模块</span>
          </div>
          <div className="entry-grid">
            <Link className="entry" to="/review">
              <span className="num">01</span>
              <h3>公式翻卡记忆</h3>
              <p>正面提示，背面答案加口诀。全部翻面、逐张翻面，都行。</p>
              <span className="arrow">→</span>
            </Link>
            <Link className="entry" to="/" onClick={(e) => e.preventDefault()} style={{ opacity: 0.7, cursor: 'default' }}>
              <span className="num">02</span>
              <h3>公式自测练习</h3>
              <p>选择、填空、判断三种题型，P1 阶段接入。</p>
              <span className="arrow">→</span>
            </Link>
            <Link className="entry" to="/" onClick={(e) => e.preventDefault()} style={{ opacity: 0.7, cursor: 'default' }}>
              <span className="num">03</span>
              <h3>公式快速搜索</h3>
              <p>支持函数名、中文名、口诀关键词三种匹配，P1 阶段接入。</p>
              <span className="arrow">→</span>
            </Link>
          </div>
        </section>

        {/* ========== 章节 Bento ========== */}
        <section className="section" id="chapters">
          <div className="section-head">
            <h2>七章内容 · 一张知识网络</h2>
            <span className="hint">点击进入详情</span>
          </div>
          <div className="ch-grid">
            {chapterCards.map((ch) => {
              const num = ch.slug.match(/^\d+/)?.[0] ?? '·';
              const tagBg = hexToSoftBg(ch.color);
              return (
                <Link
                  key={ch.slug}
                  className="ch-card"
                  to={`/chapter/${encodeURIComponent(ch.slug)}`}
                  style={{ borderColor: ch.color }}
                >
                  <span className="tag" style={{ background: tagBg, color: ch.color }}>
                    {num}
                  </span>
                  <h3>{ch.title}</h3>
                  <p>{ch.desc}</p>
                  <div className="kpi">
                    <strong>{ch.count}</strong> 公式
                  </div>
                  <div className="swatch" style={{ background: ch.color }} />
                </Link>
              );
            })}
          </div>
        </section>

        {/* ========== 框架梳理叙事 ========== */}
        <section className="section">
          <div className="narrative">
            <div>
              <span className="hero-eyebrow">FRAMEWORK · 框架梳理</span>
              <h2>
                公式不是孤立的，
                <br />
                它们是知识网络的节点。
              </h2>
              <p className="lede">
                导数是枢纽，向上接三角函数，向下 × dx 变微分，向反方向走就是积分。
                把 {ALL_FORMULAS.length}+ 条公式放回它们在网络里的位置，比背一堆孤立公式有效得多。
              </p>
            </div>
            <div className="chain">
              {chainRows().map((row) => (
                <div key={row.k} className="chain-row" style={row.muted ? { color: 'var(--muted)' } : undefined}>
                  <span className="k">{row.k}</span>
                  <span className="v">{row.v}</span>
                  <span className="arrow-r">{row.arrow}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="shell" style={{ paddingTop: 0, paddingBottom: 24 }}>
          <div className="footer-row">
            <span>calculus-formula-theater · 个人项目 · 2026</span>
            <span>v0.3 · SPA 阶段 3 界面搭建</span>
          </div>
        </div>
      </footer>
    </>
  );
}

// ---- helpers ------------------------------------------------------------

function mapSlugToModuleId(slug: string) {
  // 与 content.ts 中 SLUG_TO_COLOR 顺序一致
  if (slug.startsWith('01-')) return 'limit' as const;
  if (slug.startsWith('02-')) return 'deriv' as const;
  if (slug.startsWith('03-')) return 'diff' as const;
  if (slug.startsWith('04-')) return 'integral' as const;
  if (slug.startsWith('05-')) return 'trig' as const;
  if (slug.startsWith('06-')) return 'diffEq' as const;
  if (slug.startsWith('07-')) return 'linalg' as const;
  return undefined;
}

function hexToSoftBg(hex: string) {
  // 同色 12% 透明背景（design token m-*-soft 的简化版）
  return hexToRgba(hex, 0.14);
}

function hexToRgba(hex: string, alpha: number) {
  const m = hex.replace('#', '');
  const v = m.length === 3 ? m.split('').map((c) => c + c).join('') : m;
  const num = parseInt(v, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function chainRows() {
  // 找 4 个主公式的条数（用 module 计数代替）
  const find = (id: string) => MODULES.find((m) => m.id === id);
  const limit = find('limit')?.count ?? 0;
  const deriv = find('deriv')?.count ?? 0;
  const diff = find('diff')?.count ?? 0;
  const integral = find('integral')?.count ?? 0;
  const diffEq = find('diffEq')?.count ?? 0;
  return [
    { k: '01 地基', v: '函数、极限、连续', arrow: '→', muted: false },
    { k: '02 核心', v: `导数（${deriv} 条）`, arrow: '→ 求导', muted: false },
    { k: '03 等价', v: `微分（导数 × dx）`, arrow: `→ ${diff} 条`, muted: false },
    { k: '04 逆运算', v: `积分（${integral} 条）`, arrow: '→ 11 + 8', muted: false },
    { k: '05 综合应用', v: '微分方程', arrow: `→ ${diffEq} 种`, muted: false },
    { k: '贯穿', v: '三角函数（6 大版块）', arrow: '↔', muted: true },
    { k: '独立', v: '线性代数 · 行列式', arrow: '⊥', muted: true },
    { k: '起点', v: `${limit} 条极限工具`, arrow: '·', muted: true },
  ];
}
