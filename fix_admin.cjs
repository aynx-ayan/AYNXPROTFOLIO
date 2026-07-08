const fs = require('fs');
let code = fs.readFileSync('src/components/AdminSection.tsx', 'utf8');

code = code.replace(/fetch\(`\/api\/\$\{([^}]+)\}`, \{ method: 'DELETE' \}/g, "fetch(`/api/${$1}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${sessionStorage.getItem('ayn_session')}` } }");
code = code.replace(/fetch\('\/api\/analytics\/reset', \{ method: 'POST' \}/g, "fetch('/api/analytics/reset', { method: 'POST', headers: { 'Authorization': `Bearer ${sessionStorage.getItem('ayn_session')}` } }");

code = code.replace(/headers: \{ 'Content-Type': 'application\/json' \}/g, "headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('ayn_session')}` }");

// Undo login
code = code.replace(
  "fetch('/api/auth/login', {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('ayn_session')}` }",
  "fetch('/api/auth/login', {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json' }"
);

fs.writeFileSync('src/components/AdminSection.tsx', code);
console.log('Done!');
