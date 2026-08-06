import { useTheme } from '../../lib/theme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      className="btn"
      onClick={toggleTheme}
      aria-label={`切换到${isDark ? '浅色' : '深色'}主题`}
      title={`当前：${isDark ? '深色' : '浅色'}主题`}
    >
      {isDark ? '☀️ 浅色' : '🌙 深色'}
    </button>
  );
}
