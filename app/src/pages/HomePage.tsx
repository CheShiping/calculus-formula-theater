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
          </Link>
        ))}
      </section>

      <div className="placeholder-banner">
        ⚠️ 占位首页：阶段 1 仅展示章节列表 + 主题切换。后续阶段按 calculus-formula-prd 增量升级（3D 卡片剧场 / 公式详情 / 真题搜索等）。
      </div>
    </div>
  );
}
