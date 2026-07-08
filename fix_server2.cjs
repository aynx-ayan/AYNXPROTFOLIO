const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const broken = `app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const db = readDb();
  if (username === db.admin.username && hashPassword(password) === db.admin.password) {
    res.json({ success: true, token: SESSION_TOKEN });
  } else {
    res.status(401).json({ success: false, message: 'Invalid administrative credentials.' });
  }
});
  } else {
    res.status(401).json({ success: false, message: 'Invalid administrative credentials.' });
  }
});`;

const fixed = `app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const db = readDb();
  if (username === db.admin.username && hashPassword(password) === db.admin.password) {
    res.json({ success: true, token: SESSION_TOKEN });
  } else {
    res.status(401).json({ success: false, message: 'Invalid administrative credentials.' });
  }
});`;

code = code.replace(broken, fixed);
fs.writeFileSync('server.ts', code);
console.log('Done!');
