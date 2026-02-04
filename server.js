import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';

// Load .env (minimal parser, avoids extra deps)
try {
  const envPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '.env');
  if (fs.existsSync(envPath)) {
    const txt = fs.readFileSync(envPath, 'utf8');
    for (const line of txt.split(/\r?\n/)) {
      const l = line.trim();
      if (!l || l.startsWith('#')) continue;
      const i = l.indexOf('=');
      if (i === -1) continue;
      const k = l.slice(0, i).trim();
      const v = l.slice(i + 1).trim();
      if (!process.env[k]) process.env[k] = v;
    }
  }
} catch (e) {
  console.error('Failed to load .env', e);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT || 3001);

// Serve the built frontend (same-origin) when dist exists
const DIST_DIR = path.join(__dirname, 'dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
}

// Allow basic CORS (kept for compatibility)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Setup permanent storage path
const UPLOAD_BASE = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_BASE)) fs.mkdirSync(UPLOAD_BASE, { recursive: true });

// Auth: verify Supabase JWT on upload requests
// We verify the access token locally via Supabase JWKS (avoids GoTrue DB dependency).
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://ivrnnzubplghzizefmjw.supabase.co';

let _jwks = null;
let _jwksFetchedAt = 0;
const JWKS_TTL_MS = 15 * 60 * 1000;

async function getJwks() {
  const now = Date.now();
  if (_jwks && (now - _jwksFetchedAt) < JWKS_TTL_MS) return _jwks;

  const r = await fetch(`${SUPABASE_URL}/auth/v1/.well-known/jwks.json`);
  if (!r.ok) throw new Error(`Failed to fetch JWKS (${r.status})`);
  _jwks = await r.json();
  _jwksFetchedAt = now;
  return _jwks;
}

const requireSupabaseAuth = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length) : null;
    if (!token) return res.status(401).json({ error: 'Missing Authorization Bearer token' });

    const { jwtVerify, createRemoteJWKSet } = await import('jose');

    // Use Remote JWK Set with caching handled by jose
    const jwksUrl = new URL(`${SUPABASE_URL}/auth/v1/.well-known/jwks.json`);
    const JWKS = createRemoteJWKSet(jwksUrl);

    // Supabase access tokens typically have issuer = `${SUPABASE_URL}/auth/v1`
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `${SUPABASE_URL}/auth/v1`,
      // audience varies; don't enforce it for now
    });

    const userId = payload.sub;
    if (!userId) return res.status(401).json({ error: 'Invalid token (missing sub)' });

    req.user = {
      id: userId,
      email: payload.email || null,
      role: payload.role || null,
      jwt: payload,
    };

    next();
  } catch (e) {
    console.error('Auth check failed:', e?.message || e);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Configure Multer for disk storage (per-user folders)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.user?.id || 'anonymous';
    const category = (req.body.category || 'OTHER').toString();
    const catPath = path.join(UPLOAD_BASE, userId, category);
    if (!fs.existsSync(catPath)) fs.mkdirSync(catPath, { recursive: true });
    cb(null, catPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

const upload = multer({ storage });

app.use(express.json());

// ---------------------------------------------------------------------------
// Admin selection storage (cross-browser)
// NOTE: Admin area currently has no real authentication. This is a simple server-side
// store so selections persist across browsers/devices.
// ---------------------------------------------------------------------------
const ADMIN_SELECTION_PATH = path.join(__dirname, 'admin-selected-clients.json');

function readAdminSelection() {
  try {
    if (!fs.existsSync(ADMIN_SELECTION_PATH)) return [];
    const raw = fs.readFileSync(ADMIN_SELECTION_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
    if (Array.isArray(parsed?.clientIds)) return parsed.clientIds.filter(Boolean);
    return [];
  } catch {
    return [];
  }
}

function writeAdminSelection(clientIds) {
  const safe = Array.isArray(clientIds) ? clientIds.map(String).filter(Boolean) : [];
  fs.writeFileSync(ADMIN_SELECTION_PATH, JSON.stringify({ clientIds: safe, updatedAt: new Date().toISOString() }, null, 2));
  return safe;
}

app.get('/api/admin/selected-clients', (req, res) => {
  return res.json({ clientIds: readAdminSelection() });
});

app.post('/api/admin/selected-clients', (req, res) => {
  try {
    const clientIds = req.body?.clientIds;
    const saved = writeAdminSelection(clientIds);
    return res.json({ ok: true, clientIds: saved });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: 'Failed to save selection' });
  }
});

// ---------------------------------------------------------------------------
// Admin AI Assistant input logging (for debugging / visibility)
// Writes to a local file so the ops assistant can read what was typed.
// ---------------------------------------------------------------------------
const ADMIN_HELPCHAT_LOG = path.join(__dirname, 'admin-helpchat.log.jsonl');
const ADMIN_HELPCHAT_OUTBOX = path.join(__dirname, 'admin-helpchat.outbox.jsonl');

app.post('/api/admin/helpchat-log', (req, res) => {
  try {
    const message = String(req.body?.message || '').trim();
    if (!message) return res.status(400).json({ ok: false, error: 'Missing message' });

    const line = JSON.stringify({ ts: new Date().toISOString(), message }) + '\n';
    fs.appendFileSync(ADMIN_HELPCHAT_LOG, line, 'utf8');

    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: 'Failed to write log' });
  }
});

