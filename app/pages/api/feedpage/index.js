import { connectToDatabase, client, DB_NAME } from '../../../utils/mongodb';

// -> /api/feedpage
export default async function apiFeedPage(req, res) {
  try {
    if (req.method === 'GET') {

      const { email } = req.query;
      if (!email) {
        res.status(400).json({ error: 'Email is a required field' });
        return;
      }

      // Connect to the database
      await connectToDatabase();

      // Query user's data
      let userData;
      userData = await client.db(DB_NAME).collection('users').findOne({ email });

      // Query news
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
      let feedData;
      feedData = await client.db(DB_NAME).collection('feed').aggregate(queryPipeline).sort({ _id: -1 }).toArray();
      
      // Close the database connection
      client.close();

      // Return the data as JSON response
      res.status(200).json({userData, feedData});

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

