import fs from 'fs';

const rawData = fs.readFileSync('scratch/figma_node_data.json', 'utf8');
const data = JSON.parse(rawData);

function findParentsWithText(node, searchText, parents = []) {
  if (!node) return null;
  
  if (node.type === 'TEXT' && node.characters?.includes(searchText)) {
    console.log(`Found Text: "${node.characters}" | Box Height: ${node.absoluteBoundingBox?.height}px`);
    parents.forEach(p => {
      console.log(`  Ancestor: ${p.name} (${p.type}) | Height: ${p.absoluteBoundingBox?.height}px | Padding: Top=${p.paddingTop}px, Bottom=${p.paddingBottom}px, Left=${p.paddingLeft}px, Right=${p.paddingRight}px`);
    });
    return true;
  }
  
  if (node.children) {
    for (const child of node.children) {
      const found = findParentsWithText(child, searchText, [...parents, {
        name: node.name,
        type: node.type,
        absoluteBoundingBox: node.absoluteBoundingBox,
        paddingTop: node.paddingTop,
        paddingBottom: node.paddingBottom,
        paddingLeft: node.paddingLeft,
        paddingRight: node.paddingRight
      }]);
      if (found) return found;
    }
  }
  return false;
}

const nodeId = '2405:82827';
const rootDocument = data.nodes[nodeId]?.document;

console.log('--- INSPECTING CELL AND ROW HEIGHTS FOR "구분" ---');
findParentsWithText(rootDocument, '구분');

console.log('\n--- INSPECTING CELL AND ROW HEIGHTS FOR "정기" ---');
findParentsWithText(rootDocument, '정기');

console.log('\n--- INSPECTING CELL AND ROW HEIGHTS FOR "해지 신청" ---');
findParentsWithText(rootDocument, '해지 신청');
