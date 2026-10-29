import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// In-memory initial data for backend API syncing
let serverData = {
  activeSession: 'active',
  lastServerSync: new Date().toISOString(),
};

// Healthcheck
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    platform: 'CampusOS PSG Tech Core',
    timestamp: new Date().toISOString(),
    isProduction: isProd,
  });
});

// Sync endpoint: allows clients to query or backup
app.get('/api/status', (_req: Request, res: Response) => {
  res.json({
    college: 'PSG College of Technology, Coimbatore',
    department: 'Instrumentation and Control Engineering',
    class: 'ICE Semester 1 (Batch: 60)',
    serverTime: new Date().toISOString(),
    ...serverData,
  });
});

// WhatsApp webhook endpoint for broadcast ingestion
app.post('/api/webhook/whatsapp', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    parsed: true,
    message: 'WhatsApp notification parsed and structured for CampusOS dispatches',
    receivedAt: new Date().toISOString(),
  });
});

// Vite Middleware Setup
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CampusOS server operational at http://0.0.0.0:${PORT} [${isProd ? 'PROD' : 'DEV'}]`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start CampusOS server:', err);
  process.exit(1);
});
