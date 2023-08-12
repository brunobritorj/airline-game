import database from '../../../utils/dbConnection';
import hashObjectId from '../../../utils/hashObjectId';

export default async function apiUsers(req, res) {
  
  await database.connect();

  try {

    // -> GET /api/users
    if (req.method === 'GET') {

      // If email is provided, query for a single user, else query for all users.
      const { email } = req.query;
      if (email) {
        const data = await database.db.collection('users').findOne({ email });

        if (!data) {
          res.status(404).json({ error: 'User not found' });
          return;
        } else {
          res.status(200).json(data);
        }

      } else {
        const data = await database.db.collection('users').find({}).toArray();
        res.status(200).json(data);
      }

    }

    // -> POST /api/users
    else if (req.method === 'POST') {

      try {

        // Get data from body
        const { email, name, airline = name, color = '#000000' } = req.body;
        if (!email || !name) {
          res.status(400).json({ error: 'Email and name are required fields' });
          return;
        }

        // Generate a fixed ObjectId based on the email address
        const _id = hashObjectId(email);

        // Define initial budget as $1Bi
        const assets = { "cash": 1000000000 };

        // Check if the user already exists in DB
        const existingUser = await database.db.collection('users').findOne({ email });
        if (existingUser) {
          res.status(409).json({ error: 'User already exists' });
          return;
        }

        // Create the new user in DB
        const newUser = { _id, email, name, airline, color, assets };
        const result = await database.db.collection('users').insertOne(newUser);
        if (!result || !result.insertedId) {
          throw new Error('User creation failed');
        }
      
        // Post new msg on feed (doesn't care about the result)
        const newMsg = {
          title: "Nova companhia fundada",
          text: `A ${airline} é a mais nova companhia aerea no mercado, fundada por ${name}.`,
          airline: result.insertedId
        };
        await database.db.collection('feed').insertOne(newMsg);

        // Return user creation success!
        res.status(201).json(result.insertedId);

      } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Error creating user' });
      }
    }
    else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
