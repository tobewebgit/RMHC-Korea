/**
 * 피그마 API에서 메인 페이지 키비주얼 섹션의 정확한 수치를 추출
 * "메인" 프레임 하위의 키비주얼/하트 관련 노드만 출력
 */
const TOKEN = 'figd_clXAeVN1_xkm42t83PQte9rOZg3LXL9hEBIjnFCH';
const FILE_KEY = 'pO348u50Wve0jUSKBpmMyi';
const NODE_ID = '271:4822';

async function fetchFigmaNode() {
  // depth를 더 깊게 탐색
  const url = `https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${encodeURIComponent(NODE_ID)}&depth=10`;
  
  const res = await fetch(url, {
    headers: { 'X-Figma-Token': TOKEN }
  });
  
  if (!res.ok) {
    console.error('Figma API error:', res.status, await res.text());
    return;
  }
  
  const data = await res.json();
  const node = data.nodes[NODE_ID];
  
  if (!node || !node.document) {
    console.error('Node not found');
    return;
  }
  
  // "메인" 또는 "Main" 프레임 찾기
  function findMainFrame(n) {
    const name = (n.name || '').toLowerCase();
    if (name.includes('메인') && !name.includes('mo') && !name.includes('모바일') && n.type === 'FRAME') {
      // 1920 너비인 데스크탑 메인 프레임
      const bbox = n.absoluteBoundingBox;
      if (bbox && bbox.width >= 1900) {
        return n;
      }
    }
    if (n.children) {
      for (const child of n.children) {
        const found = findMainFrame(child);
        if (found) return found;
      }
    }
    return null;
  }
  
  const mainFrame = findMainFrame(node.document);
  if (!mainFrame) {
    console.error('메인 프레임을 찾을 수 없습니다');
    // 최상위 프레임 목록 출력
    console.log('\n=== 최상위 프레임 목록 ===');
    if (node.document.children) {
      for (const child of node.document.children) {
        const bbox = child.absoluteBoundingBox;
        console.log(`[${child.type}] "${child.name}" | w:${bbox?.width} h:${bbox?.height}`);
      }
    }
    return;
  }
  
  console.log(`\n=== 메인 프레임 발견: "${mainFrame.name}" ===`);
  const mainBbox = mainFrame.absoluteBoundingBox;
  console.log(`전체 크기: w:${mainBbox.width} h:${mainBbox.height}\n`);
  
  // 메인 프레임 하위 모든 노드를 상세 출력 (깊이 제한 6 레벨)
  function printTree(n, depth = 0, maxDepth = 8) {
    if (depth > maxDepth) return;
    
    const indent = '  '.repeat(depth);
    const name = n.name || '(unnamed)';
    const type = n.type || '?';
    const bbox = n.absoluteBoundingBox;
    const bboxStr = bbox 
      ? `x:${Math.round(bbox.x)} y:${Math.round(bbox.y)} w:${Math.round(bbox.width)} h:${Math.round(bbox.height)}` 
      : 'no-bbox';
    
    // 상대 위치 계산 (메인 프레임 기준)
    let relStr = '';
    if (bbox && mainBbox) {
      const relX = Math.round(bbox.x - mainBbox.x);
      const relY = Math.round(bbox.y - mainBbox.y);
      relStr = ` | rel(${relX}, ${relY})`;
    }
    
    console.log(`${indent}[${type}] "${name}" | ${bboxStr}${relStr}`);
    
    // fills
    if (n.fills && n.fills.length > 0) {
      const fillInfo = n.fills.map(f => {
        if (f.type === 'SOLID' && f.visible !== false) return `SOLID(r:${Math.round(f.color.r*255)} g:${Math.round(f.color.g*255)} b:${Math.round(f.color.b*255)})`;
        if (f.type === 'IMAGE') return `IMAGE(ref:${f.imageRef}, scaleMode:${f.scaleMode})`;
        if (f.visible === false) return `${f.type}(hidden)`;
        return f.type;
      }).join(', ');
      if (fillInfo) console.log(`${indent}  fills: ${fillInfo}`);
    }
    
    // 추가 속성
    if (n.clipsContent) console.log(`${indent}  clipsContent: true`);
    if (n.cornerRadius) console.log(`${indent}  cornerRadius: ${n.cornerRadius}`);
    if (n.opacity !== undefined && n.opacity !== 1) console.log(`${indent}  opacity: ${n.opacity}`);
    
    if (n.children) {
      for (const child of n.children) {
        printTree(child, depth + 1, maxDepth);
      }
    }
  }
  
  printTree(mainFrame);
}

fetchFigmaNode().catch(console.error);
