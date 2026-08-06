// 公式数据层
// 数据源：
//   1) src/index.html 中 build*Detail() 内的 formulaCard() 调用（103 条，由 deriveFormulas.mjs 一次性抽出）
//   2) 手动补充：limit（01 函数极限）+ linalg（07 线性代数）—— 旧 src/index.html 这两章是直接 HTML 渲染，没有 formulaCard 调用
//
// ⚠️ ID 稳定性：一旦发布到生产（写入 localStorage / URL），ID 不可修改，只能新增。如需修改请用新 ID 替代。

export type ModuleId =
  | 'limit'    // 01 函数、极限、连续
  | 'deriv'    // 02 导数
  | 'diff'     // 03 微分
  | 'integral' // 04 积分
  | 'trig'     // 05 三角函数
  | 'diffEq'   // 06 微分方程
  | 'linalg';  // 07 线性代数-行列式

export type Category = string; // 子分类：用于翻卡分组。例：'三角函数类' / '幂函数类'

export interface Formula {
  /** 稳定主键，URL/localStorage/搜索依赖 */
  id: string;
  /** 所属模块 */
  module: ModuleId;
  /** 旧编号（兼容 src/index.html） */
  num: string;
  /** 短名 */
  label: string;
  /** 公式左侧（LaTeX） */
  lhs: string;
  /** 公式右侧（LaTeX） */
  rhs: string;
  /** 联动说明 / 记忆口诀 */
  hint: string;
  /** 模块色（与 design-system.md 的 m-* 对齐） */
  color: string;
  /** 翻卡正面展示方式（默认 'lhs'，可选 'rhs' / 'full'） */
  display?: 'lhs' | 'rhs' | 'full';
  /** 翻卡分组类别（缺省时按 label 聚合） */
  category?: Category;
}

// ---------------------------------------------------------------------------
// 01 函数、极限、连续 · 手动补充（12 条，等价无穷小 + 间断点 + 极限运算法则）
// ---------------------------------------------------------------------------
const LIMIT_FORMULAS: Formula[] = [
  { id: 'limit_sinx_x_1', module: 'limit', num: '', label: 'sinx/x', lhs: '\\lim_{x \\to 0} \\frac{\\sin x}{x}', rhs: '1', hint: '⭐ 第一个重要极限。sin x 与 x 等价无穷小', color: '#FFD60A', category: '两个重要极限' },
  { id: 'limit_1x_x_2', module: 'limit', num: '', label: '(1+x)^(1/x)', lhs: '\\lim_{x \\to \\infty} \\left(1 + \\frac{1}{x}\\right)^x', rhs: 'e', hint: '⭐ 第二个重要极限。e 的定义', color: '#FFD60A', category: '两个重要极限' },
  { id: 'limit_equiv_sin', module: 'limit', num: '', label: 'sin x ~ x', lhs: '\\sin x', rhs: 'x \\quad (x \\to 0)', hint: 'x→0 时 sin x 与 x 等价', color: '#FFD60A', category: '等价无穷小' },
  { id: 'limit_equiv_tan', module: 'limit', num: '', label: 'tan x ~ x', lhs: '\\tan x', rhs: 'x \\quad (x \\to 0)', hint: 'x→0 时 tan x 与 x 等价', color: '#FFD60A', category: '等价无穷小' },
  { id: 'limit_equiv_ln1x', module: 'limit', num: '', label: 'ln(1+x) ~ x', lhs: '\\ln(1+x)', rhs: 'x \\quad (x \\to 0)', hint: '对数型等价', color: '#FFD60A', category: '等价无穷小' },
  { id: 'limit_equiv_ex1', module: 'limit', num: '', label: 'e^x-1 ~ x', lhs: 'e^x - 1', rhs: 'x \\quad (x \\to 0)', hint: '指数型等价', color: '#FFD60A', category: '等价无穷小' },
  { id: 'limit_equiv_1x', module: 'limit', num: '', label: '1-cosx ~ x²/2', lhs: '1 - \\cos x', rhs: '\\frac{x^2}{2} \\quad (x \\to 0)', hint: '⭐ 1-cos x 是 x²/2 级（比 x 还小）', color: '#FFD60A', category: '等价无穷小' },
  { id: 'limit_equiv_sqrt', module: 'limit', num: '', label: '√(1+x)-1 ~ x/2', lhs: '\\sqrt{1+x} - 1', rhs: '\\frac{x}{2} \\quad (x \\to 0)', hint: '根号型等价', color: '#FFD60A', category: '等价无穷小' },
  { id: 'limit_indeterminate', module: 'limit', num: '', label: '七种未定式', lhs: '\\frac{0}{0},\\ \\frac{\\infty}{\\infty},\\ \\infty-\\infty,\\ 0 \\cdot \\infty', rhs: '1^\\infty,\\ 0^0,\\ \\infty^0', hint: '七种未定式：分数型 2 + 减乘型 2 + 幂指型 3', color: '#FFD60A', category: '极限工具' },
  { id: 'limit_lhopital', module: 'limit', num: '', label: '洛必达', lhs: '\\lim \\frac{f(x)}{g(x)}', rhs: "\\lim \\frac{f'(x)}{g'(x)}", hint: '0/0 或 ∞/∞ 时，上下分别求导再求极限', color: '#FFD60A', category: '极限工具' },
  { id: 'limit_continuous', module: 'limit', num: '', label: '连续定义', lhs: '\\lim_{x \\to x_0} f(x)', rhs: 'f(x_0)', hint: '⭐ 连续 ⇔ 左极限=右极限=函数值', color: '#FFD60A', category: '连续与间断' },
  { id: 'limit_discont_types', module: 'limit', num: '', label: '间断点分类', lhs: 'f(x_0^-) \\neq f(x_0^+)', rhs: '\\text{跳跃/无穷/可去}', hint: '三类间断点：可去（一类）、跳跃+无穷（二类）', color: '#FFD60A', category: '连续与间断' },
];

