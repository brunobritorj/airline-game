import { connectToDatabase, client, DB_NAME } from '../../../utils/mongodb';
import { ObjectId } from 'mongodb';

// -> /api/aircraft
export default async function apiAircraft(req, res) {
  try {
    if (req.method === 'GET') {

      const aircraftId = req.query.id;

      /*
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
            color: { $ifNull: ["$airlineInfo.color", "#212529"] },
          }
        },
        {
          $sort: { _id: -1 }, // Sort by _id in descending order (newest first)
        },
        {
          $limit: 10, // Limit the results to 10 documents
        }
      ];
      */

      // Connect to the database
      await connectToDatabase();

      // Perform the query
      const aircraft = await client.db(DB_NAME).collection('aircrafts').findOne({ _id: new ObjectId(aircraftId) });
      
      // Close the database connection
      client.close();

      // Return the data as JSON response
      res.status(200).json(aircraft);
      
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

