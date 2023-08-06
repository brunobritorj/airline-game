import { connectToDatabase, client, DB_NAME } from '../../../utils/mongodb';

// -> /api/users
export default async function apiUsers(req, res) {
  try {
    if (req.method === 'GET') {
      const { email } = req.query;

      // Connect to the database
      await connectToDatabase();

      // Access a collection and perform operations
      const collection = client.db(DB_NAME).collection('users');

      let data;

      // If email is provided, query for a single user, else query for all users
      if (email) {
        data = await collection.findOne({ email });

        if (!data) {
          res.status(404).json({ error: 'User not found' });
          return;
        }
      } else {
        data = await collection.find({}).toArray();
      }

      // Close the database connection
      client.close();

      // Return the data as JSON response
      res.status(200).json(data);
    } else if (req.method === 'POST') {
      // Handle user creation here
      try {
        const { email, name, airline = name, color = '#000000' } = req.body;
        const assets = {
          "cash": 100000000
        };

        if (!email || !name) {
          res.status(400).json({ error: 'Email and name are required fields' });
          return;
        }

        await connectToDatabase();

        // Check if the user already exists
        const existingUser = await client.db(DB_NAME).collection('users').findOne({ email });

        if (existingUser) {
          res.status(409).json({ error: 'User already exists' });
          return;
        }

        // Create the new user
        const newUser = { email, name, airline, color, assets };
        const result = await client.db(DB_NAME).collection('users').insertOne(newUser);
      
        if (!result || !result.insertedId) {
          throw new Error('User creation failed');
        }
      
        // Post new msg on feed but doesn't care about the result
        const newMsg = {
          title: "Nova companhia fundada",
          text: `A ${airline} é a mais nova companhia aerea no mercado, fundada por ${name}.`,
          airline: result.insertedId
        };
        await client.db(DB_NAME).collection('feed').insertOne(newMsg);

        // Close the database connection
        client.close();

        res.status(201).json(result.insertedId);
      } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Error creating user' });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
