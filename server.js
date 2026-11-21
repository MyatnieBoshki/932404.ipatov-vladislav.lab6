const express = require('express');
const path = require('path');
const { calculate } = require('./public/js/calc');

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

app.use(express.static(PUBLIC_DIR, { index: false }));

app.get('/', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'index.html')));
app.get('/about', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'about.html')));

app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

function sendCalc(res, a, b, op) {
  const { status, body } = calculate(a, b, op);
  res.status(status).json(body);
}

app.get('/api/calc', (req, res) => {
  const { a, b, op } = req.query;
  sendCalc(res, a, b, op);
});

app.get('/api/calc/:op', (req, res) => {
  sendCalc(res, req.query.a, req.query.b, req.params.op);
});

app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.status(404).send('<h1>404</h1><p>Страница не найдена. <a href="/">На главную</a></p>');
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const server = app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Порт ${PORT} занят. Запустите с другим: PORT=3001 npm start`);
  } else {
    console.error(err);
  }
  process.exit(1);
});
