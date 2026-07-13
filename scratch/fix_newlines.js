const fs = require('fs');
const path = require('path');
const fileP = path.join(__dirname, '../src/data/nse-stocks.ts');
let content = fs.readFileSync(fileP, 'utf8');
content = content.replace(/\\n/g, '\n');
fs.writeFileSync(fileP, content, 'utf8');
console.log('Fixed newlines');
