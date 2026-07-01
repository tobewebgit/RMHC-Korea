import fs from 'fs';

const rawData = fs.readFileSync('scratch/figma_node_data.json', 'utf8');
const data = JSON.parse(rawData);

const textNodes = [];

function traverse(node) {
  if (!node) return;
  
  if (node.type === 'TEXT') {
    textNodes.push({
      characters: node.characters,
      fontSize: node.style?.fontSize,
      fontWeight: node.style?.fontWeight,
      fontFamily: node.style?.fontFamily,
      lineHeightPx: node.style?.lineHeightPx,
      color: node.fills?.[0]?.color ? JSON.stringify(node.fills[0].color) : 'none'
    });
  }
  
  if (node.children) {
    node.children.forEach(traverse);
  }
}

// Figma nodes response is nested under nodes[nodeId].document
const nodeId = '2405:84131';
const rootDocument = data.nodes[nodeId]?.document;
traverse(rootDocument);

console.log('--- FOUND TEXT NODES TYPOGRAPHY ---');
textNodes.forEach(item => {
  console.log(`Text: "${item.characters.replace(/\n/g, ' ')}"`);
  console.log(`  Font: ${item.fontFamily} | Size: ${item.fontSize}px | Weight: ${item.fontWeight} | LineHeight: ${item.lineHeightPx}px | Color: ${item.color}`);
  console.log('------------------------------------');
});
