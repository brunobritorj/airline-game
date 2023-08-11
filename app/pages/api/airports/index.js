import { connectToDatabase, client, DB_NAME } from '../../../utils/mongodb';
import { ObjectId } from 'mongodb';

// -> /api/feed
export default async function apiAirports(req, res) {
  try {
    if (req.method === 'GET') {

      const { airline } = req.query;

      let query = {};
      if (airline) {
        if (airline === 'none') {
          query.airline = null;
        } else if (airline.startsWith('!')) {
          const airlineValue = new ObjectId(airline.substring(1));
          query.airline = { $not: { $in: [null, airlineValue] }};
        } else {
          query.airline = new ObjectId(airline);
        }
      }

      const queryPipeline = [
        {
          $match: query,
        },
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
            iata: 1,
            airport: 1,
            city: 1,
            state: 1,
            country: 1,
            lat: 1,
            lon: 1,
            price: 1,
            airline: { $ifNull: ["$airlineInfo.airline", null] },
            color: { $ifNull: ["$airlineInfo.color", "#212529"] },
          }
        },
        {
          $sort: { iata: 1 }, // Sort by IATA in ascending order (A-Z)
        },
        {
          $limit: 100, // Limit the results to 50 documents
        }
      ];

      // Connect to the database
      await connectToDatabase();

      // Perform the query
      let data;
      data = await client.db(DB_NAME).collection('airports').aggregate(queryPipeline).sort({ _id: -1 }).toArray();
      
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
