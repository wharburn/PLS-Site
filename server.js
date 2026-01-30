import express from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Use /mnt/data/uploads on Render, ./uploads locally
const STORAGE_PATH =
  process.env.NODE_ENV === 'production' ? '/mnt/data/uploads' : path.join(__dirname, 'uploads');

// Ensure storage directories exist
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

ensureDir(STORAGE_PATH);

// Setup multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      // Get clientId from query or use 'default'
      const clientId = req.query.clientId || req.body.clientId || 'default';
      const clientDir = path.join(STORAGE_PATH, clientId);
      ensureDir(clientDir);
      cb(null, clientDir);
    },
    filename: (req, file, cb) => {
      // Use original filename with timestamp
      const filename = `${Date.now()}_${file.originalname}`;
      cb(null, filename);
    },
  }),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});

// Middleware
app.use(express.json());

// API Routes (MUST be before static file serving)

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    storage: STORAGE_PATH,
    nodeEnv: process.env.NODE_ENV,
    storageExists: fs.existsSync(STORAGE_PATH),
  });
});

// Upload file
app.post(
  '/api/upload',
  upload.fields([{ name: 'file' }, { name: 'clientId' }, { name: 'filename' }]),
  (req, res) => {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.files.file[0];
    const clientId = req.body.clientId || 'default';
    const filename = req.body.filename || file.originalname;

    const url = `/uploads/${clientId}/${filename}`;
    res.json({
      success: true,
      url: url,
      filename: filename,
    });
  }
);

// List files for client
app.get('/api/files', (req, res) => {
  try {
    const clientId = req.query.clientId;
    const clientDir = path.join(STORAGE_PATH, clientId);

    if (!fs.existsSync(clientDir)) {
      return res.json([]);
    }

    const files = fs.readdirSync(clientDir).map((filename) => ({
      name: filename,
      url: `/uploads/${clientId}/${filename}`,
      size: fs.statSync(path.join(clientDir, filename)).size,
    }));

    res.json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete file
app.post('/api/delete', (req, res) => {
  try {
    const filepath = path.join(STORAGE_PATH, req.body.filepath);

    // Security check - ensure path is within STORAGE_PATH
    if (!filepath.startsWith(STORAGE_PATH)) {
      return res.status(403).json({ error: 'Invalid path' });
    }

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Static file serving (MUST be after API routes)
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/uploads', express.static(STORAGE_PATH)); // Serve uploaded files

// SPA routing - fallback to index.html (MUST be last)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Storage: ${STORAGE_PATH}`);
});
