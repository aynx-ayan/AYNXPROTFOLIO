const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const authCode = `
import crypto from 'crypto';

const SESSION_TOKEN = crypto.randomBytes(32).toString('hex');

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Missing token' });
  }
  const token = authHeader.split(' ')[1];
  if (token !== SESSION_TOKEN) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
  }
  next();
};

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}
`;

code = code.replace("import { GoogleGenAI, Type } from '@google/genai';", "import { GoogleGenAI, Type } from '@google/genai';\n" + authCode);

// update readDb to hash the default password
code = code.replace(
  "if (db.admin && (db.admin.username === 'admin' || db.admin.password === 'password123')) {",
  "if (db.admin && (db.admin.username === 'admin' || db.admin.password === 'password123' || db.admin.password === '@Artistayan321')) {"
);

code = code.replace(
  "db.admin.password = '@Artistayan321';",
  "db.admin.password = '787d451a22f3b47bc49e25caa3a487359b8c745bac4e75f2553d0a2f4997d063';"
);

// update login endpoint to hash the password before comparing
const loginBlock = `app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const db = readDb();
  if (username === db.admin.username && hashPassword(password) === db.admin.password) {
    res.json({ success: true, token: SESSION_TOKEN });
  } else {
    res.status(401).json({ success: false, message: 'Invalid administrative credentials.' });
  }
});`;

code = code.replace(/app\.post\('\/api\/auth\/login', \(req, res\) => \{[\s\S]*?\}\);/, loginBlock);

// update protected endpoints
const endpoints = [
  "app.put('/api/settings'",
  "app.post('/api/projects'",
  "app.put('/api/projects/:id'",
  "app.delete('/api/projects/:id'",
  "app.put('/api/reviews/:id'",
  "app.delete('/api/reviews/:id'",
  "app.get('/api/messages'",
  "app.put('/api/messages/:id'",
  "app.delete('/api/messages/:id'",
  "app.post('/api/analytics/reset'"
];

endpoints.forEach(ep => {
  code = code.replace(ep + ", (req, res)", ep + ", requireAuth, (req, res)");
});

fs.writeFileSync('server.ts', code);
console.log('Done Server!');
