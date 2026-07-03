import fs from 'fs';

const rawData = fs.readFileSync('scratch/figma_node_data.json', 'utf8');
const data = JSON.parse(rawData);

const nodeId = '2405:105319';
const rootNode = data.nodes[nodeId];

if (!rootNode) {
  console.error('Node not found!');
  process.exit(1);
}

// 간단한 트리 분석 및 텍스트/스타일 수집
const outputLines = [];

function analyzeNode(node, depth = 0) {
  const indent = '  '.repeat(depth);
  const type = node.type;
  const name = node.name;
  
  let info = `${indent}[${type}] ${name}`;
  
  if (node.type === 'TEXT') {
    const text = node.characters.trim().replace(/\n/g, '\\n');
    const style = node.style || {};
    info += ` -> Text: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`;
    info += ` (Font: ${style.fontFamily}, Size: ${style.fontSize}px, Weight: ${style.fontWeight}, LineHeight: ${style.lineHeightPx}px, Color: ${JSON.stringify(node.fills?.[0]?.color || {})})`;
  } else if (node.type === 'FRAME' || node.type === 'INSTANCE' || node.type === 'COMPONENT') {
    const width = node.absoluteBoundingBox?.width;
    const height = node.absoluteBoundingBox?.height;
    info += ` (Size: ${width}x${height}px)`;
    if (node.paddingLeft || node.paddingTop || node.paddingRight || node.paddingBottom) {
      info += ` (Padding: L:${node.paddingLeft} T:${node.paddingTop} R:${node.paddingRight} B:${node.paddingBottom})`;
    }
    if (node.itemSpacing) {
      info += ` (Spacing: ${node.itemSpacing})`;
    }
    if (node.backgroundColor) {
      info += ` (BgColor: ${JSON.stringify(node.backgroundColor)})`;
    }
  }
  
  outputLines.push(info);
  
  if (node.children) {
    for (const child of node.children) {
      analyzeNode(child, depth + 1);
    }
  }
}

analyzeNode(rootNode.document);

fs.writeFileSync('scratch/faq_structure.txt', outputLines.join('\n'));
console.log('Successfully saved structure to scratch/faq_structure.txt');
