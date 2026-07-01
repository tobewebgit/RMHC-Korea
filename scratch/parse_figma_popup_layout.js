import fs from 'fs';

const rawData = fs.readFileSync('scratch/figma_node_data.json', 'utf8');
const data = JSON.parse(rawData);

const frames = [];

function traverse(node, depth = 0) {
  if (!node) return;
  
  if (node.type === 'FRAME') {
    frames.push({
      name: node.name,
      width: node.absoluteBoundingBox?.width,
      height: node.absoluteBoundingBox?.height,
      paddingTop: node.paddingTop,
      paddingBottom: node.paddingBottom,
      paddingLeft: node.paddingLeft,
      paddingRight: node.paddingRight,
      itemSpacing: node.itemSpacing || node.gap,
      backgroundColor: node.backgroundColor ? JSON.stringify(node.backgroundColor) : 'none',
      depth
    });
  }
  
  if (node.children) {
    node.children.forEach(child => traverse(child, depth + 1));
  }
}

const nodeId = '2405:84131';
const rootDocument = data.nodes[nodeId]?.document;
traverse(rootDocument);

console.log('--- FRAME SIZES & LAYOUT SPECS ---');
frames.forEach(f => {
  // 주로 유의미한 컴포넌트들을 필터링해 보기 위해 (W가 100 이상, H가 20 이상)
  if (f.width > 30 && f.height > 20 && f.depth < 10) {
    console.log(`[Depth ${f.depth}] Frame: "${f.name}" | W: ${f.width}px, H: ${f.height}px`);
    console.log(`  Padding: T=${f.paddingTop}px, B=${f.paddingBottom}px, L=${f.paddingLeft}px, R=${f.paddingRight}px | Gap: ${f.itemSpacing}px`);
    console.log('------------------------------------------------');
  }
});
