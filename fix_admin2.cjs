const fs = require('fs');
let code = fs.readFileSync('src/components/AdminSection.tsx', 'utf8');

code = code.replace(/fetch\(`\/api\/projects\/\$\{([^}]+)\}`, \{ method: 'DELETE' \}/g, "fetch(`/api/projects/${$1}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${sessionStorage.getItem('ayn_session')}` } }");
code = code.replace(/fetch\(`\/api\/reviews\/\$\{([^}]+)\}`, \{ method: 'DELETE' \}/g, "fetch(`/api/reviews/${$1}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${sessionStorage.getItem('ayn_session')}` } }");
code = code.replace(/fetch\(`\/api\/messages\/\$\{([^}]+)\}`, \{ method: 'DELETE' \}/g, "fetch(`/api/messages/${$1}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${sessionStorage.getItem('ayn_session')}` } }");

fs.writeFileSync('src/components/AdminSection.tsx', code);
console.log('Done!');
