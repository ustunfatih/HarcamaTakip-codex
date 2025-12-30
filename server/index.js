import http from 'node:http';
import crypto from 'node:crypto';
import express from 'express';

const app = express();
const PORT = Number(process.env.PORT || 5174);
const HOST = process.env.SERVER_HOST || '127.0.0.1';
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const SESSION_COOKIE = 'ht_session';
const TOKEN_ENC_KEY = process.env.TOKEN_ENC_KEY || '';

if (!TOKEN_ENC_KEY) {
  console.warn('Missing TOKEN_ENC_KEY. Set it in your server environment for encryption.');
}

app.use(express.json({ limit: '10kb' }));

// Minimal CORS with credentials for local dev
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', CLIENT_ORIGIN);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  return next();
});

const tokenStore = new Map();

const getSessionId = (req) => {
  const cookieHeader = req.headers.cookie || '';
  const cookies = Object.fromEntries(
    cookieHeader
      .split(';')
      .map((c) => c.trim())
      .filter(Boolean)
      .map((c) => c.split('='))
  );
  return cookies[SESSION_COOKIE] || null;
};

const ensureSession = (req, res) => {
  let sessionId = getSessionId(req);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    const isSecure = process.env.NODE_ENV === 'production';
    res.setHeader(
      'Set-Cookie',
      `${SESSION_COOKIE}=${sessionId}; Path=/; HttpOnly; SameSite=Strict${isSecure ? '; Secure' : ''}`
    );
  }
  return sessionId;
};

const deriveKey = () => crypto.createHash('sha256').update(TOKEN_ENC_KEY).digest();

const encryptToken = (token) => {
  const iv = crypto.randomBytes(12);
  const key = deriveKey();
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(token, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('base64')}:${tag.toString('base64')}:${encrypted.toString('base64')}`;
};

const decryptToken = (payload) => {
  const [ivB64, tagB64, dataB64] = payload.split(':');
  if (!ivB64 || !tagB64 || !dataB64) return null;
  const iv = Buffer.from(ivB64, 'base64');
  const tag = Buffer.from(tagB64, 'base64');
  const data = Buffer.from(dataB64, 'base64');
  const key = deriveKey();
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
  return decrypted.toString('utf8');
};

app.get('/auth/status', (req, res) => {
  const sessionId = getSessionId(req);
  const hasToken = sessionId ? tokenStore.has(sessionId) : false;
  res.json({ hasToken });
});

app.post('/auth/ynab', (req, res) => {
  const { token } = req.body || {};
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Token required.' });
  }
  const sessionId = ensureSession(req, res);
  tokenStore.set(sessionId, encryptToken(token.trim()));
  return res.json({ ok: true });
});

app.post('/auth/logout', (req, res) => {
  const sessionId = getSessionId(req);
  if (sessionId) tokenStore.delete(sessionId);
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict`);
  return res.json({ ok: true });
});

app.get('/ynab/*', async (req, res) => {
  const sessionId = getSessionId(req);
  const encrypted = sessionId ? tokenStore.get(sessionId) : null;
  if (!encrypted) return res.status(401).json({ error: 'Not authenticated.' });
  const token = decryptToken(encrypted);
  if (!token) return res.status(401).json({ error: 'Invalid token.' });

  const upstreamPath = req.originalUrl.replace('/ynab', '');
  const url = `https://api.ynab.com/v1${upstreamPath}`;

  try {
    const upstream = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const text = await upstream.text();
    res.status(upstream.status);
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
    return res.send(text);
  } catch (err) {
    return res.status(502).json({ error: 'Upstream request failed.' });
  }
});

const server = http.createServer(app);
server.listen(PORT, HOST, () => {
  console.log(`YNAB token server listening on http://${HOST}:${PORT}`);
});
