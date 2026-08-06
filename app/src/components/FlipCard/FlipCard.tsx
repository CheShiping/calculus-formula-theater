import { useState } from 'react';
import type { Formula } from '../../data/formulas';
import { renderKatex } from '../../lib/katex';

interface FlipCardProps {
  formula: Formula;
  /** 父级控制整体翻面状态（用于「全部翻面」按钮） */
  forceFlipped?: boolean;
}

/**
 * 3D 翻卡记忆组件
 * - 正面：根据 formula.display 决定渲染 lhs / rhs / 完整 / 挖空
 * - 背面：完整公式 + 联动说明
 * - 纯 CSS 3D 旋转，无 framer-motion / GSAP
 */
export default function FlipCard({ formula, forceFlipped }: FlipCardProps) {
  const [localFlipped, setLocalFlipped] = useState(false);
  // 父级 forceFlipped 变化时，强制同步到该状态
  const flipped = forceFlipped ?? localFlipped;

  const toggle = () => setLocalFlipped((v) => !v);

  // 正面展示：挖空 rhs
  const frontTex = `${formula.lhs} = \\ ?`;
  // 背面展示：完整公式
  const backTex = `${formula.lhs} = ${formula.rhs}`;

  return (
    <div
      className={`flip-card ${flipped ? 'is-flipped' : ''}`}
      onClick={toggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      }}
      aria-label={`${formula.label} · 点击翻面`}
    >
      <div className="flip-card-inner">
        {/* 正面 */}
        <div className="flip-card-face flip-card-front">
          <span className="flip-card-tag" style={{ color: formula.color, borderColor: formula.color }}>
            {formula.label}
          </span>
          <div
            className="flip-card-tex"
            dangerouslySetInnerHTML={{ __html: renderKatex(frontTex, true) }}
          />
          <span className="flip-card-hint">{formula.hint ? '提示已就位' : '回忆一下，再翻面看答案'}</span>
        </div>
        {/* 背面 */}
        <div className="flip-card-face flip-card-back" style={{ background: `linear-gradient(160deg, var(--bg-card), ${formula.color}10)` }}>
          <span className="flip-card-tag" style={{ color: formula.color, borderColor: formula.color }}>
            {formula.label}
          </span>
          <div
            className="flip-card-tex"
            style={{ color: formula.color }}
            dangerouslySetInnerHTML={{ __html: renderKatex(backTex, true) }}
          />
          {formula.hint && (
            <div
              className="flip-card-hint katex-hint"
              dangerouslySetInnerHTML={{ __html: renderKatex(formula.hint, false) }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
