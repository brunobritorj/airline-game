import { ObjectId } from 'mongodb';
import { connectToDatabase, client, DB_NAME } from '../../../utils/mongodb';

// GET /api/user/{id}
export async function apiUserById(req, res) {
  try {
    
    await connectToDatabase();
    const collection = client.db(DB_NAME).collection('users');
    const userId = req.query.id;

    try {
      const user = await collection.findOne({ _id: new ObjectId(userId) });

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      client.close();

      res.status(200).json(user);
    } catch (error) {
      // Handle error if ObjectId conversion fails
      console.error('Error converting ObjectId:', error);
      res.status(400).json({ error: 'Invalid user ID' });
    }
  } catch (error) {
    console.error('API route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
