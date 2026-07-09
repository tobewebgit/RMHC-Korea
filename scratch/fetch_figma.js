import fs from 'fs';

const FIGMA_PERSONAL_ACCESS_TOKEN = 'figd_clXAeVN1_xkm42t83PQte9rOZg3LXL9hEBIjnFCH';
const FIGMA_FILE_KEY = 'pO348u50Wve0jUSKBpmMyi';

// 메인 페이지 최상위 노드 (2531-56502) — depth=5로 섹션 1~4 하위 레이어까지 전부 수집
const FIGMA_NODE_IDS = '2531:56502';
const DEPTH = 5;

async function fetchFigmaNode() {
  const url = `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/nodes?ids=${FIGMA_NODE_IDS}&depth=${DEPTH}`;
  console.log(`\n📡 Fetching: ${url}\n`);

  try {
    const response = await fetch(url, {
      headers: { 'X-Figma-Token': FIGMA_PERSONAL_ACCESS_TOKEN }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const outPath = 'scratch/figma_main_sections.json';
    fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
    console.log(`✅ 저장 완료 → ${outPath}`);

    // 섹션 목록 콘솔 미리보기
    const root = data.nodes?.[Object.keys(data.nodes)[0]]?.document;
    if (root) {
      console.log(`\n📋 최상위 노드: "${root.name}" [${root.id}]`);
      console.log('── 자식 섹션 목록 ──');
      (root.children ?? []).forEach((child, i) => {
        console.log(`  ${i + 1}. [${child.id}] "${child.name}"  type:${child.type}`);
        // 섹션 바로 아래 첫 2단계도 미리보기
        (child.children ?? []).slice(0, 3).forEach(gc => {
          console.log(`       └─ [${gc.id}] "${gc.name}"  fills:${JSON.stringify(gc.fills ?? []).slice(0,80)}`);
        });
      });
    }
  } catch (error) {
    console.error('❌ 오류:', error);
  }
}

fetchFigmaNode();