// ---------------------------------------------------------------------------
// 07 线性代数-行列式 · 手动补充（5 条）
// ---------------------------------------------------------------------------
const LINALG_FORMULAS: Formula[] = [
  { id: 'linalg_2x2', module: 'linalg', num: '', label: '二阶行列式', lhs: '\\begin{vmatrix} a_{11} & a_{12} \\\\ a_{21} & a_{22} \\end{vmatrix}', rhs: 'a_{11}a_{22} - a_{12}a_{21}', hint: '⭐ 主对角相乘减副对角相乘', color: '#FF3B30' },
  { id: 'linalg_3x3', module: 'linalg', num: '', label: '三阶行列式', lhs: 'D = a_{11}A_{11} + a_{12}A_{12} + a_{13}A_{13}', rhs: '\\text{（按第 1 行展开）}', hint: '沙路法：3 主对角线相乘相加 - 3 副对角线相乘相加', color: '#FF3B30' },
  { id: 'linalg_expand', module: 'linalg', num: '', label: '拉普拉斯展开', lhs: 'D = \\sum_{j=1}^{n} a_{ij} A_{ij}', rhs: '\\text{（按第 i 行展开）}', hint: 'A_ij = (-1)^{i+j} M_ij。M_ij 是余子式', color: '#FF3B30' },
  { id: 'linalg_cramer', module: 'linalg', num: '', label: '克拉默法则', lhs: 'x_i = \\frac{D_i}{D}', rhs: 'D \\neq 0 \\text{ 时唯一解}', hint: '⭐ D_i = D 的第 i 列换成常数列', color: '#FF3B30' },
  { id: 'linalg_vandermonde', module: 'linalg', num: '', label: '范德蒙德', lhs: '\\begin{vmatrix} 1 & 1 & \\cdots & 1 \\\\ x_1 & x_2 & \\cdots & x_n \\\\ \\vdots & \\vdots & \\ddots & \\vdots \\\\ x_1^{n-1} & x_2^{n-1} & \\cdots & x_n^{n-1} \\end{vmatrix}', rhs: '\\prod_{1 \\le i < j \\le n} (x_j - x_i)', hint: '连乘展开：所有 x_j-x_i 的乘积（j>i）', color: '#FF3B30' },
];

