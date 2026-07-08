const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const rateLimitCode = `
const rateLimitCache = new Map();
function rateLimiter(req, res, next) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const now = Date.now();
  if (rateLimitCache.has(ip)) {
    const data = rateLimitCache.get(ip);
    // 5 requests per 10 minutes
    if (now - data.firstReq < 10 * 60 * 1000) {
      if (data.count >= 5) {
        return res.status(429).json({ success: false, message: 'Too many requests. Please try again later.' });
      }
      data.count++;
    } else {
      rateLimitCache.set(ip, { firstReq: now, count: 1 });
    }
  } else {
    rateLimitCache.set(ip, { firstReq: now, count: 1 });
  }
  next();
}
`;

code = code.replace("const DEFAULT_DB = {", rateLimitCode + "\nconst DEFAULT_DB = {");

code = code.replace("app.post('/api/reviews', (req, res)", "app.post('/api/reviews', rateLimiter, (req, res)");
code = code.replace("app.post('/api/messages', (req, res)", "app.post('/api/messages', rateLimiter, (req, res)");
code = code.replace("app.post('/api/auth/login', (req, res)", "app.post('/api/auth/login', rateLimiter, (req, res)");

fs.writeFileSync('server.ts', code);
console.log('Added Rate Limiting!');
