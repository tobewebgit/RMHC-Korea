import fs from 'fs';

const FIGMA_PERSONAL_ACCESS_TOKEN = 'figd_clXAeVN1_xkm42t83PQte9rOZg3LXL9hEBIjnFCH';
const FIGMA_FILE_KEY = 'pO348u50Wve0jUSKBpmMyi';
const FIGMA_NODE_ID = '2405:104448,2405:104500,2405:104545,2405:104580,2405:104461,2405:105864,2405:106041,2405:105929,2405:104457';

async function fetchFigmaNode() {
  const url = `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/nodes?ids=${FIGMA_NODE_ID}`;
  console.log(`Fetching Figma Node data from: ${url}`);
  
  try {
    const response = await fetch(url, {
      headers: {
        'X-Figma-Token': FIGMA_PERSONAL_ACCESS_TOKEN
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    fs.writeFileSync('scratch/figma_node_data.json', JSON.stringify(data, null, 2));
    console.log('Successfully saved Figma Node data to scratch/figma_node_data.json');
  } catch (error) {
    console.error('Failed to fetch Figma Node data:', error);
  }
}

fetchFigmaNode();
