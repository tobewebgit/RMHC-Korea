import fs from 'fs';

// 피그마 노드 데이터 읽기
const rawData = fs.readFileSync('scratch/figma_node_data.json', 'utf8');
const data = JSON.parse(rawData);

const nodes = data.nodes;

// 재귀적으로 TEXT 타입 노드를 추출하는 함수
function extractTextNodes(node, list = []) {
  if (node.type === 'TEXT' && node.characters) {
    list.push(node);
  }
  if (node.children) {
    for (const child of node.children) {
      extractTextNodes(child, list);
    }
  }
  return list;
}

// 노드 ID 리스트
const targetNodes = {
  privacy: '2405:104632',
  terms: '2405:105067',
  email: '2405:105259',
  gala_apply: '2531:43001',
  one_time: '2531:44497'
};

Object.entries(targetNodes).forEach(([key, nodeId]) => {
  const nodeData = nodes[nodeId];
  if (!nodeData) {
    console.error(`Node ${nodeId} not found in figma_node_data.json`);
    return;
  }

  // 1. 모든 텍스트 노드 추출
  const textNodes = extractTextNodes(nodeData.document);

  // 2. Y 좌표 우선, 동일 Y일 경우 X 좌표 우선 정렬
  textNodes.sort((a, b) => {
    const ay = a.absoluteBoundingBox?.y ?? 0;
    const by = b.absoluteBoundingBox?.y ?? 0;
    if (Math.abs(ay - by) > 5) {
      return ay - by;
    }
    const ax = a.absoluteBoundingBox?.x ?? 0;
    const bx = b.absoluteBoundingBox?.x ?? 0;
    return ax - bx;
  });

  // 3. HTML 마크업으로 변환
  let html = '';
  
  textNodes.forEach((t) => {
    const text = t.characters.trim().replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    if (!text) return;

    const style = t.style || {};
    const fontSize = style.fontSize;
    const fontWeight = style.fontWeight;
    const isHeading = (fontWeight >= 800 || fontSize >= 22);

    // 디버그용 스타일 로그 포함
    const fontInfo = `<!-- Font: ${style.fontFamily}, Size: ${fontSize}px, Weight: ${fontWeight}, LineHeight: ${style.lineHeightPx}px -->`;

    if (isHeading) {
      // 대제목/소제목 구분
      if (fontSize >= 24) {
        html += `\n${fontInfo}\n<h2 class="policy-title">${text}</h2>\n`;
      } else {
        html += `\n${fontInfo}\n<h3 class="policy-subtitle">${text}</h3>\n`;
      }
    } else {
      // 일반 본문
      const paragraphs = text.split('\n\n');
      paragraphs.forEach((p) => {
        const cleanP = p.trim().replace(/\n/g, '<br>');
        if (cleanP) {
          html += `${fontInfo}\n<p class="policy-text">${cleanP}</p>\n`;
        }
      });
    }
  });

  // 4. 추출된 마크업 파일로 저장
  fs.writeFileSync(`scratch/extracted_${key}.html`, html.trim());
  console.log(`Successfully extracted and saved scratch/extracted_${key}.html (${textNodes.length} nodes processed)`);
});
