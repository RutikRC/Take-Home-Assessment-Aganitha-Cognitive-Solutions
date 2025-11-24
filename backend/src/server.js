import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import linksRouter from './routes/links.js';
import { initializeDatabase, getLinksCollection } from './db/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/healthz', (req, res) => {
  res.status(200).json({ ok: true, version: '1.0' });
});

// Redirect route - must be before /api routes
app.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    
    // Skip if it's a reserved path
    if (code === 'api' || code === 'healthz' || code === 'code') {
      return res.status(404).json({ error: 'Not found' });
    }
    
    // Validate code format
    if (!/^[A-Za-z0-9]{6,8}$/.test(code)) {
      return res.status(404).json({ error: 'Not found' });
    }
    
    // Find link
    const linksCollection = getLinksCollection();
    const link = await linksCollection.findOne({ code });
    
    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }
    
    // Update click count and last clicked time
    await linksCollection.updateOne(
      { code },
      { 
        $inc: { total_clicks: 1 },
        $set: { last_clicked_at: new Date() }
      }
    );
    
    // Redirect (302)
    res.redirect(302, link.target_url);
  } catch (error) {
    console.error('Error redirecting:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API routes
app.use('/api/links', linksRouter);

// Initialize database and start server
async function startServer() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

