import fs from 'fs';

const raw = JSON.parse(fs.readFileSync('scratch/figma_node_data.json', 'utf-8'));
const root = raw.nodes['2531:48366'].document;

// 색상 변환 유틸
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

// 재귀로 모든 TEXT 노드 추출
function extractAllTexts(node, depth = 0, path = '') {
  const results = [];
  const currentPath = path ? `${path} > ${node.name}` : node.name;

  if (node.type === 'TEXT') {
    results.push({
      depth,
      path: currentPath,
      id: node.id,
      name: node.name,
      characters: node.characters,
      fontSize: node.style?.fontSize,
      fontWeight: node.style?.fontWeight,
      fontFamily: node.style?.fontFamily,
      textAlign: node.style?.textAlignHorizontal,
      lineHeightPx: node.style?.lineHeightPx,
      color: node.fills?.[0]?.color ? toHex(node.fills[0].color) : null,
      w: node.absoluteBoundingBox?.width,
      h: node.absoluteBoundingBox?.height,
    });
  }

  if (node.children) {
    for (const child of node.children) {
      results.push(...extractAllTexts(child, depth + 1, currentPath));
    }
  }
  return results;
}

// 배경색이 있는 FRAME/INSTANCE 추출
function extractFrameColors(node, depth = 0) {
  const results = [];
  if (['FRAME', 'INSTANCE', 'COMPONENT', 'RECTANGLE'].includes(node.type)) {
    const bg = node.fills?.find(f => f.type === 'SOLID');
    const bgBg = node.background?.find(f => f.type === 'SOLID');
    const fillColor = bg?.color || bgBg?.color;
    if (fillColor) {
      results.push({
        depth,
        id: node.id,
        name: node.name,
        type: node.type,
        fill: toHex(fillColor),
        fillOpacity: bg?.opacity,
        cornerRadius: node.cornerRadius,
        w: node.absoluteBoundingBox?.width,
        h: node.absoluteBoundingBox?.height,
        paddingTop: node.paddingTop,
        paddingBottom: node.paddingBottom,
        paddingLeft: node.paddingLeft,
        paddingRight: node.paddingRight,
        itemSpacing: node.itemSpacing,
        counterAxisSpacing: node.counterAxisSpacing,
        layoutMode: node.layoutMode,
      });
    }
  }
  if (node.children) {
    for (const child of node.children) {
      results.push(...extractFrameColors(child, depth + 1));
    }
  }
  return results;
}

// 최상위 섹션 구조 분석
function analyzeSectionStructure(node) {
  return {
    id: node.id,
    name: node.name,
    type: node.type,
    w: node.absoluteBoundingBox?.width,
    h: node.absoluteBoundingBox?.height,
    layoutMode: node.layoutMode,
    paddingTop: node.paddingTop,
    paddingBottom: node.paddingBottom,
    paddingLeft: node.paddingLeft,
    paddingRight: node.paddingRight,
    itemSpacing: node.itemSpacing,
    fills: node.fills?.map(f => f.color ? toHex(f.color) : null),
    children: node.children?.map(c => ({
      id: c.id,
      name: c.name,
      type: c.type,
      w: c.absoluteBoundingBox?.width,
      h: c.absoluteBoundingBox?.height,
      layoutMode: c.layoutMode,
      paddingTop: c.paddingTop,
      paddingBottom: c.paddingBottom,
      paddingLeft: c.paddingLeft,
      paddingRight: c.paddingRight,
      itemSpacing: c.itemSpacing,
      counterAxisSpacing: c.counterAxisSpacing,
      fills: c.fills?.map(f => f.color ? toHex(f.color) : null),
      childCount: c.children?.length,
      children: c.children?.map(gc => ({
        id: gc.id,
        name: gc.name,
        type: gc.type,
        w: gc.absoluteBoundingBox?.width,
        h: gc.absoluteBoundingBox?.height,
        layoutMode: gc.layoutMode,
        paddingTop: gc.paddingTop,
        paddingBottom: gc.paddingBottom,
        paddingLeft: gc.paddingLeft,
        paddingRight: gc.paddingRight,
        itemSpacing: gc.itemSpacing,
        counterAxisSpacing: gc.counterAxisSpacing,
        fills: gc.fills?.map(f => f.color ? toHex(f.color) : null),
        childCount: gc.children?.length,
      }))
    }))
  };
}

const output = {
  structure: analyzeSectionStructure(root),
  texts: extractAllTexts(root),
  frameColors: extractFrameColors(root),
};

fs.writeFileSync('scratch/volunteer_parsed.json', JSON.stringify(output, null, 2));
console.log('=== volunteer_parsed.json 생성 완료 ===');

console.log(`\n[루트] name:"${output.structure.name}" | ${output.structure.w}x${output.structure.h} | layoutMode:${output.structure.layoutMode} | gap:${output.structure.itemSpacing}`);
console.log('\n[최상위 섹션 목록]');
output.structure.children?.forEach((c, i) => {
  console.log(`  Section${i+1}: "${c.name}" | ${c.w}x${c.h} | layout:${c.layoutMode} | gap:${c.itemSpacing} | pad:T${c.paddingTop}/R${c.paddingRight}/B${c.paddingBottom}/L${c.paddingLeft} | fills:${c.fills?.join(',')}`);
  c.children?.forEach((gc, j) => {
    console.log(`    Child${j+1}: "${gc.name}" | ${gc.w}x${gc.h} | layout:${gc.layoutMode} | gap:${gc.itemSpacing} | cAxisGap:${gc.counterAxisSpacing} | pad:T${gc.paddingTop}/R${gc.paddingRight}/B${gc.paddingBottom}/L${gc.paddingLeft} | fills:${gc.fills?.join(',')} | children:${gc.childCount}`);
  });
});

console.log('\n[모든 텍스트]');
output.texts.forEach(t => {
  console.log(`  [${t.fontSize}px w${t.fontWeight} ${t.fontFamily} ${t.textAlign}] "${t.characters?.replace(/\n/g,' / ')}"`);
});

console.log('\n[배경색 프레임 (상위 depth 우선)]');
const topFrames = output.frameColors.filter(f => f.depth <= 5);
topFrames.forEach(f => {
  console.log(`  [d:${f.depth}] "${f.name}" ${f.type} fill:${f.fill} r:${f.cornerRadius} ${f.w}x${f.h} pad:T${f.paddingTop}/R${f.paddingRight}/B${f.paddingBottom}/L${f.paddingLeft} gap:${f.itemSpacing}`);
});
