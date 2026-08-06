import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ALL_FORMULAS, FORMULAS_BY_MODULE, MODULES } from '../data/formulas';
import type { Formula, ModuleId } from '../data/formulas';
import FlipCard from '../components/FlipCard/FlipCard';
import ThemeToggle from '../components/ThemeToggle/ThemeToggle';

type Filter = 'all' | ModuleId;

/**
 * 翻卡记忆页
 * - 顶部：模块筛选 + 「全部翻面 / 全部翻回」按钮
 * - 主体：按 category 分组渲染 FlipCard 网格
 * - 不写 localStorage（PRD：无评分/无队列）
 */
export default function ReviewPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const [forceFlipped, setForceFlipped] = useState<boolean | null>(null);

  const visible = useMemo<Formula[]>(() => {
    if (filter === 'all') return ALL_FORMULAS;
    return FORMULAS_BY_MODULE[filter] ?? [];
  }, [filter]);

  // 按 category 分组
  const grouped = useMemo(() => {
    const map = new Map<string, Formula[]>();
    for (const f of visible) {
      const key = f.category ?? f.label;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(f);
    }
    return Array.from(map.entries());
  }, [visible]);

  const isAllFlipped = forceFlipped === true;

  const toggleAll = () => {
    setForceFlipped((cur) => (cur === true ? false : true));
  };

  // 切换模块时重置 forceFlipped（PRD：类别切换重置）
  const handleFilter = (next: Filter) => {
    setFilter(next);
    setForceFlipped(null);
  };

  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <h1 className="page-title">
            <Link to="/" style={{ color: 'inherit' }}>📐 四川专升本高数</Link>
            <span style={{ color: 'var(--text-muted)', fontWeight: 400, margin: '0 0.4rem' }}>·</span>
            <span style={{ fontSize: '0.85em' }}>翻卡记忆</span>
          </h1>
          <p className="page-subtitle">P0 · 共 {visible.length} 张 · 无评分、无队列的极简记忆工具</p>
        </div>
        <ThemeToggle />
      </header>

      <div className="review-controls" style={{ marginBottom: '1.2rem' }}>
        <div className="module-seg" role="tablist" aria-label="模块筛选">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => handleFilter('all')}
            role="tab"
            aria-selected={filter === 'all'}
          >
            全部 ({ALL_FORMULAS.length})
          </button>
          {MODULES.map((m) => (
            <button
              key={m.id}
              className={filter === m.id ? 'active' : ''}
              onClick={() => handleFilter(m.id)}
              role="tab"
              aria-selected={filter === m.id}
              style={filter === m.id ? { background: m.color, color: '#fff' } : undefined}
            >
              {m.short} ({m.count})
            </button>
          ))}
        </div>
        <button
          className="btn-flip-all"
          onClick={toggleAll}
          aria-pressed={isAllFlipped}
          style={isAllFlipped ? { background: 'var(--text-primary)', color: 'var(--bg-body)' } : undefined}
        >
          {isAllFlipped ? '全部翻回' : '全部翻面'}
        </button>
      </div>

      {grouped.length === 0 ? (
        <div className="phase-hint">该模块暂无公式数据。</div>
      ) : (
        grouped.map(([cat, list]) => {
          const mod = MODULES.find((m) => m.id === list[0]?.module);
          return (
            <section key={cat} className="review-group" style={mod ? { borderLeftColor: mod.color } : undefined}>
              <div className="review-group-head">
                {mod && (
                  <span className="pill" style={{ color: mod.color, borderColor: mod.color }}>
                    {mod.short}
                  </span>
                )}
                <h2>{cat}</h2>
                <span className="meta">{list.length} 张</span>
              </div>
              <div className="flip-grid">
                {list.map((f) => (
                  <FlipCard key={f.id} formula={f} forceFlipped={forceFlipped ?? undefined} />
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
