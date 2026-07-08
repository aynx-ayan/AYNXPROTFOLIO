const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const validationCode = `
function validateMessage(req, res, next) {
  if (!req.body || typeof req.body !== 'object') return res.status(400).json({ success: false, message: 'Invalid payload' });
  const { name, email, message } = req.body;
  if (!name || typeof name !== 'string' || name.length > 100) return res.status(400).json({ success: false, message: 'Invalid name' });
  if (!email || typeof email !== 'string' || email.length > 150) return res.status(400).json({ success: false, message: 'Invalid email' });
  if (message && (typeof message !== 'string' || message.length > 5000)) return res.status(400).json({ success: false, message: 'Message too long' });
  next();
}

function validateReview(req, res, next) {
  if (!req.body || typeof req.body !== 'object') return res.status(400).json({ success: false, message: 'Invalid payload' });
  const { name, text, rating } = req.body;
  if (!name || typeof name !== 'string' || name.length > 100) return res.status(400).json({ success: false, message: 'Invalid name' });
  if (!text || typeof text !== 'string' || text.length > 2000) return res.status(400).json({ success: false, message: 'Text too long' });
  if (typeof rating !== 'number' || rating < 1 || rating > 5) return res.status(400).json({ success: false, message: 'Invalid rating' });
  next();
}
`;

code = code.replace("app.post('/api/reviews', rateLimiter, (req, res)", validationCode + "\napp.post('/api/reviews', rateLimiter, validateReview, (req, res)");
code = code.replace("app.post('/api/messages', rateLimiter, (req, res)", "app.post('/api/messages', rateLimiter, validateMessage, (req, res)");

fs.writeFileSync('server.ts', code);
console.log('Added validation middleware');
