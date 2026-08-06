import { Link } from 'react-router-dom';
import { CHAPTERS } from '../lib/content';
import ThemeToggle from '../components/ThemeToggle/ThemeToggle';

export default function HomePage() {
  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <h1 className="page-title">📐 四川专升本高数 · 框架梳理</h1>
          <p className="page-subtitle">Vite + React SPA 阶段 1 脚手架 · 共 {CHAPTERS.length} 章</p>
        </div>
        <ThemeToggle />
      </header>

      <section className="quick-access">
        <Link to="/review" className="quick-card quick-review">
          <span className="quick-icon">🎴</span>
          <div>
            <strong>翻卡记忆</strong>
            <span>3D 翻面 · 7 模块 120 条公式</span>
          </div>
        </Link>
      </section>

      <section className="chapter-grid">
        {CHAPTERS.map((ch) => (
          <Link
            key={ch.slug}
            to={`/chapter/${encodeURIComponent(ch.slug)}`}
            className="chapter-card"
            style={{ borderColor: ch.color }}
          >
            <span className="chapter-card-tag" style={{ color: ch.color }}>
              {ch.slug.split('-')[0]}
            </span>
            <span className="chapter-card-title">{ch.title}</span>
            <span className="chapter-card-desc">{ch.desc}</span>
            {ch.intro && <span className="chapter-card-intro">{ch.intro}</span>}
          </Link>
        ))}
      </section>

      <div className="phase-hint">
        💡 Phase 1+2 已完成：120 条公式 + 7 章正文已接入。下一阶段加入翻卡记忆剧场与真题自测。
      </div>
    </div>
  );
}
