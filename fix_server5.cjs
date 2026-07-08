const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  "app.post('/api/ai/architect', async (req, res)",
  "app.post('/api/ai/architect', rateLimiter, async (req, res)"
);

fs.writeFileSync('server.ts', code);
console.log('Added rate limiting to AI architect endpoint');
