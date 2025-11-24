import express from 'express';
import pool from '../db/index.js';
import { validateCreateLink, validateCode, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// Generate random code
function generateCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Generate unique code
async function generateUniqueCode() {
  let code;
  let exists = true;
  let attempts = 0;
  
  while (exists && attempts < 10) {
    const length = Math.floor(Math.random() * 3) + 6; // 6-8 characters
    code = generateCode(length);
    const result = await pool.query('SELECT id FROM links WHERE code = $1', [code]);
    exists = result.rows.length > 0;
    attempts++;
  }
  
  if (exists) {
    throw new Error('Failed to generate unique code');
  }
  
  return code;
}

// POST /api/links - Create link
router.post('/', validateCreateLink, handleValidationErrors, async (req, res) => {
  try {
    const { target_url, code: customCode } = req.body;
    
    let code = customCode;
    
    // Generate code if not provided
    if (!code) {
      code = await generateUniqueCode();
    } else {
      // Check if code already exists
      const existing = await pool.query('SELECT id FROM links WHERE code = $1', [code]);
      if (existing.rows.length > 0) {
        return res.status(409).json({ error: 'Code already exists' });
      }
    }
    
    // Insert new link
    const result = await pool.query(
      'INSERT INTO links (code, target_url) VALUES ($1, $2) RETURNING *',
      [code, target_url]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating link:', error);
    if (error.code === '23505') { // Unique constraint violation
      return res.status(409).json({ error: 'Code already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/links - List all links
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT code, target_url, total_clicks, last_clicked_at, created_at FROM links ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching links:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/links/:code - Get stats for one code
router.get('/:code', validateCode, handleValidationErrors, async (req, res) => {
  try {
    const { code } = req.params;
    const result = await pool.query(
      'SELECT code, target_url, total_clicks, last_clicked_at, created_at FROM links WHERE code = $1',
      [code]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Link not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching link:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/links/:code - Delete link
router.delete('/:code', validateCode, handleValidationErrors, async (req, res) => {
  try {
    const { code } = req.params;
    const result = await pool.query('DELETE FROM links WHERE code = $1 RETURNING *', [code]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Link not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting link:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
