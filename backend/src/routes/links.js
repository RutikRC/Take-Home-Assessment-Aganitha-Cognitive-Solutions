import express from 'express';
import { getLinksCollection } from '../db/index.js';
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
  const linksCollection = getLinksCollection();
  let code;
  let exists = true;
  let attempts = 0;
  
  while (exists && attempts < 10) {
    const length = Math.floor(Math.random() * 3) + 6; // 6-8 characters
    code = generateCode(length);
    const existing = await linksCollection.findOne({ code });
    exists = existing !== null;
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
    const linksCollection = getLinksCollection();
    const { target_url, code: customCode } = req.body;
    
    let code = customCode;
    
    // Generate code if not provided
    if (!code) {
      code = await generateUniqueCode();
    } else {
      // Check if code already exists
      const existing = await linksCollection.findOne({ code });
      if (existing) {
        return res.status(409).json({ error: 'Code already exists' });
      }
    }
    
    // Insert new link
    const newLink = {
      code,
      target_url,
      total_clicks: 0,
      last_clicked_at: null,
      created_at: new Date()
    };
    
    const result = await linksCollection.insertOne(newLink);
    const link = await linksCollection.findOne({ _id: result.insertedId });
    
    // Remove MongoDB _id and return clean object
    const { _id, ...linkData } = link;
    res.status(201).json(linkData);
  } catch (error) {
    console.error('Error creating link:', error);
    if (error.code === 11000) { // MongoDB duplicate key error
      return res.status(409).json({ error: 'Code already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/links - List all links
router.get('/', async (req, res) => {
  try {
    const linksCollection = getLinksCollection();
    const links = await linksCollection
      .find({})
      .sort({ created_at: -1 })
      .toArray();
    
    // Remove MongoDB _id from each link
    const cleanLinks = links.map(({ _id, ...link }) => link);
    res.json(cleanLinks);
  } catch (error) {
    console.error('Error fetching links:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/links/:code - Get stats for one code
router.get('/:code', validateCode, handleValidationErrors, async (req, res) => {
  try {
    const linksCollection = getLinksCollection();
    const { code } = req.params;
    const link = await linksCollection.findOne({ code });
    
    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }
    
    // Remove MongoDB _id
    const { _id, ...linkData } = link;
    res.json(linkData);
  } catch (error) {
    console.error('Error fetching link:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/links/:code - Delete link
router.delete('/:code', validateCode, handleValidationErrors, async (req, res) => {
  try {
    const linksCollection = getLinksCollection();
    const { code } = req.params;
    const result = await linksCollection.deleteOne({ code });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Link not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting link:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