// Read assistant outbox (cross-browser)
app.get('/api/admin/helpchat-outbox', (req, res) => {
  try {
    const since = (req.query.since || '').toString();
    if (!fs.existsSync(ADMIN_HELPCHAT_OUTBOX)) return res.json({ messages: [] });

    const lines = fs.readFileSync(ADMIN_HELPCHAT_OUTBOX, 'utf8').split(/\r?\n/).filter(Boolean);
    const parsed = lines
      .map((l) => {
        try { return JSON.parse(l); } catch { return null; }
      })
      .filter(Boolean);

    const out = since ? parsed.filter((m) => String(m.ts) > since) : parsed.slice(-20);
    return res.json({ messages: out });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ messages: [], error: 'Failed to read outbox' });
  }
});

// Append assistant message to outbox (no auth; intended for short-term internal use)
app.post('/api/admin/helpchat-outbox', (req, res) => {
  try {
    const message = String(req.body?.message || '').trim();
    if (!message) return res.status(400).json({ ok: false, error: 'Missing message' });

    const line = JSON.stringify({ ts: new Date().toISOString(), message }) + '\n';
    fs.appendFileSync(ADMIN_HELPCHAT_OUTBOX, line, 'utf8');

    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: 'Failed to write outbox' });
  }
});

// Serve uploaded files (temporary)
app.use('/uploads', express.static(UPLOAD_BASE));

// List files (temporary, no auth)
app.get('/api/uploads', (req, res) => {
  const category = (req.query.category || '').toString();
  const base = category ? path.join(UPLOAD_BASE, category) : UPLOAD_BASE;

  if (!fs.existsSync(base)) return res.json({ files: [] });

  const walk = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const out = [];
    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) out.push(...walk(full));
      else out.push(full);
    }
    return out;
  };

  const files = walk(base).map((fullPath) => {
    const rel = path.relative(UPLOAD_BASE, fullPath).split(path.sep).join('/');
    return {
      name: path.basename(fullPath),
      relativePath: rel,
      url: `/uploads/${rel}`,
    };
  });

  res.json({ files });
});

// Main upload endpoint (requires Supabase login)
app.post('/api/upload-to-disk', requireSupabaseAuth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  console.log(`📁 File Saved: ${req.file.path}`);

  const rel = path.relative(UPLOAD_BASE, req.file.path).split(path.sep).join('/');

  // If PDF, generate a thumbnail image (page 1) next to the PDF.
  // Output path: <original>.thumb.png
  let thumbRel = null;
  try {
    const originalLower = (req.file.originalname || '').toLowerCase();
    const mimeLower = (req.file.mimetype || '').toLowerCase();
    const isPdf = mimeLower.includes('pdf') || originalLower.endsWith('.pdf') || (req.file.filename || '').toLowerCase().endsWith('.pdf');

    if (isPdf) {
      const inputPath = req.file.path;
      const outPrefix = `${inputPath}.thumb`;
      // pdftoppm will create: <outPrefix>.png when -singlefile -png
      execFileSync('pdftoppm', ['-f', '1', '-l', '1', '-png', '-singlefile', inputPath, outPrefix], { stdio: 'ignore' });

      const thumbPath = `${outPrefix}.png`;
      if (fs.existsSync(thumbPath)) {
        thumbRel = path.relative(UPLOAD_BASE, thumbPath).split(path.sep).join('/');
        console.log(`🖼️ PDF Thumbnail: ${thumbPath}`);
      }
    }
  } catch (e) {
    // Do not fail the upload if thumbnail generation fails
    console.warn('PDF thumbnail generation failed:', e?.message || e);
  }

  res.json({
    success: true,
    originalName: req.file.originalname,
    storedName: path.basename(req.file.path),
    relativePath: rel,
    url: `/uploads/${rel}`,
    thumbnailUrl: thumbRel ? `/uploads/${thumbRel}` : null,
    category: req.body.category || 'OTHER'
  });
});

// Delete a previously uploaded file (requires Supabase login)
// Safety: only allows deleting files under uploads/<userId>/...
app.delete('/api/delete-upload', requireSupabaseAuth, (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Not logged in' });

    const relativePath = (req.body?.relativePath || '').toString().replace(/^\/+/, '');
    if (!relativePath) return res.status(400).json({ error: 'Missing relativePath' });

    const normalized = relativePath.split('..').join('');
    if (!normalized.startsWith(`${userId}/`)) {
      return res.status(403).json({ error: 'Forbidden: can only delete your own files' });
    }

    const fullPath = path.join(UPLOAD_BASE, normalized);
    if (!fullPath.startsWith(UPLOAD_BASE)) {
      return res.status(400).json({ error: 'Invalid path' });
    }

    if (!fs.existsSync(fullPath)) {
      return res.json({ success: true, deleted: false, message: 'File not found (already deleted?)' });
    }

    fs.unlinkSync(fullPath);

    // Best-effort: delete thumbnail for PDFs (if present)
    const thumbPath = `${fullPath}.thumb.png`;
    if (fs.existsSync(thumbPath)) {
      try { fs.unlinkSync(thumbPath); } catch { /* ignore */ }
    }

    return res.json({ success: true, deleted: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Delete failed' });
  }
});

// SPA fallback (so /client/documents works when served from this app)
app.get(/.*/, (req, res) => {
  if (fs.existsSync(DIST_DIR)) {
    return res.sendFile(path.join(DIST_DIR, 'index.html'));
  }
  return res.status(404).send('Not Found');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 PLS web+uploads server active on port ${PORT}`);
  console.log(`📂 Storage directory: ${UPLOAD_BASE}`);
  console.log(`🧩 Dist: ${fs.existsSync(DIST_DIR) ? DIST_DIR : '(missing)'}`);
});
