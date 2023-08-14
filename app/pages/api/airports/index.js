import { ObjectId } from 'mongodb';
import database from '../../../utils/dbConnection';

export default async function apiAirports(req, res) {

  await database.connect();

  try {

    // -> GET /api/airports
    if (req.method === 'GET') {

      // Build the query based on user inputs
      let query = {};
      const { airline } = req.query;
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

      // Build the pipeline to pull/convert relationships
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

      // Perform the query
      let data;
      data = await database.db.collection('airports').aggregate(queryPipeline).sort({ _id: -1 }).toArray();
      
      // Return the data as JSON response
      res.status(200).json(data);
      
    }
    else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
