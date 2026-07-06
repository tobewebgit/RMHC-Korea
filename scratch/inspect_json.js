import fs from 'fs';

const rawData = fs.readFileSync('scratch/figma_node_data.json', 'utf8');
const data = JSON.parse(rawData);
const rootNode = Object.values(data.nodes)[0].document;

let output = '';
function analyzeLayout(node, depth = 0) {
  const indent = '  '.repeat(depth);
  let info = `${indent}[${node.type}] name: "${node.name}" (id: ${node.id})`;
  
  if (node.absoluteBoundingBox) {
    const box = node.absoluteBoundingBox;
    info += ` [Box: x=${Math.round(box.x)}, y=${Math.round(box.y)}, w=${Math.round(box.width)}, h=${Math.round(box.height)}]`;
  }
  
  if (node.type === 'TEXT') {
    info += ` -> text: "${node.characters.replace(/\n/g, '\\n')}"`;
    if (node.style) {
      const s = node.style;
      info += ` (Font: ${s.fontFamily}, Size: ${s.fontSize}px, Weight: ${s.fontWeight}, LineHeight: ${Math.round(s.lineHeightPx || 0)}px)`;
    }
  }
  
  output += info + '\n';
  
  if (node.children) {
    // 자식 노드들을 Y 좌표 기준으로 정렬해서 계층 분석을 돕는다
    const sortedChildren = [...node.children].sort((a, b) => {
      const ay = a.absoluteBoundingBox?.y ?? 0;
      const by = b.absoluteBoundingBox?.y ?? 0;
      return ay - by;
    });
    sortedChildren.forEach(child => analyzeLayout(child, depth + 1));
  }
}

analyzeLayout(rootNode);
fs.writeFileSync('scratch/figma_layout_spec.txt', output);
console.log('Saved detailed layout spec to scratch/figma_layout_spec.txt');
