// 把 _formulas_extracted.json 转成 TypeScript 数组片段，写到 _formulas_dump.txt
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '_formulas_extracted.json'), 'utf-8'));

// ID 友好化：把 label 转成 ASCII slug（避免 ± √ ∗ 在 ID 里出现）
function idSlug(s) {
  return s
    .replace(/±/g, 'pm')
    .replace(/√/g, 'sqrt')
    .replace(/²/g, '2')
    .replace(/³/g, '3')
    .replace(/[(){}\[\]\\^$|?*+./<>:;'"`!@#%&]/g, '')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

const seen = new Map();
const enriched = data.map((f, i) => {
  // 跳过原 enriched，只生成 ID 部分
  const numKey = f.num.match(/\d+/)?.[0] ?? `${i + 1}`;
  const labelKey = idSlug(f.label) || `f${i + 1}`;
  let baseId = `${f.module}_${labelKey}_${numKey}`;
  const seenKey = `${f.module}_${labelKey}_${numKey}`;
  if (seen.has(seenKey)) {
    const c = seen.get(seenKey) + 1;
    seen.set(seenKey, c);
    baseId = `${baseId}_${c}`;
  } else {
    seen.set(seenKey, 0);
  }
  return { ...f, id: baseId };
});

const lines = enriched.map(f => {
  const lhs = f.lhs;
  const rhs = f.rhs;
  const hint = f.hint;
  return `  { id: '${f.id}', module: '${f.module}' as const, num: '${f.num}', label: '${f.label}', lhs: '${lhs}', rhs: '${rhs}', hint: '${hint}', color: '${f.color}' },`;
});

fs.writeFileSync(path.join(__dirname, '_formulas_dump.txt'), lines.join('\n') + '\n', 'utf-8');
console.log(`Wrote ${lines.length} lines → _formulas_dump.txt`);
