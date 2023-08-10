// /api/aircrafts/[id].js
import { connectToDatabase, client, DB_NAME } from '../../../utils/mongodb';
import { ObjectId } from 'mongodb';
import moneyFormat from '../../../utils/moneyFormat'

export default async function apiAircraft(req, res) {
  try {
    const { method } = req;

    if (method === 'GET') {
      const aircraftId = req.query.id;

      // Connect to the database
      await connectToDatabase();

      // Perform the query
      const aircraft = await client.db(DB_NAME).collection('aircrafts').findOne({ _id: new ObjectId(aircraftId) });

      // Close the database connection
      client.close();

      // Return the data as JSON response
      res.status(200).json(aircraft);
    } else if (method === 'POST') {
      const aircraftId = req.query.id;
      const { userId, model, price } = req.body;

      // Validate that userId is present in the request body
      if (!userId) {
        res.status(400).json({ error: 'Missing userId in request body' });
        return;
      }

      // Connect to the database
      await connectToDatabase();

      // Update the document with the purchased aircraft
      const updatedAircraft = await client.db(DB_NAME).collection('aircrafts').findOneAndUpdate(
        { _id: new ObjectId(aircraftId) },
        { $set: { airline: new ObjectId(userId) } }, // Set the "airline" property to userId
        { returnOriginal: false } // Return the updated document
      );

      // Post new msg on feed but doesn't care about the result
      const newMsg = {
        title: "Nova aeronave adquirida",
        text: `${userId} adquiriu a aeronave ${model} por ${moneyFormat(price)}`,
        airline: userId
      };
      await client.db(DB_NAME).collection('feed').insertOne(newMsg);

      // Close the database connection
      client.close();

      // Return the updated aircraft data as JSON response
      res.status(200).json(updatedAircraft.value);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

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
