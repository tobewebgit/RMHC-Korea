import fs from 'fs';

const rawData = fs.readFileSync('scratch/figma_node_data.json', 'utf8');
const data = JSON.parse(rawData);

const popupNodes = [];

function traverse(node, depth = 0) {
  if (!node) return;
  
  popupNodes.push({
    id: node.id,
    name: node.name,
    type: node.type,
    width: node.absoluteBoundingBox?.width,
    height: node.absoluteBoundingBox?.height,
    fills: node.fills ? JSON.stringify(node.fills) : 'none',
    strokes: node.strokes ? JSON.stringify(node.strokes) : 'none',
    strokeWeight: node.strokeWeight,
    paddingTop: node.paddingTop,
    paddingBottom: node.paddingBottom,
    paddingLeft: node.paddingLeft,
    paddingRight: node.paddingRight,
    itemSpacing: node.itemSpacing || node.gap,
    depth
  });
  
  if (node.children) {
    node.children.forEach(child => traverse(child, depth + 1));
  }
}

const nodeId = '2405:84352';
const rootDocument = data.nodes[nodeId]?.document;
traverse(rootDocument);

console.log('--- SEARCHING POPUP DETAILS ---');

// 1. 모달 전체 및 헤더/푸터 찾기
popupNodes.forEach(n => {
  if (n.name?.toLowerCase().includes('modal') || n.name?.toLowerCase().includes('header') || n.name?.toLowerCase().includes('footer') || n.name === 'Title' || n.name === 'CTA') {
    console.log(`Node: "${n.name}" | W: ${n.width}px, H: ${n.height}px | Depth: ${n.depth}`);
    console.log(`  Fills: ${n.fills}`);
    console.log(`  Strokes: ${n.strokes} | Weight: ${n.strokeWeight}px`);
    console.log(`  Padding: T=${n.paddingTop}px, B=${n.paddingBottom}px, L=${n.paddingLeft}px, R=${n.paddingRight}px`);
    console.log('------------------------------------------------');
  }
});

// 2. 탭 버튼(카카오페이 등) 찾기
console.log('\n--- TAB BUTTONS ---');
popupNodes.forEach(n => {
  if (n.name === '카카오페이' || n.name === '네이버페이' || n.name === '토스페이' || n.name === '신용카드' || n.name === 'CMS 자동이체') {
    // 탭 버튼의 부모 프레임 정보 출력
    const parentNode = popupNodes.find(p => p.id === n.id);
    console.log(`Tab Node: "${n.name}" | W: ${n.width}px, H: ${n.height}px`);
    console.log(`  Fills: ${n.fills}`);
    console.log(`  Strokes: ${n.strokes} | Weight: ${n.strokeWeight}px`);
    console.log('------------------------------------------------');
  }
});

// 3. 폼 상자(form) 찾기
console.log('\n--- FORM BOX DETAILS ---');
popupNodes.forEach(n => {
  if (n.name === 'form' || n.name === 'selectbox' || n.name === 'text') {
    console.log(`Form element: "${n.name}" | W: ${n.width}px, H: ${n.height}px`);
    console.log(`  Fills: ${n.fills}`);
    console.log(`  Strokes: ${n.strokes} | Weight: ${n.strokeWeight}px`);
    console.log(`  Padding: T=${n.paddingTop}px, B=${n.paddingBottom}px, L=${n.paddingLeft}px, R=${n.paddingRight}px`);
    console.log('------------------------------------------------');
  }
});

// 4. 모든 텍스트 노드의 characters 출력
console.log('\n--- ALL TEXT CHARACTERS ---');
const rawObj = JSON.parse(rawData);
const rootDoc = rawObj.nodes[nodeId]?.document;

function printTextNodes(node) {
  if (!node) return;
  if (node.type === 'TEXT') {
    console.log(`TEXT [id: ${node.id}]: "${node.characters}" | Size: ${node.style?.fontSize}px | Weight: ${node.style?.fontWeight}`);
  }
  if (node.children) {
    node.children.forEach(printTextNodes);
  }
}
printTextNodes(rootDoc);

