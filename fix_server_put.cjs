const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// fix PUT projects
code = code.replace(
  "db.projects[idx] = { ...db.projects[idx], ...req.body };",
  "db.projects[idx] = { ...db.projects[idx], ...req.body, id: db.projects[idx].id };"
);

// fix PUT reviews
code = code.replace(
  "db.reviews[idx] = { ...db.reviews[idx], ...req.body };",
  "db.reviews[idx] = { ...db.reviews[idx], ...req.body, id: db.reviews[idx].id };"
);

// fix PUT messages
code = code.replace(
  "db.messages[idx] = { ...db.messages[idx], ...req.body };",
  "db.messages[idx] = { ...db.messages[idx], ...req.body, id: db.messages[idx].id };"
);

// fix PUT settings
// Wait, settings doesn't have an ID.
// db.settings = { ...db.settings, ...req.body };
// This is fine as long as there is no prototype pollution. Object spread ignores prototype anyway, but to be safe against overwriting __proto__ if JS engine respects it.
// Actually, spread operator in object literals doesn't trigger prototype pollution for __proto__.
// `{...a, ...b}` just creates an object with a string key "__proto__", it doesn't modify the prototype.

fs.writeFileSync('server.ts', code);
console.log('Fixed PUT ID overrides');
