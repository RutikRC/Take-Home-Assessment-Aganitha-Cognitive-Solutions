import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const client = new MongoClient(process.env.DATABASE_URL);

let db;
let linksCollection;

// Connect to MongoDB
export async function connectDatabase() {
  try {
    await client.connect();
    db = client.db('tinylink');
    linksCollection = db.collection('links');
    
    // Create unique index on code field
    await linksCollection.createIndex({ code: 1 }, { unique: true });
    
    console.log('Connected to MongoDB database');
    return { db, linksCollection };
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

// Initialize database (for compatibility with existing code)
export async function initializeDatabase() {
  try {
    await connectDatabase();
    console.log('Database initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Get links collection
export function getLinksCollection() {
  if (!linksCollection) {
    throw new Error('Database not connected. Call connectDatabase() first.');
  }
  return linksCollection;
}

// Close database connection
export async function closeDatabase() {
  try {
    await client.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
}

export default { connectDatabase, getLinksCollection, closeDatabase };
