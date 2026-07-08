import fs from 'fs';

const raw = JSON.parse(fs.readFileSync('scratch/figma_node_data.json', 'utf-8'));

function toHex(c) {
  if (!c) return null;
  const r = Math.round(c.r * 255).toString(16).padStart(2, '0');
  const g = Math.round(c.g * 255).toString(16).padStart(2, '0');
  const b = Math.round(c.b * 255).toString(16).padStart(2, '0');
  const a = (c.a !== undefined) ? c.a : 1;
  return a < 1
    ? `rgba(${Math.round(c.r*255)},${Math.round(c.g*255)},${Math.round(c.b*255)},${a.toFixed(2)})`
    : `#${r}${g}${b}`;
}

function extractAllTexts(node, path = '') {
  const results = [];
  const currentPath = path ? `${path} > ${node.name}` : node.name;
  if (node.type === 'TEXT') {
    results.push({
      path: currentPath,
      characters: node.characters,
      fontSize: node.style?.fontSize,
      fontWeight: node.style?.fontWeight,
      fontFamily: node.style?.fontFamily,
      textAlign: node.style?.textAlignHorizontal,
      lineHeightPx: node.style?.lineHeightPx,
      color: node.fills?.[0]?.color ? toHex(node.fills[0].color) : null,
    });
  }
  if (node.children) {
    for (const child of node.children) {
      results.push(...extractAllTexts(child, currentPath));
    }
  }
  return results;
}

function analyzeStructure(node, depth = 0) {
  const indent = '  '.repeat(depth);
  const fills = node.fills?.filter(f => f.type === 'SOLID').map(f => toHex(f.color)) || [];
  const info = {
    id: node.id,
    name: node.name,
    type: node.type,
    w: Math.round(node.absoluteBoundingBox?.width || 0),
    h: Math.round(node.absoluteBoundingBox?.height || 0),
    layoutMode: node.layoutMode,
    paddingTop: node.paddingTop,
    paddingRight: node.paddingRight,
    paddingBottom: node.paddingBottom,
    paddingLeft: node.paddingLeft,
    itemSpacing: node.itemSpacing,
    counterAxisSpacing: node.counterAxisSpacing,
    cornerRadius: node.cornerRadius,
    fills,
  };

  let line = `${indent}[${node.type}] "${node.name}" ${info.w}x${info.h}`;
  if (fills.length) line += ` fill:${fills.join(',')}`;
  if (node.cornerRadius) line += ` r:${node.cornerRadius}`;
  if (node.layoutMode) line += ` layout:${node.layoutMode} gap:${node.itemSpacing}`;
  if (node.paddingTop !== undefined) line += ` pad:T${node.paddingTop}/R${node.paddingRight}/B${node.paddingBottom}/L${node.paddingLeft}`;
  if (node.type === 'TEXT') line += ` "${node.characters?.replace(/\n/g,' / ')?.substring(0,60)}"`;
  console.log(line);

  if (depth < 5 && node.children) {
    for (const child of node.children) {
      analyzeStructure(child, depth + 1);
    }
  }
  return info;
}

const nodeIds = ['2531:48751', '2531:48895', '2531:49006'];
const labels = ['[개인 팝업]', '[기업/단체 팝업]', '[캘린더 레이어]'];

const output = {};

for (let i = 0; i < nodeIds.length; i++) {
  const nodeId = nodeIds[i];
  const label = labels[i];
  const nodeData = raw.nodes[nodeId];

  if (!nodeData) {
    console.log(`\n${label} - 노드 없음: ${nodeId}`);
    continue;
  }

  const root = nodeData.document;
  console.log(`\n${'='.repeat(60)}`);
  console.log(`${label} 구조분석 (Node: ${nodeId})`);
  console.log('='.repeat(60));
  analyzeStructure(root);

  console.log(`\n${label} 텍스트 목록:`);
  const texts = extractAllTexts(root);
  texts.forEach(t => {
    console.log(`  [${t.fontSize}px w${t.fontWeight} ${t.fontFamily} ${t.textAlign}] "${t.characters?.replace(/\n/g,' / ')?.substring(0,80)}"`);
  });

  output[nodeId] = { structure: root, texts };
}

fs.writeFileSync('scratch/popup_volunteer_parsed.json', JSON.stringify(output, null, 2));
console.log('\npopup_volunteer_parsed.json 생성 완료');
