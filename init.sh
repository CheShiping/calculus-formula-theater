#!/usr/bin/env bash
# init.sh —— 验证门禁
# 编码 agent 在声称「完成」前必须运行此脚本。
# 作用：重新生成公式数据并校验完整性，给出人工核对入口。无任何破坏性操作。
set -euo pipefail
cd "$(dirname "$0")"

echo "==> 重新生成公式数据（src/data/formulas.js，自动从 index.html 抽提）"
OUT=$(node scripts/extractFormulas.mjs)
echo "$OUT"

COUNT=$(echo "$OUT" | grep -oE '共 [0-9]+ 条公式' | grep -oE '[0-9]+')
echo "公式总数: ${COUNT:-0}"

if [ "${COUNT:-0}" -lt 176 ]; then
  echo "⚠️ 公式数（${COUNT:-0}）低于基线 176，可能误删了 formulaCard，请检查。"
  exit 1
fi

echo "✓ 公式数达标；上方已打印 7 个模块统计（含独立 matrix 模块）。"
echo "==> 下一步：npm run dev 打开 http://localhost:8001，核对 src/index.html 与 src/review.html（双主题）。"
echo "验证通过。"
