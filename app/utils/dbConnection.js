import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URL;
const DB_NAME = 'airline-game';

class Database {
  constructor() {
    this.client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  }

  async connect() {
    try {
      await this.client.connect();
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  }

  get db() {
    return this.client.db(DB_NAME);
  }
}

const database = new Database();

export default database;
