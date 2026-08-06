/**
 * Chapter metadata source.
 * The actual note files are kept in `notes/*.md` at the repository root.
 * We use Vite's import.meta.glob to enumerate them at build time so the SPA
 * stays type-safe without pulling in a markdown parser for this phase.
 */
export interface ChapterMeta {
  /** url slug, e.g. "01-函数、极限、连续" */
  slug: string;
  /** display title, derived from the filename */
  title: string;
  /** short marketing copy shown on the home card */
  desc: string;
  /** accent color used in the card border / icon */
  color: string;
}

const RAW_FILES = import.meta.glob('/notes/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const SLUG_TO_DESC: Record<string, string> = {
  '01-函数、极限、连续': '高数开篇第一章：函数、极限、连续，含四川 2024、山东 2023 等专升本真题。',
  '02-导数': '导数定义、求导法则、隐函数与参数方程求导、高阶导数。',
  '03-微分': '微分的概念、几何意义、近似计算，以及与导数的联动。',
  '04-积分': '不定积分、定积分、换元法、分部积分、反常积分与简单应用。',
  '05-三角函数': '三角恒等变换、和差化积、积化和差、降幂公式与六边形记忆法。',
  '06-微分方程': '可分离变量、齐次、一阶线性、二阶常系数线性微分方程求解。',
  '07-线性代数-行列式': '行列式定义、性质、按行（列）展开、克拉默法则与拉普拉斯展开。',
};

const SLUG_TO_COLOR: Record<string, string> = {
  '01-函数、极限、连续': '#FFD60A',
  '02-导数': '#0A84FF',
  '03-微分': '#5AC8FA',
  '04-积分': '#30D158',
  '05-三角函数': '#FF9F0A',
  '06-微分方程': '#BF5AF2',
  '07-线性代数-行列式': '#FF3B30',
};

function filenameToSlug(path: string): string {
  const file = path.split('/').pop() ?? '';
  return file.replace(/\.md$/, '');
}

function filenameToTitle(slug: string): string {
  // Strip leading number prefix like "01-" for display
  return slug.replace(/^\d+-/, '');
}

export const CHAPTERS: ChapterMeta[] = Object.keys(RAW_FILES)
  .map((path) => {
    const slug = filenameToSlug(path);
    return {
      slug,
      title: filenameToTitle(slug),
      desc: SLUG_TO_DESC[slug] ?? '点击查看章节详情',
      color: SLUG_TO_COLOR[slug] ?? '#0A84FF',
    } satisfies ChapterMeta;
  })
  .sort((a, b) => a.slug.localeCompare(b.slug));

export function getChapterBySlug(slug: string): ChapterMeta | undefined {
  return CHAPTERS.find((c) => c.slug === slug);
}