// ---------------------------------------------------------------------------
// 02-06 章节 · 自动抽取（103 条）
// ---------------------------------------------------------------------------
const FORMULAS: Formula[] = [
  // === 02 导数 (18 条) ===
  { id: 'deriv_常数_1', module: 'deriv' as const, num: '(1)', label: '常数', lhs: '(c)\'', rhs: '0', hint: '常数的导数为零——因为常数不变化', color: '#FFD60A' },
  { id: 'deriv_幂函数_2', module: 'deriv' as const, num: '(2)', label: '幂函数', lhs: '(x^\\mu)\'', rhs: '\\mu x^{\\mu-1}', hint: '核心口诀：指数降一次做系数。这是用得最多的求导公式', color: '#FFD60A' },
  { id: 'deriv_正弦_3', module: 'deriv' as const, num: '(3)', label: '正弦', lhs: '(\\sin x)\'', rhs: '\\cos x', hint: 'sin → cos，正变余', color: '#30D158' },
  { id: 'deriv_余弦_4', module: 'deriv' as const, num: '(4)', label: '余弦', lhs: '(\\cos x)\'', rhs: '-\\sin x', hint: 'cos → -sin，余变负', color: '#30D158' },
  { id: 'deriv_正切_5', module: 'deriv' as const, num: '(5)', label: '正切', lhs: '(\\tan x)\'', rhs: '\\sec^2 x', hint: '积分高频：∫sec²x dx = tan x + C', color: '#30D158' },
  { id: 'deriv_余切_6', module: 'deriv' as const, num: '(6)', label: '余切', lhs: '(\\cot x)\'', rhs: '-\\csc^2 x', hint: '带「余」字的导数都带负号', color: '#30D158' },
  { id: 'deriv_正割_7', module: 'deriv' as const, num: '(7)', label: '正割', lhs: '(\\sec x)\'', rhs: '\\sec x \\cdot \\tan x', hint: '积分高频：∫sec x tan x dx = sec x + C', color: '#30D158' },
  { id: 'deriv_余割_8', module: 'deriv' as const, num: '(8)', label: '余割', lhs: '(\\csc x)\'', rhs: '-\\csc x \\cdot \\cot x', hint: '同样带负号', color: '#30D158' },
  { id: 'deriv_自然指数_9', module: 'deriv' as const, num: '(9)', label: '自然指数', lhs: '(e^x)\'', rhs: 'e^x', hint: '⭐ 唯一一个求导后不变形的初等函数！高频考点', color: '#FF9F0A' },
  { id: 'deriv_一般指数_10', module: 'deriv' as const, num: '(10)', label: '一般指数', lhs: '(a^x)\'', rhs: 'a^x \\ln a', hint: '多出一个 ln a 因子。eˣ 是 a=e 的特例', color: '#FF9F0A' },
  { id: 'deriv_自然对数_11', module: 'deriv' as const, num: '(11)', label: '自然对数', lhs: '(\\ln x)\'', rhs: '\\frac{1}{x}', hint: '对数变倒数', color: '#FF9F0A' },
  { id: 'deriv_一般对数_12', module: 'deriv' as const, num: '(12)', label: '一般对数', lhs: '(\\log_a x)\'', rhs: '\\frac{1}{x \\ln a}', hint: '分母多一个 ln a', color: '#FF9F0A' },
  { id: 'deriv_反正弦_13', module: 'deriv' as const, num: '(13)', label: '反正弦', lhs: '(\\arcsin x)\'', rhs: '\\frac{1}{\\sqrt{1-x^2}}', hint: '分子为正', color: '#BF5AF2' },
  { id: 'deriv_反余弦_14', module: 'deriv' as const, num: '(14)', label: '反余弦', lhs: '(\\arccos x)\'', rhs: '-\\frac{1}{\\sqrt{1-x^2}}', hint: '分子为负——和 arcsin 只差一个负号', color: '#BF5AF2' },
  { id: 'deriv_反正切_15', module: 'deriv' as const, num: '(15)', label: '反正切', lhs: '(\\arctan x)\'', rhs: '\\frac{1}{1+x^2}', hint: '分子为正', color: '#BF5AF2' },
  { id: 'deriv_反余切_16', module: 'deriv' as const, num: '(16)', label: '反余切', lhs: '(\\text{arccot}\\, x)\'', rhs: '-\\frac{1}{1+x^2}', hint: '分子为负——和 arctan 只差一个负号', color: '#BF5AF2' },
  { id: 'deriv_线性_17', module: 'deriv' as const, num: '(17)', label: '线性', lhs: '(x)\'', rhs: '1', hint: '幂函数 μ=1 的特例', color: '#FFD60A' },
  { id: 'deriv_根式_18', module: 'deriv' as const, num: '(18)', label: '根式', lhs: '(\\sqrt{x})\'', rhs: '\\frac{1}{2\\sqrt{x}}', hint: '幂函数 μ=1/2 的特例，高频考点', color: '#FFD60A' },

  // === 03 微分 (16 条) ===
  { id: 'diff_常数_1', module: 'diff' as const, num: '(1)', label: '常数', lhs: 'd(c)', rhs: '0', hint: '常数不变化，微分为零', color: '#FFD60A' },
  { id: 'diff_幂函数_2', module: 'diff' as const, num: '(2)', label: '幂函数', lhs: 'd(x^\\mu)', rhs: '\\mu x^{\\mu-1} \\, dx', hint: '导数公式 × dx', color: '#FFD60A' },
  { id: 'diff_正弦_3', module: 'diff' as const, num: '(3)', label: '正弦', lhs: 'd(\\sin x)', rhs: '\\cos x \\, dx', hint: '', color: '#30D158' },
  { id: 'diff_余弦_4', module: 'diff' as const, num: '(4)', label: '余弦', lhs: 'd(\\cos x)', rhs: '-\\sin x \\, dx', hint: '', color: '#30D158' },
  { id: 'diff_正切_5', module: 'diff' as const, num: '(5)', label: '正切', lhs: 'd(\\tan x)', rhs: '\\sec^2 x \\, dx', hint: '', color: '#30D158' },
  { id: 'diff_余切_6', module: 'diff' as const, num: '(6)', label: '余切', lhs: 'd(\\cot x)', rhs: '-\\csc^2 x \\, dx', hint: '', color: '#30D158' },
  { id: 'diff_正割_7', module: 'diff' as const, num: '(7)', label: '正割', lhs: 'd(\\sec x)', rhs: '\\sec x \\cdot \\tan x \\, dx', hint: '', color: '#30D158' },
  { id: 'diff_余割_8', module: 'diff' as const, num: '(8)', label: '余割', lhs: 'd(\\csc x)', rhs: '-\\csc x \\cdot \\cot x \\, dx', hint: '', color: '#30D158' },
  { id: 'diff_自然指数_9', module: 'diff' as const, num: '(9)', label: '自然指数', lhs: 'd(e^x)', rhs: 'e^x \\, dx', hint: '', color: '#FF9F0A' },
  { id: 'diff_一般指数_10', module: 'diff' as const, num: '(10)', label: '一般指数', lhs: 'd(a^x)', rhs: 'a^x \\ln a \\, dx', hint: '', color: '#FF9F0A' },
  { id: 'diff_自然对数_11', module: 'diff' as const, num: '(11)', label: '自然对数', lhs: 'd(\\ln x)', rhs: '\\frac{1}{x} \\, dx', hint: '', color: '#FF9F0A' },
  { id: 'diff_一般对数_12', module: 'diff' as const, num: '(12)', label: '一般对数', lhs: 'd(\\log_a x)', rhs: '\\frac{1}{x \\ln a} \\, dx', hint: '', color: '#FF9F0A' },
  { id: 'diff_反正弦_13', module: 'diff' as const, num: '(13)', label: '反正弦', lhs: 'd(\\arcsin x)', rhs: '\\frac{1}{\\sqrt{1-x^2}} \\, dx', hint: '', color: '#BF5AF2' },
  { id: 'diff_反余弦_14', module: 'diff' as const, num: '(14)', label: '反余弦', lhs: 'd(\\arccos x)', rhs: '-\\frac{1}{\\sqrt{1-x^2}} \\, dx', hint: '', color: '#BF5AF2' },
  { id: 'diff_反正切_15', module: 'diff' as const, num: '(15)', label: '反正切', lhs: 'd(\\arctan x)', rhs: '\\frac{1}{1+x^2} \\, dx', hint: '', color: '#BF5AF2' },
  { id: 'diff_反余切_16', module: 'diff' as const, num: '(16)', label: '反余切', lhs: 'd(\\text{arccot}\\, x)', rhs: '-\\frac{1}{1+x^2} \\, dx', hint: '', color: '#BF5AF2' },

  // === 04 积分 (19 条) ===
  { id: 'integral_sqrta2-x2_型_35', module: 'integral' as const, num: '', label: '√(a²-x²) 型', lhs: '\\int \\frac{1}{\\sqrt{a^2-x^2}} \\, dx', rhs: '\\arcsin \\frac{x}{a} + c', hint: '口诀：a 在前面用 arcsin', color: '#FF9F0A' },
  { id: 'integral_sqrtx2pma2_型_36', module: 'integral' as const, num: '', label: '√(x²±a²) 型', lhs: '\\int \\frac{1}{\\sqrt{x^2 \\pm a^2}} \\, dx', rhs: '\\ln\\left|x + \\sqrt{x^2 \\pm a^2}\\right| + c', hint: '⭐ 记忆口诀：塞进去弹出来', color: '#FF9F0A' },
  { id: 'integral_余割_37', module: 'integral' as const, num: '', label: '余割', lhs: '\\int \\csc x \\, dx', rhs: '\\ln|\\csc x - \\cot x| + c', hint: '与 ∫sec x 配对记忆', color: '#30D158' },
  { id: 'integral_余切_38', module: 'integral' as const, num: '', label: '余切', lhs: '\\int \\cot x \\, dx', rhs: '\\ln|\\sin x| + c', hint: '等价于 -ln|csc x|+C', color: '#30D158' },
  { id: 'integral_正割_39', module: 'integral' as const, num: '', label: '正割', lhs: '\\int \\sec x \\, dx', rhs: '\\ln|\\sec x + \\tan x| + c', hint: '⭐ 高频考点，结果很有特色', color: '#30D158' },
  { id: 'integral_正切_40', module: 'integral' as const, num: '', label: '正切', lhs: '\\int \\tan x \\, dx', rhs: '-\\ln|\\cos x| + c', hint: '等价于 ln|sec x|+C，因为 sec x=1/cos x', color: '#30D158' },
  { id: 'integral_a2x2_型_41', module: 'integral' as const, num: '', label: 'a²+x² 型', lhs: '\\int \\frac{1}{a^2+x^2} \\, dx', rhs: '\\frac{1}{a} \\arctan \\frac{x}{a} + c', hint: '口诀：a 在前面用 arctan', color: '#FF9F0A' },
  { id: 'integral_x2-a2_型_42', module: 'integral' as const, num: '', label: 'x²-a² 型', lhs: '\\int \\frac{1}{x^2-a^2} \\, dx', rhs: '\\frac{1}{2a} \\ln\\left|\\frac{x-a}{x+a}\\right| + c', hint: '注意：分母是 x²-a²（减号）', color: '#FF9F0A' },
  { id: 'integral_常数_1', module: 'integral' as const, num: '(1)', label: '常数', lhs: '\\int k \\, dx', rhs: 'kx + c', hint: '导数 (kx)\'=k 的逆运算', color: '#FFD60A' },
  { id: 'integral_幂函数_2', module: 'integral' as const, num: '(2)', label: '幂函数', lhs: '\\int x^\\mu \\, dx', rhs: '\\frac{x^{\\mu+1}}{\\mu+1} + c', hint: '导数 (x^(μ+1)/(μ+1))\'=x^μ 的逆运算。注意 μ≠-1', color: '#FFD60A' },
  { id: 'integral_倒数_3', module: 'integral' as const, num: '(3)', label: '倒数', lhs: '\\int \\frac{dx}{x}', rhs: '\\ln|x| + c', hint: 'μ=-1 的特例，结果是对数。绝对值不能丢', color: '#FFD60A' },
  { id: 'integral_一般指数_4', module: 'integral' as const, num: '(4)', label: '一般指数', lhs: '\\int a^x \\, dx', rhs: '\\frac{a^x}{\\ln a} + c', hint: '导数 (a^x/ln a)\'=a^x 的逆运算', color: '#FF9F0A' },
  { id: 'integral_自然指数_5', module: 'integral' as const, num: '(5)', label: '自然指数', lhs: '\\int e^x \\, dx', rhs: 'e^x + c', hint: '⭐ eˣ 积分还是 eˣ，最特殊', color: '#FF9F0A' },
  { id: 'integral_余弦→正弦_6', module: 'integral' as const, num: '(6)', label: '余弦→正弦', lhs: '\\int \\cos x \\, dx', rhs: '\\sin x + c', hint: '导数 (sin x)\'=cos x 的逆运算', color: '#30D158' },
  { id: 'integral_正弦→负余弦_7', module: 'integral' as const, num: '(7)', label: '正弦→负余弦', lhs: '\\int \\sin x \\, dx', rhs: '-\\cos x + c', hint: '导数 (-cos x)\'=sin x 的逆运算', color: '#30D158' },
  { id: 'integral_正割平方_8', module: 'integral' as const, num: '(8)', label: '正割平方', lhs: '\\int \\frac{1}{\\cos^2 x} \\, dx', rhs: '\\int \\sec^2 x \\, dx = \\tan x + c', hint: '导数 (tan x)\'=sec²x 的逆运算。高频', color: '#30D158' },
  { id: 'integral_余割平方_9', module: 'integral' as const, num: '(9)', label: '余割平方', lhs: '\\int \\frac{1}{\\sin^2 x} \\, dx', rhs: '\\int \\csc^2 x \\, dx = -\\cot x + c', hint: '导数 (-cot x)\'=csc²x 的逆运算', color: '#30D158' },
  { id: 'integral_反正切型_10', module: 'integral' as const, num: '(10)', label: '反正切型', lhs: '\\int \\frac{1}{1+x^2} \\, dx', rhs: '\\arctan x + c', hint: '导数 (arctan x)\'=1/(1+x²) 的逆运算', color: '#BF5AF2' },
  { id: 'integral_反正弦型_11', module: 'integral' as const, num: '(11)', label: '反正弦型', lhs: '\\int \\frac{1}{\\sqrt{1-x^2}} \\, dx', rhs: '\\arcsin x + c', hint: '导数 (arcsin x)\'=1/√(1-x²) 的逆运算', color: '#BF5AF2' },

  // === 05 三角函数 (41 条) ===
  { id: 'trig_sqrta2-x2_积分_54', module: 'trig' as const, num: '', label: '√(a²-x²) 积分', lhs: '\\int \\frac{dx}{\\sqrt{a^2-x^2}}', rhs: '\\arcsin \\frac{x}{a} + C', hint: '口诀：a在前面用arc', color: '#FF9F0A' },
  { id: 'trig_sqrtx2pma2_积分_55', module: 'trig' as const, num: '', label: '√(x²±a²) 积分', lhs: '\\int \\frac{dx}{\\sqrt{x^2 \\pm a^2}}', rhs: '\\ln\\left|x + \\sqrt{x^2 \\pm a^2}\\right| + C', hint: '口诀：塞进去弹出来', color: '#FF9F0A' },
  { id: 'trig_1_cot2_56', module: 'trig' as const, num: '', label: '1 + cot²', lhs: '1 + \\cot^2 x', rhs: '\\csc^2 x', hint: '右侧三角形', color: '#30D158' },
  { id: 'trig_负角_57', module: 'trig' as const, num: '', label: '负角', lhs: '\\sin(-x)', rhs: '-\\sin x', hint: 'sin 为奇函数', color: '#30D158' },
  { id: 'trig_负角_58', module: 'trig' as const, num: '', label: '负角', lhs: '\\cos(-x)', rhs: '\\cos x', hint: 'cos 为偶函数', color: '#30D158' },
  { id: 'trig_核心平方_59', module: 'trig' as const, num: '', label: '核心平方', lhs: '\\sin^2 x + \\cos^2 x', rhs: '1', hint: '⭐ 三角函数的根基公式', color: '#30D158' },
  { id: 'trig_余切变形_60', module: 'trig' as const, num: '', label: '余切变形', lhs: '1 + \\cot^2 x', rhs: '\\csc^2 x = \\frac{1}{\\sin^2 x}', hint: '两边除以 sin² 得到', color: '#30D158' },
  { id: 'trig_余切换商_61', module: 'trig' as const, num: '', label: '余切换商', lhs: '\\cot x', rhs: '\\frac{\\cos x}{\\sin x}', hint: 'cos 除以 sin', color: '#0A84FF' },
  { id: 'trig_余切平方_62', module: 'trig' as const, num: '', label: '余切平方', lhs: '\\cot^2 x', rhs: '\\csc^2 x - 1', hint: '等价于 1 + cot²x = csc²x', color: '#30D158' },
  { id: 'trig_余弦二倍角①_63', module: 'trig' as const, num: '', label: '余弦二倍角①', lhs: '\\cos 2\\alpha', rhs: '\\cos^2 \\alpha - \\sin^2 \\alpha', hint: '原始形式：差平方', color: '#FFD60A' },
  { id: 'trig_余弦二倍角②_64', module: 'trig' as const, num: '', label: '余弦二倍角②', lhs: '\\cos 2\\alpha', rhs: '2\\cos^2 \\alpha - 1', hint: '只含 cos²：用平方关系消去 sin²', color: '#FFD60A' },
  { id: 'trig_余弦二倍角③_65', module: 'trig' as const, num: '', label: '余弦二倍角③', lhs: '\\cos 2\\alpha', rhs: '1 - 2\\sin^2 \\alpha', hint: '只含 sin²：用平方关系消去 cos²', color: '#FFD60A' },
  { id: 'trig_正切变形_66', module: 'trig' as const, num: '', label: '正切变形', lhs: '1 + \\tan^2 x', rhs: '\\sec^2 x = \\frac{1}{\\cos^2 x}', hint: '两边除以 cos² 得到', color: '#30D158' },
  { id: 'trig_正切换商_67', module: 'trig' as const, num: '', label: '正切换商', lhs: '\\tan x', rhs: '\\frac{\\sin x}{\\cos x}', hint: 'sin 除以 cos', color: '#0A84FF' },
  { id: 'trig_正切平方_68', module: 'trig' as const, num: '', label: '正切平方', lhs: '\\tan^2 x', rhs: '\\sec^2 x - 1', hint: '等价于 1 + tan²x = sec²x', color: '#30D158' },
  { id: 'trig_正弦二倍角_69', module: 'trig' as const, num: '', label: '正弦二倍角', lhs: '\\sin 2\\alpha', rhs: '2 \\sin \\alpha \\cos \\alpha', hint: '最简洁的二倍角公式', color: '#FFD60A' },
  { id: 'trig_正余割互倒_70', module: 'trig' as const, num: '', label: '正余割互倒', lhs: '\\sin x \\cdot \\csc x', rhs: '1 \\implies \\csc x = \\frac{1}{\\sin x}', hint: 'csc = 1/sin', color: '#0A84FF' },
  { id: 'trig_正余割互倒_71', module: 'trig' as const, num: '', label: '正余割互倒', lhs: '\\cos x \\cdot \\sec x', rhs: '1 \\implies \\sec x = \\frac{1}{\\cos x}', hint: 'sec = 1/cos', color: '#0A84FF' },
  { id: 'trig_正余切互倒_72', module: 'trig' as const, num: '', label: '正余切互倒', lhs: '\\tan x \\cdot \\cot x', rhs: '1', hint: 'tan = 1/cot', color: '#0A84FF' },
  { id: 'trig_a2x2_积分_73', module: 'trig' as const, num: '', label: 'a²+x² 积分', lhs: '\\int \\frac{dx}{a^2 + x^2}', rhs: '\\frac{1}{a} \\arctan \\frac{x}{a} + C', hint: '口诀：a在前面用arc', color: '#FF9F0A' },
  { id: 'trig_cos_15°_74', module: 'trig' as const, num: '', label: 'cos 15°', lhs: '\\cos 15°', rhs: '\\frac{\\sqrt{6}+\\sqrt{2}}{4}', hint: '利用 cos(45°-30°) 推导', color: '#FFD60A' },
  { id: 'trig_cos2_降幂_75', module: 'trig' as const, num: '', label: 'cos² 降幂', lhs: '\\cos^2 x', rhs: '\\frac{1 + \\cos 2x}{2}', hint: '由 cos2x = 2cos²x-1 反解', color: '#30D158' },
  { id: 'trig_cot_导数↔积分_76', module: 'trig' as const, num: '', label: 'cot 导数↔积分', lhs: '(\\cot x)\'', rhs: '-\\csc^2 x \\quad \\int \\csc^2 x \\, dx = -\\cot x + C', hint: '', color: '#BF5AF2' },
  { id: 'trig_cot_积分_77', module: 'trig' as const, num: '', label: 'cot 积分', lhs: '\\int \\cot x \\, dx', rhs: '-\\ln|\\csc x + \\cot x| + C = \\ln|\\sin x| + C', hint: '两种形式等价', color: '#FF9F0A' },
  { id: 'trig_csc_导数↔积分_78', module: 'trig' as const, num: '', label: 'csc 导数↔积分', lhs: '(\\csc x)\'', rhs: '-\\csc x \\cot x \\quad \\int \\csc x \\cot x \\, dx = -\\csc x + C', hint: '', color: '#BF5AF2' },
  { id: 'trig_csc_积分_79', module: 'trig' as const, num: '', label: 'csc 积分', lhs: '\\int \\csc x \\, dx', rhs: '-\\ln|\\csc x + \\cot x| + C', hint: '与 ∫cot x 结果相关', color: '#FF9F0A' },
  { id: 'trig_csc3_积分_80', module: 'trig' as const, num: '', label: 'csc³ 积分', lhs: '\\int \\csc^3 x \\, dx', rhs: '-\\frac{1}{2} \\left[\\csc x \\cot x + \\ln|\\csc x + \\cot x|\\right] + C', hint: '分部积分得到', color: '#FF9F0A' },
  { id: 'trig_sec_导数↔积分_81', module: 'trig' as const, num: '', label: 'sec 导数↔积分', lhs: '(\\sec x)\'', rhs: '\\sec x \\tan x \\quad \\int \\sec x \\tan x \\, dx = \\sec x + C', hint: '', color: '#BF5AF2' },
  { id: 'trig_sec_积分_82', module: 'trig' as const, num: '', label: 'sec 积分', lhs: '\\int \\sec x \\, dx', rhs: '\\ln|\\sec x + \\tan x| + C', hint: '⭐ 与 ∫tan x 结果相同', color: '#FF9F0A' },
  { id: 'trig_sec3_积分_83', module: 'trig' as const, num: '', label: 'sec³ 积分', lhs: '\\int \\sec^3 x \\, dx', rhs: '\\frac{1}{2} \\left[\\sec x \\tan x + \\ln|\\sec x + \\tan x|\\right] + C', hint: '分部积分得到', color: '#FF9F0A' },
  { id: 'trig_sin_15°_84', module: 'trig' as const, num: '', label: 'sin 15°', lhs: '\\sin 15°', rhs: '\\frac{\\sqrt{6}-\\sqrt{2}}{4}', hint: '利用 sin(45°-30°) 推导', color: '#FFD60A' },
  { id: 'trig_sin2_cos2_85', module: 'trig' as const, num: '', label: 'sin² + cos²', lhs: '\\sin^2 x + \\cos^2 x', rhs: '1', hint: '顶部三角形', color: '#30D158' },
  { id: 'trig_sin2_降幂_86', module: 'trig' as const, num: '', label: 'sin² 降幂', lhs: '\\sin^2 x', rhs: '\\frac{1 - \\cos 2x}{2}', hint: '由 cos2x = 1-2sin²x 反解', color: '#30D158' },
  { id: 'trig_tan_15°_87', module: 'trig' as const, num: '', label: 'tan 15°', lhs: '\\tan 15°', rhs: '2-\\sqrt{3}', hint: '由 sin15°/cos15° 得到', color: '#FFD60A' },
  { id: 'trig_tan_导数↔积分_88', module: 'trig' as const, num: '', label: 'tan 导数↔积分', lhs: '(\\tan x)\'', rhs: '\\sec^2 x \\quad \\int \\sec^2 x \\, dx = \\tan x + C', hint: '', color: '#BF5AF2' },
  { id: 'trig_tan_积分_89', module: 'trig' as const, num: '', label: 'tan 积分', lhs: '\\int \\tan x \\, dx', rhs: '\\ln|\\sec x + \\tan x| + C = \\ln|\\sec x| + C', hint: '两种形式等价', color: '#FF9F0A' },
  { id: 'trig_tan2_1_90', module: 'trig' as const, num: '', label: 'tan² + 1', lhs: '\\tan^2 x + 1', rhs: '\\sec^2 x', hint: '左侧三角形', color: '#30D158' },
  { id: 'trig_π_-_x_91', module: 'trig' as const, num: '', label: 'π - x', lhs: '\\sin(\\pi - x)', rhs: '\\sin x', hint: '第二象限，sin 为正', color: '#30D158' },
  { id: 'trig_π_-_x_92', module: 'trig' as const, num: '', label: 'π - x', lhs: '\\cos(\\pi - x)', rhs: '-\\cos x', hint: '第二象限，cos 为负', color: '#30D158' },
  { id: 'trig_π_x_93', module: 'trig' as const, num: '', label: 'π + x', lhs: '\\sin(\\pi + x)', rhs: '-\\sin x', hint: '第三象限，sin 为负', color: '#30D158' },
  { id: 'trig_π_x_94', module: 'trig' as const, num: '', label: 'π + x', lhs: '\\cos(\\pi + x)', rhs: '-\\cos x', hint: '第三象限，cos 为负', color: '#30D158' },

  // === 06 微分方程 (9 条) ===
  { id: 'diffEq_共轭复根_95', module: 'diffEq' as const, num: '', label: '共轭复根', lhs: 'y', rhs: 'e^{\\alpha x}(C_1 \\cos\\beta x + C_2 \\sin\\beta x)', hint: '条件：r_{1,2} = α ± βi', color: '#FFD60A' },
  { id: 'diffEq_两个不相等实根_96', module: 'diffEq' as const, num: '', label: '两个不相等实根', lhs: 'y', rhs: 'C_1 e^{r_1 x} + C_2 e^{r_2 x}', hint: '条件：r₁ ≠ r₂', color: '#FFD60A' },
  { id: 'diffEq_两个相等实根_97', module: 'diffEq' as const, num: '', label: '两个相等实根', lhs: 'y', rhs: '(C_1 + C_2 x)\\,e^{r_1 x}', hint: '条件：r₁ = r₂。重的那个乘 x', color: '#FFD60A' },
  { id: 'diffEq_Px_=_常数_A_98', module: 'diffEq' as const, num: '', label: 'P(x) = 常数 A', lhs: 'Q(x)', rhs: 'a', hint: '', color: '#FF9F0A' },
  { id: 'diffEq_Px_=_二次_Ax2BxC_99', module: 'diffEq' as const, num: '', label: 'P(x) = 二次 Ax²+Bx+C', lhs: 'Q(x)', rhs: 'ax^2 + bx + c', hint: '', color: '#FF9F0A' },
  { id: 'diffEq_Px_=_一次_AxB_100', module: 'diffEq' as const, num: '', label: 'P(x) = 一次 Ax+B', lhs: 'Q(x)', rhs: 'ax + b', hint: '', color: '#FF9F0A' },
  { id: 'diffEq_α_不是特征根_101', module: 'diffEq' as const, num: '', label: 'α 不是特征根', lhs: 'k', rhs: '0', hint: '不重', color: '#30D158' },
  { id: 'diffEq_α_是单根（等于其中一个）_102', module: 'diffEq' as const, num: '', label: 'α 是单根（等于其中一个）', lhs: 'k', rhs: '1', hint: '重一次', color: '#30D158' },
  { id: 'diffEq_α_是重根（等于两个）_103', module: 'diffEq' as const, num: '', label: 'α 是重根（等于两个）', lhs: 'k', rhs: '2', hint: '重两次', color: '#30D158' },
];

