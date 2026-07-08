const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace("const msgRes = await fetch('/api/messages');", "const msgRes = await fetch('/api/messages', { headers: { 'Authorization': `Bearer ${token}` } });");
fs.writeFileSync('src/App.tsx', code);
console.log('Done App!');
