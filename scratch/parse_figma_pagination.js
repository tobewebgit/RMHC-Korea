import fs from 'fs';

const rawData = fs.readFileSync('scratch/figma_node_data.json', 'utf8');
const data = JSON.parse(rawData);

const paginationFrames = [];

function traverse(node, parents = []) {
  if (!node) return;
  
  if (node.type === 'TEXT' && (node.characters === '1' || node.characters === '2')) {
    parents.forEach(p => {
      paginationFrames.push({
        name: p.name,
        type: p.type,
        width: p.absoluteBoundingBox?.width,
        height: p.absoluteBoundingBox?.height,
        backgroundColor: p.backgroundColor ? JSON.stringify(p.backgroundColor) : 'none',
        fills: p.fills ? JSON.stringify(p.fills) : 'none',
        strokes: p.strokes ? JSON.stringify(p.strokes) : 'none',
        strokeWeight: p.strokeWeight,
        itemSpacing: p.itemSpacing,
        gap: p.gap
      });
    });
  }
  
  if (node.children) {
    node.children.forEach(child => traverse(child, [...parents, {
      name: node.name,
      type: node.type,
      absoluteBoundingBox: node.absoluteBoundingBox,
      backgroundColor: node.backgroundColor,
      fills: node.fills,
      strokes: node.strokes,
      strokeWeight: node.strokeWeight,
      itemSpacing: node.itemSpacing,
      gap: node.gap
    }]));
  }
}

const nodeId = '2405:82827';
const rootDocument = data.nodes[nodeId]?.document;
traverse(rootDocument);

console.log('--- PAGINATION NODES SPECS ---');
const uniqueFrames = [];
const seen = new Set();
paginationFrames.forEach(f => {
  const key = `${f.name}-${f.width}-${f.height}`;
  if (!seen.has(key)) {
    seen.add(key);
    uniqueFrames.push(f);
  }
});

uniqueFrames.forEach(f => {
  console.log(`Frame: "${f.name}" | W: ${f.width}px, H: ${f.height}px | Spacing/Gap: ${f.itemSpacing || f.gap}px`);
  console.log(`  Fills: ${f.fills}`);
  console.log(`  Strokes: ${f.strokes} | Weight: ${f.strokeWeight}px`);
  console.log('------------------------------------------------');
});
