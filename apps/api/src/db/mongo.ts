import { MongoClient } from 'mongodb';
import { env } from '../constants/envs.js';

const client = new MongoClient(env.MONGODB_URI, {
  connectTimeoutMS: 10_000,
  serverSelectionTimeoutMS: 10_000,
});

export { client };

export const db = client.db();

export async function connect(): Promise<void> {
  await client.connect();
}
