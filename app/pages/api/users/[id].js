import { ObjectId } from 'mongodb';
import database from '../../../utils/dbConnection';

export async function apiUserById(req, res) {

  await database.connect();
  const userId = req.query.id;

  try {

    // -> GET /api/users/{id}
    if (req.method === 'GET') {

      // Convert userId (String -> ObjectId)
      try {
        const _id = new ObjectId(userId)
      } catch (error) {
        console.error('Error converting ObjectId:', error);
        res.status(400).json({ error: 'Invalid user ID' });
        return;
      }

      // Search for the user in DB
      try {
        const user = await database.db.collection('users').findOne({ "_id": _id });
        if (!user) {
          res.status(404).json({ error: 'User not found' });
          return;
        } else {
          res.status(200).json(user);
        }
      } catch (error) {
        console.error('Error when performing DB query:', error);
        res.status(500).json({ error: 'Invalid user ID' });
        return;
      }

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
