import fs from 'fs';

const raw = JSON.parse(fs.readFileSync('scratch/figma_node_data.json', 'utf-8'));
const root = raw.nodes['2531:48628'].document;

// 색상 변환 유틸
function toHex(c) {
  if (!c) return null;
  const r = Math.round(c.r * 255).toString(16).padStart(2, '0');
  const g = Math.round(c.g * 255).toString(16).padStart(2, '0');
  const b = Math.round(c.b * 255).toString(16).padStart(2, '0');
  const a = c.a !== undefined ? c.a : 1;
  return a < 1 ? `rgba(${Math.round(c.r*255)},${Math.round(c.g*255)},${Math.round(c.b*255)},${a.toFixed(2)})` : `#${r}${g}${b}`;
}

// 노드에서 TEXT 타입 재귀 추출
function extractTexts(node, depth = 0) {
  const results = [];
  if (node.type === 'TEXT') {
    results.push({
      depth,
      id: node.id,
      name: node.name,
      characters: node.characters,
      fontSize: node.style?.fontSize,
      fontWeight: node.style?.fontWeight,
      fontFamily: node.style?.fontFamily,
      fontStyle: node.style?.fontStyle,
      textAlign: node.style?.textAlignHorizontal,
      color: node.fills?.[0]?.color ? toHex(node.fills[0].color) : null,
      w: node.absoluteBoundingBox?.width,
      h: node.absoluteBoundingBox?.height,
    });
  }
  if (node.children) {
    for (const child of node.children) {
      results.push(...extractTexts(child, depth + 1));
    }
  }
  return results;
}

