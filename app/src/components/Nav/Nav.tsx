import { NavLink, Link } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle/ThemeToggle';

/**
 * 顶部导航（粘性、毛玻璃）
 * - 左侧 brand
 * - 中间 4 链接（章节/翻卡/自测/搜索）
 * - 右侧 search-trigger + 主题切换
 *
 * 注：搜索/自测路由当前未实现，链接为占位；后续 Phase 6/5 接入
 */
export default function Nav() {
  return (
    <nav className="nav" aria-label="主导航">
      <div className="nav-inner">
        <Link to="/" className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <span>calculus-formula-theater</span>
        </Link>
        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            章节
          </NavLink>
          <NavLink to="/review" className={({ isActive }) => (isActive ? 'active' : '')}>
            翻卡
          </NavLink>
          <NavLink to="/quiz" className={({ isActive }) => (isActive ? 'active' : '')}>
            自测
          </NavLink>
          <NavLink to="/search" className={({ isActive }) => (isActive ? 'active' : '')}>
            搜索
          </NavLink>
        </div>
        <div className="nav-right">
          <NavLink to="/search" className="search-trigger" aria-label="搜索公式">
            <SearchIcon />
            <span>搜索公式 · tan / 二倍角 / 高频</span>
            <span className="kbd">/</span>
          </NavLink>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}
