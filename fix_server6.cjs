const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  "password: '@Artistayan321'",
  "password: '787d451a22f3b47bc49e25caa3a487359b8c745bac4e75f2553d0a2f4997d063'"
);

fs.writeFileSync('server.ts', code);
console.log('Fixed DEFAULT_DB password');
