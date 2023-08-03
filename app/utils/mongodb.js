import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URL;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const DB_NAME = 'airline-game';

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

export { connectToDatabase, client, DB_NAME };
