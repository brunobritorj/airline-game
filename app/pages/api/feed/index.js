import { connectToDatabase, client, DB_NAME } from '../../../utils/mongodb';

// -> /api/feed
export default async function apiFeed(req, res) {
  try {
    if (req.method === 'GET') {

      const queryPipeline = [
        {
          $lookup: {
            from: "users",
            localField: "airline",
            foreignField: "_id",
            as: "airlineInfo"
          }
        },
        {
          $unwind: { path: "$airlineInfo", preserveNullAndEmptyArrays: true },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            text: 1,
            airline: { $ifNull: ["$airlineInfo._id", null] },
            color: { $ifNull: ["$airlineInfo.color", "black"] },
          }
        },
        {
          $sort: { _id: -1 }, // Sort by _id in descending order (newest first)
        },
        {
          $limit: 10, // Limit the results to 10 documents
        }
      ];

      
      // Connect to the database
      await connectToDatabase();

      // Perform the query
      let data;
      data = await client.db(DB_NAME).collection('feed').aggregate(queryPipeline).sort({ _id: -1 }).toArray();
      
      // Close the database connection
      client.close();

      // Return the data as JSON response
      res.status(200).json(data);
      
    } else if (req.method === 'POST') {

      try {
        const { category, title, text, airline } = req.body;

        if (!category || !title || !text || !airline) {
          res.status(400).json({ error: 'Missing required fields' });
          return;
        }

        // Connect to the database
        await connectToDatabase();

        // Access a collection
        const collection = client.db(DB_NAME).collection('users');

        // Create the new msg on Feed
        const newMsg = { email, name, airline, color, assets };
        const result = await collection.insertOne(newMsg);
      
        if (!result || !result.insertedId) {
          throw new Error('Msg post failed');
        }
      
        // Close the database connection
        client.close();
      
        res.status(201).json(result.insertedId);
      } catch (error) {
        console.error('Error posting a message on feed:', error);
        res.status(500).json({ error: 'Error posting a message on feed' });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

