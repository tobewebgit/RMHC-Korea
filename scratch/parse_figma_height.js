import fs from 'fs';

const rawData = fs.readFileSync('scratch/figma_node_data.json', 'utf8');
const data = JSON.parse(rawData);

const textNodes = [];
const tableRows = [];

function traverse(node) {
  if (!node) return;
  
  if (node.type === 'TEXT') {
    textNodes.push({
      characters: node.characters,
      fontSize: node.style?.fontSize,
      height: node.absoluteBoundingBox?.height
    });
  }
  
  // 만약 Auto Layout 프레임이나 테이블 행(Row)으로 보이는 노드들을 찾기 위해
  if (node.type === 'FRAME' && (node.name?.includes('Row') || node.name?.includes('Cell') || node.name?.includes('Table'))) {
    tableRows.push({
      name: node.name,
      width: node.absoluteBoundingBox?.width,
      height: node.absoluteBoundingBox?.height,
      paddingTop: node.paddingTop,
      paddingBottom: node.paddingBottom
    });
  }
  
  if (node.children) {
    node.children.forEach(traverse);
  }
}

const nodeId = '2405:82827';
const rootDocument = data.nodes[nodeId]?.document;
traverse(rootDocument);

console.log('--- FOUND TEXT NODES SIZES ---');
textNodes.forEach(item => {
  if (item.characters.length < 50) {
    console.log(`Text: "${item.characters.replace(/\n/g, ' ')}" | Size: ${item.fontSize}px | Box Height: ${item.height}px`);
  }
});

console.log('\n--- FOUND FRAME/CELL SIZES ---');
tableRows.forEach(item => {
  console.log(`Frame: "${item.name}" | Height: ${item.height}px | PaddingTop: ${item.paddingTop}px | PaddingBottom: ${item.paddingBottom}px`);
});
