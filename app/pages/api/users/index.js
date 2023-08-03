import { connectToDatabase, client, DB_NAME } from '../../../utils/mongodb';

// GET /api/user/{id}
export default async function handler(req, res) {

  // Connect to the database
  await connectToDatabase();

  // Access a collection and perform operations
  const collection = client.db(DB_NAME).collection('users');
  
  // Query data from MongoDB
  const data = await collection.find({}).toArray();

  // Close the database connection
  client.close();

  // Return the data as JSON response
  res.status(200).json(data);
}
