const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// fix POST /api/projects
code = code.replace(
  "id: Date.now().toString(),\n    ...req.body",
  "...req.body,\n    id: Date.now().toString()"
);

// fix POST /api/reviews
code = code.replace(
  "id: Date.now().toString(),\n    approved: false, // Must be approved by admin\n    featured: false,\n    date: new Date().toISOString(),\n    ...req.body",
  "...req.body,\n    id: Date.now().toString(),\n    approved: false,\n    featured: false,\n    date: new Date().toISOString()"
);

// fix POST /api/messages
code = code.replace(
  "id: Date.now().toString(),\n    date: new Date().toISOString(),\n    status: 'unread',\n    ...req.body",
  "...req.body,\n    id: Date.now().toString(),\n    date: new Date().toISOString(),\n    status: 'unread'"
);

fs.writeFileSync('server.ts', code);
console.log('Done Server Fix 3!');
