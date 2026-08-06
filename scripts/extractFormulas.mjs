#!/usr/bin/env node
/**
 * 抽提 src/index.html 中所有 formulaCard(...) 调用
 * 输出 src/data/formulas.js（共享数据，index.html / review.html 都能用）
 */
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.resolve('src/index.html');
const OUT_DIR = path.resolve('src/data');
const OUT = path.join(OUT_DIR, 'formulas.js');

const html = fs.readFileSync(SRC, 'utf8');

// 匹配 formulaCard(num, label, formula, note, color) - 多行
// 用一个简单的状态机扫描嵌套字符串
function extractFormulaCards(src) {
  const results = [];
  let i = 0;
  while (i < src.length) {
    const idx = src.indexOf('formulaCard(', i);
    if (idx === -1) break;
    // 跳过函数定义
    const before = src.substring(Math.max(0, idx - 12), idx);
    if (before.includes('function ')) {
      i = idx + 12;
      continue;
    }
    const start = idx + 'formulaCard('.length;
    // 扫描参数
    const args = [];
    let j = start;
    while (j < src.length) {
      // 跳过空白
      while (j < src.length && /\s/.test(src[j])) j++;
      if (j >= src.length) break;
      let value = '';
      if (src[j] === "'" || src[j] === '"') {
        const q = src[j];
        j++;
        while (j < src.length && src[j] !== q) {
          if (src[j] === '\\' && j + 1 < src.length) {
            // 按 JS 字符串字面量规则解析转义序列
            const next = src[j + 1];
            if (next === '\\') value += '\\';
            else if (next === "'") value += "'";
            else if (next === '"') value += '"';
            else if (next === 'n') value += '\n';
            else if (next === 'r') value += '\r';
            else if (next === 't') value += '\t';
            else if (next === '0') value += '\0';
            else value += next;
            j += 2;
          } else {
            value += src[j];
            j++;
          }
        }
        j++; // skip closing quote
      } else {
        // 数字或裸字符串
        while (j < src.length && src[j] !== ',' && src[j] !== ')') {
          value += src[j];
          j++;
        }
      }
      args.push(value);
      while (j < src.length && /\s/.test(src[j])) j++;
      if (src[j] === ',') {
        j++;
        continue;
      }
      if (src[j] === ')') {
        j++;
        break;
      }
    }
    if (args.length >= 3) {
      results.push({
        num: args[0] || '',
        label: args[1] || '',
        formula: args[2] || '',
        note: args[3] || '',
        color: args[4] || '#0A84FF',
      });
    }
    i = j;
  }
  return results;
}

const cards = extractFormulaCards(html);
console.log(`抽出 ${cards.length} 条 formulaCard`);

// 推断 module（基于颜色 + label 关键词）
function inferModule(color) {
  // 颜色：0A84FF 蓝=导数 / FF9F0A 橙=对数指数 / 30D158 绿=三角 / BF5AF2 紫=反三角 / FFD60A 黄=幂函数 / 5AC8FA 浅蓝=特殊
  // 实际上更可靠的方式是通过 buildXxxDetail 的调用顺序来分配 module
  // 这里根据 buildXxxDetail 的位置匹配
  return 'unknown';
}

// 用 buildXxxDetail 的位置切分 cards
function splitBySection(src, cards) {
  // 找每个 buildXxxDetail 函数的开始位置
  const sections = [
    { name: 'derivative', title: '导数', module: 'deriv', color: '#0A84FF' },
    { name: 'differential', title: '微分', module: 'diff', color: '#BF5AF2' },
    { name: 'integral', title: '积分', module: 'integral', color: '#30D158' },
    { name: 'trigonometric', title: '三角函数', module: 'trig', color: '#FF3B30' },
    { name: 'equation', title: '微分方程', module: 'diffEq', color: '#FF9F0A' },
    { name: 'linear', title: '线性代数', module: 'linalg', color: '#5AC8FA' },
    { name: 'function', title: '函数·极限·连续', module: 'limit', color: '#FFD60A' },
  ];

  // 找每个 formulaCard 在 src 中的位置（排除函数定义行）
const positions = [];
let p = 0;
while ((p = src.indexOf('formulaCard(', p)) !== -1) {
  // 跳过函数定义："function formulaCard(...)" 这种位置
  // 检查前面 9 个字符是否是 "function "
  const before = src.substring(Math.max(0, p - 12), p);
  if (before.includes('function ')) {
    p += 12;
    continue;
  }
  positions.push(p);
  p += 12;
}
  // 找每个 build 函数的起始位置
  const sectionRanges = sections.map((s) => {
    const idx = src.indexOf(`function build${s.name[0].toUpperCase() + s.name.slice(1)}Detail`);
    return { ...s, start: idx, end: Infinity };
  });
  // 排序并计算 end
  sectionRanges.sort((a, b) => a.start - b.start);
  for (let i = 0; i < sectionRanges.length; i++) {
    sectionRanges[i].end = sectionRanges[i + 1]?.start ?? Infinity;
  }

  // 给每个 card 分配 module
  return cards.map((c, i) => {
    const pos = positions[i];
    const sec = sectionRanges.find((s) => pos >= s.start && pos < s.end);
    return { ...c, module: sec?.module ?? 'limit', moduleTitle: sec?.title ?? '', moduleColor: sec?.color ?? '#FFD60A' };
  });
}

