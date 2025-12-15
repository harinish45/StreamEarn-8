import { MongoClient } from 'mongodb';

let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('Please add your Mongo URI to .env.local');
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db('streamEarn');

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