// ---------------------------------------------------------------------------
// 总公式表（7 章节 · 120 条）
// ---------------------------------------------------------------------------
export const ALL_FORMULAS: Formula[] = [
  ...LIMIT_FORMULAS,
  ...FORMULAS,
  ...LINALG_FORMULAS,
];

// 按模块聚合
export const FORMULAS_BY_MODULE: Record<ModuleId, Formula[]> = {
  limit: LIMIT_FORMULAS,
  deriv: FORMULAS.filter(f => f.module === 'deriv'),
  diff: FORMULAS.filter(f => f.module === 'diff'),
  integral: FORMULAS.filter(f => f.module === 'integral'),
  trig: FORMULAS.filter(f => f.module === 'trig'),
  diffEq: FORMULAS.filter(f => f.module === 'diffEq'),
  linalg: LINALG_FORMULAS,
};

// 按 ID 索引
export const FORMULAS_BY_ID: Record<string, Formula> = Object.fromEntries(
  ALL_FORMULAS.map(f => [f.id, f])
);

// 模块元数据
export interface ModuleMeta {
  id: ModuleId;
  title: string;
  short: string;
  color: string;
  count: number;
}

export const MODULES: ModuleMeta[] = [
  { id: 'limit',    title: '函数、极限、连续',     short: '极限',  color: '#FFD60A', count: LIMIT_FORMULAS.length },
  { id: 'deriv',    title: '导数',                 short: '导数',  color: '#0A84FF', count: FORMULAS.filter(f => f.module === 'deriv').length },
  { id: 'diff',     title: '微分',                 short: '微分',  color: '#5AC8FA', count: FORMULAS.filter(f => f.module === 'diff').length },
  { id: 'integral', title: '积分',                 short: '积分',  color: '#30D158', count: FORMULAS.filter(f => f.module === 'integral').length },
  { id: 'trig',     title: '三角函数',             short: '三角',  color: '#FF9F0A', count: FORMULAS.filter(f => f.module === 'trig').length },
  { id: 'diffEq',   title: '微分方程',             short: '微方',  color: '#BF5AF2', count: FORMULAS.filter(f => f.module === 'diffEq').length },
  { id: 'linalg',   title: '线性代数 · 行列式',    short: '线性',  color: '#FF3B30', count: LINALG_FORMULAS.length },
];

// 统计自检
if (import.meta.env?.DEV) {
  // 仅 dev 环境打印，避免 prod 控制台噪音
  console.info(`[formulas] ${ALL_FORMULAS.length} 条 / ${MODULES.length} 模块`);
  MODULES.forEach(m => console.info(`  ${m.short}: ${m.count} 条`));
}