// 노드에서 FRAME/INSTANCE 배경색 추출
function extractFrameColors(node, depth = 0) {
  const results = [];
  if (['FRAME', 'INSTANCE', 'COMPONENT'].includes(node.type)) {
    const bg = node.fills?.find(f => f.type === 'SOLID');
    const bgFromBackground = node.background?.find(f => f.type === 'SOLID');
    const fillColor = bg?.color || bgFromBackground?.color;
    if (fillColor) {
      results.push({
        depth,
        id: node.id,
        name: node.name,
        type: node.type,
        fill: toHex(fillColor),
        borderRadius: node.cornerRadius,
        w: node.absoluteBoundingBox?.width,
        h: node.absoluteBoundingBox?.height,
        paddingTop: node.paddingTop,
        paddingBottom: node.paddingBottom,
        paddingLeft: node.paddingLeft,
        paddingRight: node.paddingRight,
        itemSpacing: node.itemSpacing,
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

// 카드 구조 분석 (category FRAME 하위)
function analyzeCards(node) {
  const cards = [];
  
  function walk(n) {
    // goods_list_card 인스턴스 찾기
    if (n.type === 'INSTANCE' && n.name?.includes('goods')) {
      const card = {
        id: n.id,
        name: n.name,
        variant: n.componentProperties?.['Property 1']?.value,
        children: []
      };
      
      // category header
      const catFrame = n.children?.find(c => c.name === 'category');
      if (catFrame) {
        const bgFill = catFrame.fills?.find(f => f.type === 'SOLID') 
                    || catFrame.background?.find(f => f.type === 'SOLID');
        card.categoryBg = bgFill?.color ? toHex(bgFill.color) : null;
        
        const titleNode = catFrame.children?.find(c => c.type === 'TEXT');
        if (titleNode) {
          card.categoryTitle = titleNode.characters;
          card.titleFontSize = titleNode.style?.fontSize;
          card.titleFontWeight = titleNode.style?.fontWeight;
          card.titleFontFamily = titleNode.style?.fontFamily;
        }
      }
      
      // list items
      const listFrame = n.children?.find(c => c.name === 'list' || c.name?.includes('list'));
      if (listFrame) {
        const bgFill = listFrame.fills?.find(f => f.type === 'SOLID') 
                    || listFrame.background?.find(f => f.type === 'SOLID');
        card.listBg = bgFill?.color ? toHex(bgFill.color) : null;
        card.listPaddingTop = listFrame.paddingTop;
        card.listPaddingBottom = listFrame.paddingBottom;
        card.listPaddingLeft = listFrame.paddingLeft;
        card.listPaddingRight = listFrame.paddingRight;
        card.listItemSpacing = listFrame.itemSpacing;
        
        // 텍스트 아이템들 수집
        function collectTexts(node) {
          const texts = [];
          if (node.type === 'TEXT') texts.push(node.characters);
          if (node.children) node.children.forEach(c => texts.push(...collectTexts(c)));
          return texts;
        }
        card.items = collectTexts(listFrame);
        
        // list 내부 폰트 정보
        function findFirstText(node) {
          if (node.type === 'TEXT') return node;
          if (node.children) {
            for (const c of node.children) {
              const found = findFirstText(c);
              if (found) return found;
            }
          }
          return null;
        }
        const firstText = findFirstText(listFrame);
        if (firstText) {
          card.itemFontSize = firstText.style?.fontSize;
          card.itemFontWeight = firstText.style?.fontWeight;
          card.itemFontFamily = firstText.style?.fontFamily;
          card.itemColor = firstText.fills?.[0]?.color ? toHex(firstText.fills[0].color) : null;
          card.itemLineHeight = firstText.style?.lineHeightPx;
        }
      }
      
      // 전체 카드 사이즈
      card.w = n.absoluteBoundingBox?.width;
      card.h = n.absoluteBoundingBox?.height;
      card.cornerRadius = n.cornerRadius;
      
      cards.push(card);
    }
    if (n.children) n.children.forEach(walk);
  }
  
  walk(node);
  return cards;
}

// 전체 레이아웃 정보
function analyzeLayout(node) {
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
      itemSpacing: c.itemSpacing,
      counterAxisSpacing: c.counterAxisSpacing,
      paddingTop: c.paddingTop,
      paddingBottom: c.paddingBottom,
      paddingLeft: c.paddingLeft,
      paddingRight: c.paddingRight,
      fills: c.fills?.map(f => f.color ? toHex(f.color) : null),
      children: c.children?.map(gc => ({
        id: gc.id,
        name: gc.name,
        type: gc.type,
        w: gc.absoluteBoundingBox?.width,
        h: gc.absoluteBoundingBox?.height,
        layoutMode: gc.layoutMode,
        itemSpacing: gc.itemSpacing,
        counterAxisSpacing: gc.counterAxisSpacing,
        paddingTop: gc.paddingTop,
        paddingBottom: gc.paddingBottom,
        paddingLeft: gc.paddingLeft,
        paddingRight: gc.paddingRight,
        fills: gc.fills?.map(f => f.color ? toHex(f.color) : null),
      }))
    }))
  };
}

const output = {
  rootLayout: analyzeLayout(root),
  texts: extractTexts(root),
  frameColors: extractFrameColors(root),
  cards: analyzeCards(root),
};

fs.writeFileSync('scratch/goods_parsed.json', JSON.stringify(output, null, 2));
console.log('=== goods_parsed.json 생성 완료 ===');
console.log('\n[루트 레이아웃]');
console.log(`  크기: ${output.rootLayout.w} x ${output.rootLayout.h}`);
console.log(`  gap(itemSpacing): ${output.rootLayout.itemSpacing}`);
console.log(`  children: ${output.rootLayout.children?.map(c => `${c.name}(${c.w}x${c.h})`).join(', ')}`);

console.log('\n[텍스트 목록]');
output.texts.forEach(t => {
  console.log(`  [${t.fontSize}px w${t.fontWeight} ${t.fontFamily}] "${t.characters?.replace(/\n/g, ' / ')}"`);
});

console.log('\n[배경색 프레임 (fill 있는 것만)]');
output.frameColors.forEach(f => {
  console.log(`  [d:${f.depth}] "${f.name}" fill:${f.fill} r:${f.borderRadius} ${f.w}x${f.h} pad:T${f.paddingTop}/R${f.paddingRight}/B${f.paddingBottom}/L${f.paddingLeft} gap:${f.itemSpacing} ${f.layoutMode}`);
});

console.log(`\n[카드 총 ${output.cards.length}개]`);
output.cards.forEach((c, i) => {
  console.log(`\n  카드${i+1}: variant[${c.variant}] | "${c.categoryTitle}"`);
  console.log(`    카테고리 배경: ${c.categoryBg}`);
  console.log(`    타이틀: ${c.titleFontSize}px / w${c.titleFontWeight} / ${c.titleFontFamily}`);
  console.log(`    리스트 배경: ${c.listBg}`);
  console.log(`    리스트 패딩: T${c.listPaddingTop}/R${c.listPaddingRight}/B${c.listPaddingBottom}/L${c.listPaddingLeft} gap:${c.listItemSpacing}`);
  console.log(`    아이템 폰트: ${c.itemFontSize}px / w${c.itemFontWeight} / ${c.itemFontFamily} / lh:${c.itemLineHeight} / color:${c.itemColor}`);
  console.log(`    아이템 목록: [${c.items?.join('] [')}]`);
  console.log(`    카드 크기: ${c.w}x${c.h}, borderRadius:${c.cornerRadius}`);
});
