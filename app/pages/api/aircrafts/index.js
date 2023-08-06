import { connectToDatabase, client, DB_NAME } from '../../../utils/mongodb';

// -> /api/feed
export default async function apiAircrafts(req, res) {
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
            model: 1,
            price: 1,
            airline: { $ifNull: ["$airlineInfo.airline", null] },
            color: { $ifNull: ["$airlineInfo.color", "black"] },
          }
        },
        {
          $sort: { _id: -1 }, // Sort by _id in descending order (newest first)
        },
        {
          $limit: 50, // Limit the results to 50 documents
        }
      ];

      // Connect to the database
      await connectToDatabase();

      // Perform the query
      let data;
      data = await client.db(DB_NAME).collection('aircrafts').aggregate(queryPipeline).sort({ _id: -1 }).toArray();
      
      // Close the database connection
      client.close();

      // Return the data as JSON response
      res.status(200).json(data);
      
    } else if (req.method === 'POST') {

      res.status(405).json({ error: 'Method not allowed' });

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