const enriched = splitBySection(html, cards);

// 按 module 分组
const byModule = {};
for (const c of enriched) {
  if (!byModule[c.module]) {
    byModule[c.module] = {
      id: c.module,
      title: c.moduleTitle,
      color: c.moduleColor,
      formulas: [],
    };
  }
  byModule[c.module].formulas.push({
    num: c.num,
    label: c.label,
    formula: c.formula,
    note: c.note,
    color: c.color,
  });
}

const formulaList = Object.values(byModule).flatMap((m) =>
  m.formulas.map((f, i) => ({
    id: m.id + '_' + String(i + 1).padStart(3, '0'),
    module: m.id,
    num: f.num,
    label: f.label,
    formula: f.formula,
    note: f.note,
    color: f.color,
  }))
);

const modulesList = Object.values(byModule).map((m) => ({
  id: m.id,
  title: m.title,
  color: m.color,
  count: m.formulas.length,
}));

// JS 字符串字面量转义：用单引号包裹字符串，转义反斜杠 / 单引号 / 控制字符
// 这样 KaTeX 拿到的就是原始的 LaTeX 文本，不会被双重转义
function jsStr(s) {
  if (s == null) return "''";
  return "'" + String(s)
    .replace(/\\/g, '\\\\')  // 反斜杠 → 双反斜杠（仅为了 JS 字符串字面量合法）
    .replace(/'/g, "\\'")     // 单引号转义
    .replace(/\n/g, '\\n')   // 换行
    .replace(/\r/g, '\\r')   // 回车
    + "'";
}

const lines = [];
lines.push('// 公式数据（自动从 src/index.html 抽提，勿手改）');
lines.push('// 由 scripts/extractFormulas.mjs 生成');
lines.push('// 字段：module / id / num / label / formula / note / color');
lines.push('// module ∈ { deriv, diff, integral, trig, diffEq, linalg, limit }');
lines.push('');
lines.push('export const FORMULAS = [');
for (const f of formulaList) {
  lines.push('  {');
  lines.push('    id: ' + jsStr(f.id) + ',');
  lines.push('    module: ' + jsStr(f.module) + ',');
  lines.push('    num: ' + jsStr(f.num) + ',');
  lines.push('    label: ' + jsStr(f.label) + ',');
  lines.push('    formula: ' + jsStr(f.formula) + ',');
  lines.push('    note: ' + jsStr(f.note) + ',');
  lines.push('    color: ' + jsStr(f.color) + ',');
  lines.push('  },');
}
lines.push('];');
lines.push('');
lines.push('export const MODULES = [');
for (const m of modulesList) {
  lines.push('  {');
  lines.push('    id: ' + jsStr(m.id) + ',');
  lines.push('    title: ' + jsStr(m.title) + ',');
  lines.push('    color: ' + jsStr(m.color) + ',');
  lines.push('    count: ' + (typeof m.count === 'number' ? m.count : 0) + ',');
  lines.push('  },');
}
lines.push('];');
lines.push('');

const output = lines.join('\n');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT, output, 'utf8');
console.log(`已写入 ${OUT}，共 ${enriched.length} 条公式，分 ${Object.keys(byModule).length} 个模块`);
console.log('各模块统计：', Object.fromEntries(Object.entries(byModule).map(([k, v]) => [k, v.formulas.length])));
