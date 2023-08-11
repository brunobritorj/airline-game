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

      // First, need to check if user has enough money!?

      // Update the document with the purchased aircraft and decrease assets.money by 10000
      const updatedUser = await client.db(DB_NAME).collection('users').findOneAndUpdate(
        {
          "_id": new ObjectId(userId),
          "assets.cash": { $gte: price } // Check if user has money
        },
        { $inc: { 'assets.cash': - price } }, // Payment
        { returnOriginal: false } // Return the updated document
      );

      // If user had enought money to pay
      if (updatedUser.value != null){

        // Transfer the aircraft ownership
        const updatedAircraft = await client.db(DB_NAME).collection('aircrafts').findOneAndUpdate(
          { _id: new ObjectId(aircraftId) },
          { $set: { airline: new ObjectId(userId) } },
          { returnOriginal: false }
        );

        if (updatedAircraft.value != null){

          // Post new msg on feed but doesn't care about the result
          const newMsg = {
            title: "Nova aeronave adquirida",
            text: `${updatedUser.value.airline} adquiriu a aeronave ${model} por ${moneyFormat(price)}`,
            airline: updatedUser.value._id
          };
          await client.db(DB_NAME).collection('feed').insertOne(newMsg);
          client.close();
          res.status(200).json(updatedAircraft.value);
        } else {
          client.close();
          res.status(400).json({error: 'Unable to transfer ownership'});
        }

      } else {
        client.close();
        res.status(400).json({error: 'Not enought money'});
      }

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
