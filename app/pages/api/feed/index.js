import database from '../../../utils/dbConnection';

export default async function apiFeed(req, res) {

  await database.connect();

  try {

    // -> GET /api/feed
    if (req.method === 'GET') {

      // Check user inputs
      const { email } = req.query;
      if (!email) {
        res.status(400).json({ error: 'Email is a required field' });
        return;
      }

      // Query user's data
      let userData;
      userData = await database.db.collection('users').findOne({ email });

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
      feedData = await database.db.collection('feed').aggregate(queryPipeline).sort({ _id: -1 }).toArray();
      
      // Return the data as JSON response
      res.status(200).json({userData, feedData});
      return;

    }
    else {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }
  } catch (error) {
    console.error('API route error:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
}

