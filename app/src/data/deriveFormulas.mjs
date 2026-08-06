// 一次性脚本：从 src/index.html 抽取 formulaCard 数据，按 build*Detail 函数分组到模块
// 运行：node deriveFormulas.mjs
// 输出：_formulas_extracted.json（debug）+ 直接 console.log TS 代码段
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..', '..');
const HTML = path.join(ROOT, 'src', 'index.html');
const OUT = path.join(__dirname, '_formulas_extracted.json');

const html = fs.readFileSync(HTML, 'utf-8');
const lines = html.split('\n');

// 1. 找 build*Detail 函数起止行
const builders = [];
lines.forEach((line, idx) => {
  const m = line.match(/^function\s+(build\w+Detail)\s*\(/);
  if (m) builders.push({ name: m[1], line: idx + 1 });
});
for (let i = 0; i < builders.length; i++) {
  builders[i].endLine = (builders[i + 1]?.line ?? lines.length + 1);
}

// 2. 模块映射
const MODULE_MAP = {
  buildDerivativeDetail: 'deriv',
  buildDifferentialDetail: 'diff',
  buildIntegralDetail: 'integral',
  buildTrigonometricDetail: 'trig',
  buildEquationDetail: 'diffEq',
  buildLinearDetail: 'linalg',
  buildFunctionDetail: 'limit',
  buildOverviewDetail: 'overview',
};

// 3. 抽取 formulaCard
const re = /formulaCard\(\s*'((?:[^'\\]|\\.)*)'\s*,\s*'((?:[^'\\]|\\.)*)'\s*,\s*'((?:[^'\\]|\\.|\n)*?)'\s*,\s*'((?:[^'\\]|\\.|\n)*?)'\s*,\s*'((?:[^'\\]|\\.)*)'\s*\)/g;
const formulas = [];
let m;
while ((m = re.exec(html)) !== null) {
  const idx = m.index;
  const lineNo = html.slice(0, idx).split('\n').length;
  const builder = builders.find(b => lineNo >= b.line && lineNo < b.endLine);
  const module = builder ? MODULE_MAP[builder.name] ?? 'other' : 'other';
  formulas.push({
    module,
    builder: builder?.name ?? null,
    line: lineNo,
    num: m[1],
    label: m[2],
    formula: m[3].replace(/\\n/g, '\n'),
    note: m[4],
    color: m[5],
  });
}

// 4. 拆 lhs / rhs（按第一个 = 切分）
function splitFormula(tex) {
  let t = tex.trim();
  if (t.startsWith('$$') && t.endsWith('$$')) t = t.slice(2, -2).trim();
  // 处理 \implies 之类的伪等号（保留）
  const eq = t.indexOf('=');
  if (eq < 0) return { lhs: t, rhs: '' };
  return { lhs: t.slice(0, eq).trim(), rhs: t.slice(eq + 1).trim() };
}

// 5. ID 命名：module + label 拼音 + num
function toPinyinShort(s) {
  // 简化版：直接用 label 原文做 slug 化（因为 label 都是单字或短词）
  return s
    .replace(/[(){}\[\]\\^$|?*+./\\<>:;'"`!@#%&]/g, '')
    .trim();
}
const seen = new Map();
const enriched = formulas.map((f, i) => {
  const { lhs, rhs } = splitFormula(f.formula);
  const numKey = f.num.match(/\d+/)?.[0] ?? `${i + 1}`;
  const labelKey = toPinyinShort(f.label) || `f${i + 1}`;
  let baseId = `${f.module}_${labelKey}_${numKey}`;
  const seenKey = `${f.module}_${labelKey}_${numKey}`;
  if (seen.has(seenKey)) {
    const c = seen.get(seenKey) + 1;
    seen.set(seenKey, c);
    baseId = `${baseId}_${c}`;
  } else {
    seen.set(seenKey, 0);
  }
  return {
    id: baseId,
    module: f.module,
    num: f.num,
    label: f.label,
    lhs,
    rhs,
    hint: f.note || '',
    color: f.color,
  };
});

// 6. 排序
const moduleOrder = ['limit', 'deriv', 'diff', 'integral', 'trig', 'diffEq', 'linalg', 'overview', 'other'];
enriched.sort((a, b) => {
  const ma = moduleOrder.indexOf(a.module);
  const mb = moduleOrder.indexOf(b.module);
  if (ma !== mb) return ma - mb;
  const na = parseInt(a.num.match(/\d+/)?.[0] ?? '0', 10);
  const nb = parseInt(b.num.match(/\d+/)?.[0] ?? '0', 10);
  if (na !== nb) return na - nb;
  return a.label.localeCompare(b.label, 'zh-Hans');
});

fs.writeFileSync(OUT, JSON.stringify(enriched, null, 2), 'utf-8');

console.log(`抽取 ${enriched.length} 条公式 → ${OUT}`);
const byModule = {};
enriched.forEach(f => { byModule[f.module] = (byModule[f.module] ?? 0) + 1; });
console.log('\n按模块分布:');
Object.entries(byModule).forEach(([k, v]) => {
  console.log(`  ${k}: ${v}`);
});
