const fs = require('fs');
const file = 'd:/rmhc/front_0624/src/css/campaign.css';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/(.+;)\s*\/\*.*?\*\/\s*$/gm, '$1');
fs.writeFileSync(file, content, 'utf8');
