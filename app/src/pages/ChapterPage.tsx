import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getChapterBySlug } from '../lib/content';
import { getChapterContent } from '../data/chapterContent';
import { renderKatex, renderMixedText } from '../lib/katex';

export default function ChapterPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const decodedSlug = useMemo(() => decodeURIComponent(slug), [slug]);
  const chapter = getChapterBySlug(decodedSlug);
  const content = getChapterContent(decodedSlug);

  if (!chapter) {
    return (
      <div className="page-shell">
        <Link to="/" className="btn">← 返回首页</Link>
        <h1 className="page-title" style={{ marginTop: '1rem' }}>未找到章节</h1>
        <p className="page-subtitle">slug: {decodedSlug}</p>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <Link to="/" className="btn">← 返回卡片</Link>
        <span className="chapter-card-tag" style={{ color: chapter.color }}>
          {chapter.slug}
        </span>
      </div>

      <h1 className="page-title" style={{ color: chapter.color }}>
        {chapter.title}
      </h1>
      <p className="page-subtitle">{chapter.desc}</p>

      {content ? (
        <ChapterBody content={content} />
      ) : (
        <div className="placeholder-banner">
          ⚠️ 该章节暂无内容数据。
        </div>
      )}
    </div>
  );
}

function ChapterBody({ content }: { content: ReturnType<typeof getChapterContent> & object }) {
  if (!content) return null;
  return (
    <div className="chapter-body">
      {content.intro && (
        <p
          className="chapter-intro"
          style={{ fontSize: '0.95rem', lineHeight: 1.7, marginTop: '1.5rem' }}
          dangerouslySetInnerHTML={{ __html: renderMixedText(content.intro) }}
        />
      )}

      {content.sections.map((s, idx) => (
        <section key={idx} style={{ marginTop: '2rem' }}>
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              margin: '1.2rem 0 0.6rem',
              color: 'var(--text-primary)',
            }}
          >
            {s.heading}
          </h2>
          {s.paragraphs.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>（占位）</p>
          ) : (
            s.paragraphs.map((p, pIdx) => {
              // 段落以 $$...$$ 包裹时，整段当 display math 渲染
              if (p.startsWith('$$') && p.endsWith('$$') && p.length > 4) {
                const tex = p.slice(2, -2).trim();
                return (
                  <div
                    key={pIdx}
                    className="formula-block"
                    style={{ margin: '0.8rem 0' }}
                    dangerouslySetInnerHTML={{ __html: renderKatex(tex, true) }}
                  />
                );
              }
              // 普通段落：渲染 $...$ inline math
              return (
                <p
                  key={pIdx}
                  style={{ lineHeight: 1.75, margin: '0.5rem 0' }}
                  dangerouslySetInnerHTML={{ __html: renderMixedText(p) }}
                />
              );
            })
          )}
        </section>
      ))}
    </div>
  );
}

