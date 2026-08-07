import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FORMULAS_BY_MODULE, type Formula, type ModuleId } from '../data/formulas';
import { getChapterBySlug } from '../lib/content';
import { getChapterContent } from '../data/chapterContent';
import { renderKatex, renderMixedText } from '../lib/katex';

/**
 * 章节详情页 · 完美复刻旧 src/index.html 的 detail-view
 *  - 顶部粘性 detail-header：返回 + 标签栏（每个 section 一个 tab）
 *  - 主区：detail-body > detail-section
 *      · section-title（彩色 + 图标）
 *      · section-desc（章节导语）
 *      · 章节正文（chapter-prose）：支持 markdown 表格 / 列表 / H4 / strong / 提示框 / 代码
 *      · 公式分组 + 公式卡 + 记忆盒
 *
 * Tabs 来源：content.sections（非空段落的前 N 个 + 一个"全部公式"汇总 tab）
 */
export default function ChapterPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const decodedSlug = useMemo(() => decodeURIComponent(slug), [slug]);
  const chapter = getChapterBySlug(decodedSlug);
  const content = getChapterContent(decodedSlug);
  const moduleId = mapSlugToModuleId(decodedSlug);
  const formulas = moduleId ? (FORMULAS_BY_MODULE[moduleId] ?? []) : [];

  // 公式按 category 分组
  const grouped = useMemo(() => groupByLabel(formulas), [formulas]);

  // 构建 tab 列表：每个非空 section 一个 tab + 末尾"全部公式"汇总 tab
  type ChapterTab =
    | { id: string; label: string; fullLabel: string; kind: 'section'; section: { heading: string; paragraphs: string[] } }
    | { id: string; label: string; fullLabel: string; kind: 'formulas' };
  const tabs: ChapterTab[] = useMemo(() => {
    const sectionTabs: ChapterTab[] = (content?.sections ?? [])
      .filter((s) => s.paragraphs.length > 0 || s.heading === '速查总表')
      .map((s, i) => ({
        id: `tab-${i}`,
        label: shortTabLabel(s.heading),
        fullLabel: s.heading,
        kind: 'section',
        section: s,
      }));
    sectionTabs.push({
      id: 'tab-formulas',
      label: '全部公式',
      fullLabel: '全部公式',
      kind: 'formulas',
    });
    return sectionTabs;
  }, [content]);

  const [activeTab, setActiveTab] = useState<string>('');
  useEffect(() => {
    if (tabs.length > 0 && !tabs.find((t) => t.id === activeTab)) {
      setActiveTab(tabs[0].id);
    }
  }, [tabs, activeTab]);

  // 顶部描述：chapterContent.intro 优先；否则用 chapter.desc
  const sectionDesc = content?.intro || chapter?.desc || '本章的核心概念、性质与典型例子汇总。';

  if (!chapter) {
    return (
      <div className="shell" style={{ paddingTop: 80 }}>
        <Link to="/" className="back-btn">← 返回</Link>
        <h1 className="section-title" style={{ marginTop: 32 }}>未找到章节</h1>
        <p style={{ color: 'var(--muted)' }}>slug: {decodedSlug}</p>
      </div>
    );
  }

  const activeIdx = tabs.findIndex((t) => t.id === activeTab);
  const active = tabs[activeIdx];

  return (
    <>
      {/* ========== 粘性 detail-header ========== */}
      <header className="detail-header">
        <Link to="/" className="back-btn">
          <span aria-hidden="true">←</span> 返回
        </Link>
        <div className="detail-tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`detail-tab ${t.id === activeTab ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}
              style={
                t.id === activeTab
                  ? ({
                      ['--tab-color' as any]: hexToRgba(chapter.color, 0.16),
                      ['--tab-border' as any]: hexToRgba(chapter.color, 0.45),
                    } as React.CSSProperties)
                  : undefined
              }
              type="button"
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      {/* ========== 主区 ========== */}
      <div className="detail-body">
        {/* 章节标题 + 描述（始终显示，对齐旧版） */}
        <h1 className="section-title" style={{ color: chapter.color }}>
          <ChartIcon color={chapter.color} />
          {chapter.title}
        </h1>
        <p className="section-desc">
          {sectionDesc}
          {` · 本章 ${formulas.length} 条公式 · 涵盖 ${grouped.length} 个分组。`}
        </p>

        {/* ========== 当前 tab 内容 ========== */}
        {active?.kind === 'section' && active.section && (
          <ProseSection
            key={active.section.heading}
            heading={active.section.heading}
            paragraphs={active.section.paragraphs}
          />
        )}

        {active?.kind === 'formulas' && (
          <div className="detail-section active">
            {grouped.length === 0 ? (
              <p style={{ color: 'var(--muted)' }}>本章暂无公式数据。</p>
            ) : (
              grouped.map((g, gi) => (
                <div key={g.label}>
                  <div
                    className="group-title"
                    style={{ ['--group-color' as any]: g.color }}
                  >
                    <span className="icon">{String(gi + 1).padStart(2, '0')}</span>
                    {g.label}
                    <span className="count">{g.items.length} 条</span>
                  </div>
                  <div className="formula-grid">
                    {g.items.map((f) => (
                      <FormulaCard key={f.id} f={f} />
                    ))}
                  </div>
                  {g.items.some((f) => f.hint) && (
                    <MemoryBox
                      title={`${g.label} · 记忆提示`}
                      text={g.items
                        .map((f) => f.hint)
                        .filter((h): h is string => !!h && h.length > 0)
                        .slice(0, 3)
                        .join(' · ')}
                    />
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
}

// ============================================================================
// 章节正文渲染：把 markdown 段落流解析为 table / list / h4 / tip / paragraph
// ============================================================================

type Block =
  | { kind: 'h3'; text: string }
  | { kind: 'h4'; text: string }
  | { kind: 'paragraph'; text: string }
  | { kind: 'displayMath'; tex: string }
  | { kind: 'tip'; emoji: string; text: string; tone: 'info' | 'warn' | 'success' | 'tip' }
  | { kind: 'list'; items: string[] }
  | { kind: 'table'; head: string[]; rows: string[][] }
  | { kind: 'hr' };

function parseParagraphs(paragraphs: string[]): Block[] {
  const blocks: Block[] = [];
  let i = 0;
  while (i < paragraphs.length) {
    const raw = paragraphs[i];
    const p = raw.trim();
    if (p.length === 0) {
      i++;
      continue;
    }

    // 水平线
    if (/^-{3,}$/.test(p)) {
      blocks.push({ kind: 'hr' });
      i++;
      continue;
    }

    // #### H4
    if (p.startsWith('#### ')) {
      blocks.push({ kind: 'h4', text: p.slice(5).trim() });
      i++;
      continue;
    }
    // ### H3
    if (p.startsWith('### ')) {
      blocks.push({ kind: 'h3', text: p.slice(4).trim() });
      i++;
      continue;
    }

    // $$...$$ display math
    if (p.startsWith('$$') && p.endsWith('$$') && p.length > 4) {
      blocks.push({ kind: 'displayMath', tex: p.slice(2, -2).trim() });
      i++;
      continue;
    }

    // 提示框 💡 ⚠️ ⭐ 🔔
    const tipMatch = p.match(/^([💡⚠️⭐🔔])\s*(.*)$/s);
    if (tipMatch) {
      const emoji = tipMatch[1];
      const text = tipMatch[2].trim();
      const tone: 'info' | 'warn' | 'success' | 'tip' =
        emoji === '⚠️' ? 'warn' : emoji === '⭐' ? 'success' : emoji === '💡' ? 'info' : 'tip';
      blocks.push({ kind: 'tip', emoji, text, tone });
      i++;
      continue;
    }

    // 表格：首行 + 第二行分隔线 + 数据行
    if (/\|/.test(p) && i + 1 < paragraphs.length) {
      const head = p;
      const sep = paragraphs[i + 1]?.trim() ?? '';
      if (/^\|?[\s\-:|]+\|?$/.test(sep) && sep.includes('-')) {
        const headerCells = splitRow(head);
        const rows: string[][] = [];
        let j = i + 2;
        while (j < paragraphs.length) {
          const line = paragraphs[j].trim();
          if (!line || !/\|/.test(line)) break;
          if (/^\|?[\s\-:|]+\|?$/.test(line) && line.includes('-')) break;
          rows.push(splitRow(line));
          j++;
        }
        if (rows.length > 0) {
          blocks.push({ kind: 'table', head: headerCells, rows });
          i = j;
          continue;
        }
      }
    }

    // 有序列表：以 ① / ② / 1. / 1、 开头，且连续多行
    if (/^[①②③④⑤⑥⑦⑧⑨⑩]/.test(p) || /^\d+[、\.\)]\s/.test(p)) {
      const items: string[] = [];
      while (i < paragraphs.length) {
        const line = paragraphs[i].trim();
        if (
          /^[①②③④⑤⑥⑦⑧⑨⑩]/.test(line) ||
          /^\d+[、\.\)]\s/.test(line)
        ) {
          items.push(line.replace(/^[①②③④⑤⑥⑦⑧⑨⑩]\s*/, '').replace(/^\d+[、\.\)]\s*/, ''));
          i++;
        } else {
          break;
        }
      }
      if (items.length > 0) {
        blocks.push({ kind: 'list', items });
        continue;
      }
    }

    // 普通段落
    blocks.push({ kind: 'paragraph', text: p });
    i++;
  }
  return blocks;
}

function splitRow(line: string): string[] {
  // 去掉首尾的 |，按 | 分割，再 trim
  const trimmed = line.replace(/^\|/, '').replace(/\|$/, '');
  return trimmed.split('|').map((c) => c.trim());
}

// ---------------------------------------------------------------------------

function ProseSection({ heading, paragraphs }: { heading: string; paragraphs: string[] }) {
  const cleaned = paragraphs
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
    .filter((p) => !/^-+$/.test(p));

  if (cleaned.length === 0) {
    return (
      <div className="chapter-prose">
        <h2 style={{ fontSize: 19, fontWeight: 700, margin: '1.8rem 0 0.8rem' }}>
          {heading}
        </h2>
        <p style={{ color: 'var(--muted)' }}>（本节内容待补充）</p>
      </div>
    );
  }

  const blocks = parseParagraphs(cleaned);

  return (
    <div className="chapter-prose">
      <h2
        style={{
          fontSize: 19,
          fontWeight: 700,
          margin: '1.8rem 0 0.8rem',
          color: 'var(--ink)',
          letterSpacing: '-0.005em',
        }}
      >
        {heading}
      </h2>
      {blocks.map((b, i) => renderBlock(b, i))}
    </div>
  );
}

function renderBlock(b: Block, i: number) {
  switch (b.kind) {
    case 'h3':
      return (
        <h3
          key={i}
          style={{
            fontSize: 17,
            fontWeight: 700,
            margin: '1.4rem 0 0.6rem',
            color: 'var(--ink)',
          }}
          dangerouslySetInnerHTML={{ __html: renderMixedText(b.text) }}
        />
      );
    case 'h4':
      return (
        <h4
          key={i}
          style={{
            fontSize: 15,
            fontWeight: 700,
            margin: '1rem 0 0.4rem',
            color: 'var(--accent)',
          }}
          dangerouslySetInnerHTML={{ __html: renderMixedText(b.text) }}
        />
      );
    case 'displayMath':
      return (
        <div
          key={i}
          style={{ margin: '0.8rem 0', textAlign: 'left' }}
          dangerouslySetInnerHTML={{ __html: renderKatex(b.tex, true) }}
        />
      );
    case 'tip': {
      const colorMap: Record<typeof b.tone, { bg: string; bd: string; tx: string }> = {
        info: { bg: 'var(--m-limit-soft)', bd: 'var(--m-limit)', tx: 'var(--m-limit-ink)' },
        warn: { bg: 'rgba(255, 159, 10, 0.10)', bd: '#FF9F0A', tx: '#C75A00' },
        success: { bg: 'rgba(48, 209, 88, 0.10)', bd: '#30D158', tx: '#1A7A35' },
        tip: { bg: 'rgba(175, 82, 222, 0.10)', bd: '#BF5AF2', tx: '#7B2CBF' },
      };
      const c = colorMap[b.tone];
      return (
        <p
          key={i}
          style={{
            color: c.tx,
            background: c.bg,
            padding: '8px 12px',
            borderRadius: 10,
            borderLeft: `3px solid ${c.bd}`,
            fontSize: 14,
            lineHeight: 1.7,
            margin: '0.6rem 0',
          }}
          dangerouslySetInnerHTML={{
            __html: renderMixedText(`${b.emoji} ${b.text}`),
          }}
        />
      );
    }
    case 'list':
      return (
        <ul key={i} className="prose-list">
          {b.items.map((it, j) => (
            <li
              key={j}
              dangerouslySetInnerHTML={{ __html: renderMixedText(it) }}
            />
          ))}
        </ul>
      );
    case 'table':
      return (
        <table key={i} className="prose-table">
          <thead>
            <tr>
              {b.head.map((h, j) => (
                <th
                  key={j}
                  dangerouslySetInnerHTML={{ __html: renderMixedText(h) }}
                />
              ))}
            </tr>
          </thead>
          <tbody>
            {b.rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((c, ci) => (
                  <td
                    key={ci}
                    dangerouslySetInnerHTML={{ __html: renderMixedText(c) }}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    case 'hr':
      return (
        <hr
          key={i}
          style={{ border: 'none', borderTop: '1px solid var(--line)', margin: '1.2rem 0' }}
        />
      );
    case 'paragraph':
      return (
        <p
          key={i}
          dangerouslySetInnerHTML={{ __html: renderMixedText(b.text) }}
        />
      );
  }
}

// ============================================================================
// 公式卡 / 记忆盒 / 图标
// ============================================================================

function FormulaCard({ f }: { f: Formula }) {
  return (
    <div className="formula-card" style={{ ['--card-accent' as any]: f.color }}>
      {f.num && <span className="formula-num">{f.num}</span>}
      <div className="formula-label">{f.label}</div>
      <div
        className="formula-block"
        dangerouslySetInnerHTML={{
          __html: renderKatex(`${f.lhs} = ${f.rhs}`, true),
        }}
      />
      {f.hint && (
        <div
          className="formula-note"
          dangerouslySetInnerHTML={{ __html: renderMixedText(f.hint) }}
        />
      )}
    </div>
  );
}

function MemoryBox({ title, text }: { title: string; text: string }) {
  return (
    <div className="memory-box">
      <span className="icon" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.7.6 1 1.4 1 2.3v1h6v-1c0-.9.3-1.7 1-2.3A7 7 0 0 0 12 2Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <div className="memory-box-content">
        <div className="memory-box-title">{title}</div>
        <div
          className="memory-box-text"
          dangerouslySetInnerHTML={{ __html: renderMixedText(text) }}
        />
      </div>
    </div>
  );
}

function ChartIcon({ color }: { color: string }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 3v18h18" />
      <path d="M7 14l4-4 4 4 5-6" />
    </svg>
  );
}

// ============================================================================
// helpers
// ============================================================================

function mapSlugToModuleId(slug: string): ModuleId | undefined {
  if (slug.startsWith('01-')) return 'limit';
  if (slug.startsWith('02-')) return 'deriv';
  if (slug.startsWith('03-')) return 'diff';
  if (slug.startsWith('04-')) return 'integral';
  if (slug.startsWith('05-')) return 'trig';
  if (slug.startsWith('06-')) return 'diffEq';
  if (slug.startsWith('07-')) return 'linalg';
  return undefined;
}

function groupByLabel(formulas: Formula[]) {
  const map = new Map<string, Formula[]>();
  for (const f of formulas) {
    const key = f.category ?? f.label;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(f);
  }
  return Array.from(map.entries()).map(([label, items]) => ({
    label,
    items,
    color: items[0]?.color ?? '#0A84FF',
  }));
}

function shortTabLabel(heading: string): string {
  // "一、函数" -> "一·函数"，"速查总表" -> "速查总表"
  if (heading.includes('、')) {
    const [num, ...rest] = heading.split('、');
    return `${num}·${rest.join('、')}`;
  }
  return heading;
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
