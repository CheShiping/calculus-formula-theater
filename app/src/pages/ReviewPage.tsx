import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ALL_FORMULAS, FORMULAS_BY_MODULE, MODULES, type Formula, type ModuleId } from '../data/formulas';
import FlipCard from '../components/FlipCard/FlipCard';

type Filter = 'all' | ModuleId;

/**
 * 翻卡记忆页 · 严格对齐 prototype 03-review.html
 *  - 顶部：title-row（左）+ controls（右）一行
 *  - 主体：按 module 划分的类别分组 + 翻卡网格
 *  - 全部翻面 / 全部翻回 切换
 *  - 切换模块时重置翻面状态
 */
export default function ReviewPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const [forceFlipped, setForceFlipped] = useState<boolean | null>(null);

  const visible = useMemo<Formula[]>(() => {
    if (filter === 'all') return ALL_FORMULAS;
    return FORMULAS_BY_MODULE[filter] ?? [];
  }, [filter]);

  // 按 module 分组显示（即使在「全部」下也按模块组织，让用户看到知识地图）
  const grouped = useMemo(() => {
    const map = new Map<ModuleId, Formula[]>();
    for (const f of visible) {
      if (!map.has(f.module)) map.set(f.module, []);
      map.get(f.module)!.push(f);
    }
    // 按 MODULES 声明顺序输出
    return MODULES
      .filter((m) => map.has(m.id))
      .map((m) => ({ module: m, items: map.get(m.id)! }));
  }, [visible]);

  const isAllFlipped = forceFlipped === true;

  const toggleAll = () => {
    setForceFlipped((cur) => (cur === true ? false : true));
  };

  const handleFilter = (next: Filter) => {
    setFilter(next);
    setForceFlipped(null);
  };

  const currentLabel = filter === 'all' ? '全部模块' : (MODULES.find((m) => m.id === filter)?.title ?? '');

  return (
    <div className="review-shell">
      {/* ========== 顶部 title-row + controls ========== */}
      <div className="topbar">
        <div className="title-row">
          <div className="crumbs">P0 · 公式翻卡记忆</div>
          <h1>翻卡记忆</h1>
          <p>
            正面是公式提示，背面是完整答案 + 联动说明 + 记忆口诀。无评分、无队列，纯粹的记忆工具。
            {filter === 'all' ? ' 共 7 个模块' : ` 当前：${currentLabel}`}
          </p>
        </div>
        <div className="controls">
          <div className="seg" role="tablist" aria-label="模块筛选">
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
              >
                {m.short} ({m.count})
              </button>
            ))}
          </div>
          <button
            className="flip-all"
            id="flipAllBtn"
            onClick={toggleAll}
            aria-pressed={isAllFlipped}
          >
            {isAllFlipped ? '全部翻回' : '全部翻面'}
          </button>
        </div>
      </div>

      {/* ========== 类别分组 ========== */}
      {grouped.length === 0 ? (
        <div className="phase-hint">该模块暂无公式数据。</div>
      ) : (
        grouped.map(({ module, items }) => (
          <section
            key={module.id}
            className={`group color-${module.id === 'deriv' ? 'deriv' : module.id === 'trig' ? 'trig' : module.id === 'integral' ? 'integral' : ''}`}
            style={{
              borderLeftColor: module.color,
              borderLeftWidth: 2,
              borderLeftStyle: 'solid',
              paddingLeft: 16,
              marginTop: 36,
            }}
          >
            <div className="group-head">
              <span
                className="pill"
                style={{ background: hexToSoftBg(module.color), color: module.color }}
              >
                {module.short}
              </span>
              <h2>{module.title}</h2>
              <span className="meta">
                <Link
                  to={`/chapter/${encodeURIComponent(SLUG_BY_MODULE[module.id])}`}
                  style={{ color: 'inherit' }}
                >
                  进入章节 →
                </Link>{' · '}
                {items.length} 张
              </span>
            </div>
            <div className="card-grid">
              {items.map((f) => (
                <FlipCard key={f.id} formula={f} forceFlipped={forceFlipped ?? undefined} />
              ))}
            </div>
          </section>
        ))
      )}

      <p
        style={{
          textAlign: 'center',
          color: 'var(--muted)',
          fontSize: 12.5,
          marginTop: 48,
        }}
      >
        共 {visible.length} 张翻卡 · 当前显示 {grouped.length} 个模块 · 切换模块时翻面状态自动重置
      </p>
    </div>
  );
}

// ---- helpers ------------------------------------------------------------

// 与 content.ts 保持一致的 moduleId → slug 映射
const SLUG_BY_MODULE: Record<ModuleId, string> = {
  limit: '01-函数、极限、连续',
  deriv: '02-导数',
  diff: '03-微分',
  integral: '04-积分',
  trig: '05-三角函数',
  diffEq: '06-微分方程',
  linalg: '07-线性代数-行列式',
};

function hexToSoftBg(hex: string) {
  const m = hex.replace('#', '');
  const v = m.length === 3 ? m.split('').map((c) => c + c).join('') : m;
  const num = parseInt(v, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, 0.14)`;
}
