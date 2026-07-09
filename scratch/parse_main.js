import fs from 'fs';

const raw = JSON.parse(fs.readFileSync('scratch/figma_main_sections.json', 'utf-8'));
const root = raw.nodes['2531:56502'].document;

// 색상 변환 헬퍼
const toHex = (c) => {
  if (!c) return 'none';
  const r = Math.round(c.r * 255).toString(16).padStart(2, '0');
  const g = Math.round(c.g * 255).toString(16).padStart(2, '0');
  const b = Math.round(c.b * 255).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
};

const getFill = (node) => {
  const f = node.fills?.[0];
  if (!f) return 'none';
  if (f.type === 'SOLID') return toHex(f.color);
  return f.type;
};

// 노드 재귀 분석 (depth 제한)
function analyzeNode(node, depth = 0, maxDepth = 4) {
  if (depth > maxDepth) return null;
  const indent = '  '.repeat(depth);
  const lines = [];
  const fill = getFill(node);
  const size = node.absoluteBoundingBox
    ? `${Math.round(node.absoluteBoundingBox.width)}×${Math.round(node.absoluteBoundingBox.height)}`
    : '';

  // 기본 정보
  let info = `${indent}[${node.type}] "${node.name}"`;
  if (fill !== 'none') info += `  bg:${fill}`;
  if (size) info += `  size:${size}`;

  // TEXT 노드 상세
  if (node.type === 'TEXT') {
    const s = node.style || {};
    info += `\n${indent}  text: "${(node.characters || '').replace(/\n/g, ' ↵ ').slice(0, 80)}"`;
    info += `\n${indent}  font: ${s.fontFamily || ''} ${s.fontWeight || ''} ${s.fontSize || ''}px  lh:${s.lineHeightPercentFontSize || ''}%`;
    info += `\n${indent}  color: ${getFill(node)}  align:${s.textAlignHorizontal || ''}`;
  }

  lines.push(info);

  // 자식 재귀
  if (node.children && depth < maxDepth) {
    node.children.forEach(child => {
      const r = analyzeNode(child, depth + 1, maxDepth);
      if (r) lines.push(r);
    });
  }
  return lines.join('\n');
}

const output = [];

// 섹션 1~4 분석
const sectionMap = {
  '2531:56503': '섹션1 (양산하우스 소개)',
  '2531:56602': '섹션2 (impact - 카운트)',
  '2531:56649': '섹션3 (행사 - 슬라이드)',
  '2531:56663': '섹션4 (story - 감사 마키)',
};

root.children.forEach(section => {
  const label = sectionMap[section.id];
  if (!label) return;

  output.push(`\n${'='.repeat(70)}`);
  output.push(`${label}  [${section.id}]`);
  output.push(`bg: ${getFill(section)}`);
  output.push(`size: ${JSON.stringify(section.absoluteBoundingBox)}`);
  output.push(`padding: ${JSON.stringify(section.paddingTop ?? 0)} T / ${JSON.stringify(section.paddingBottom ?? 0)} B / ${JSON.stringify(section.paddingLeft ?? 0)} L / ${JSON.stringify(section.paddingRight ?? 0)} R`);
  output.push(`itemSpacing: ${section.itemSpacing ?? 0}  layoutMode: ${section.layoutMode ?? 'NONE'}`);
  output.push('-'.repeat(70));

  section.children.forEach(child => {
    output.push(analyzeNode(child, 0, 3));
  });
});

const result = output.join('\n');
fs.writeFileSync('scratch/figma_main_parsed.txt', result);
console.log('✅ 저장 완료 → scratch/figma_main_parsed.txt');
console.log('\n' + result);
