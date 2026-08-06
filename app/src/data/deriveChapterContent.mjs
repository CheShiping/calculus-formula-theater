// 一次性脚本：把 7 份 notes/*.md 解析成结构化 chapterContent.ts 的 source
// 运行：node app/src/data/deriveChapterContent.mjs
// 输出：app/src/data/_chapter_dump.txt（手写进 chapterContent.ts）
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NOTES = path.resolve(__dirname, '..', '..', '..', 'notes');
const OUT = path.join(__dirname, '_chapter_dump.txt');

// 章节顺序（与 src/index.html 一致）
const CHAPTERS = [
  { slug: '01-函数、极限、连续',     short: '函数、极限、连续',  module: 'limit' },
  { slug: '02-导数',                  short: '导数',              module: 'deriv' },
  { slug: '03-微分',                  short: '微分',              module: 'diff' },
  { slug: '04-积分',                  short: '积分',              module: 'integral' },
  { slug: '05-三角函数',              short: '三角函数',          module: 'trig' },
  { slug: '06-微分方程',              short: '微分方程',          module: 'diffEq' },
  { slug: '07-线性代数-行列式',       short: '线性代数 · 行列式', module: 'linalg' },
];

// 简单 markdown → 文本（保留 $...$ 和 $$...$$ 公式标记）
function stripMarkdown(md) {
  return md
    // 去掉代码块内容（整块删除，保留标记）
    .replace(/```[\s\S]*?```/g, '')
    // 去掉 HTML 标签
    .replace(/<[^>]+>/g, '')
    // 去掉表格语法（保留内容）
    .replace(/^\|.*\|$/gm, line => line.replace(/\|/g, '  ').replace(/^-+$/gm, ''))
    // 去掉列表前缀
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    // 去掉引用
    .replace(/^>\s?/gm, '')
    // 去掉加粗/斜体标记
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    // 链接转文本
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // 去除连续空行
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// 解析单个 md 文件：按 ## / ### 切分章节
function parseChapter(md) {
  // 先预处理：去掉代码块
  md = md.replace(/```[\s\S]*?```/g, '');
  // 去掉水平线
  md = md.replace(/^---+\s*$/gm, '');

  const lines = md.split('\n');
  const sections = [];
  let current = null;
  let intro = '';
  let inIntro = true;

  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (current) sections.push(current);
      inIntro = false;
      current = {
        heading: line.slice(3).trim(),
        paragraphs: [],
        formulaIds: [],
      };
    } else if (line.startsWith('### ')) {
      // 三级标题作为段落开始符
      if (current) {
        current.paragraphs.push(`**${line.slice(4).trim()}**`);
      }
    } else if (line.trim() && current) {
      const text = stripMarkdown(line);
      if (text) current.paragraphs.push(text);
    } else if (line.trim() && inIntro) {
      const text = stripMarkdown(line);
      if (text && !text.startsWith('# ')) intro += text + '\n';
    }
  }
  if (current) sections.push(current);

  // 合并段落为字符串数组（去掉空段）
  sections.forEach(s => {
    s.paragraphs = s.paragraphs.filter(p => p && p.trim());
  });
  return { intro: intro.trim(), sections };
}

// 输出 TS 字面量片段
const out = [];
for (const c of CHAPTERS) {
  const mdPath = path.join(NOTES, `${c.slug}.md`);
  if (!fs.existsSync(mdPath)) {
    console.warn(`[skip] ${mdPath} not found`);
    out.push(`  { slug: '${c.slug}', module: '${c.module}' as const, intro: '', sections: [], examples: [] },`);
    continue;
  }
  const md = fs.readFileSync(mdPath, 'utf-8');
  const parsed = parseChapter(md);

  // 字符串转义
  function esc(s) {
    return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
  }
  const introStr = esc(parsed.intro);
  const sectionsStr = parsed.sections.map(s => {
    const ps = s.paragraphs.map(p => `      '${esc(p)}',`).join('\n');
    return `    { heading: '${esc(s.heading)}', paragraphs: [\n${ps}\n    ] },`;
  }).join('\n');

  out.push(`  {`);
  out.push(`    slug: '${c.slug}',`);
  out.push(`    module: '${c.module}' as const,`);
  out.push(`    intro: '${introStr}',`);
  out.push(`    sections: [\n${sectionsStr}\n    ],`);
  out.push(`    examples: [],`);
  out.push(`  },`);
}

fs.writeFileSync(OUT, out.join('\n') + '\n', 'utf-8');
console.log(`Wrote ${out.length} chapters → ${OUT}`);
