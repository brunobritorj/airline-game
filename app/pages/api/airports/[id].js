// /api/airports/[id].js
import { connectToDatabase, client, DB_NAME } from '../../../utils/mongodb';
import { ObjectId } from 'mongodb';
import moneyFormat from '../../../utils/moneyFormat'

export default async function apiAirport(req, res) {
  try {
    const { method } = req;

    if (method === 'GET') {
      const airportId = req.query.id;

      // Connect to the database
      await connectToDatabase();

      let query = { _id: new ObjectId(airportId) }
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
        }
      ];

      // Perform the query
      const airportResult = await client.db(DB_NAME).collection('airports').aggregate(queryPipeline).toArray();

      // Close the database connection
      client.close();

      // Return the data as JSON response
      res.status(200).json(airportResult[0]);
    } else if (method === 'POST') {
      const airportId = req.query.id;
      const { userId, iata, price } = req.body;

      // Validate that userId is present in the request body
      if (!userId) {
        res.status(400).json({ error: 'Missing userId in request body' });
        return;
      }

      // Connect to the database
      await connectToDatabase();

      // Update the document decreasing assets.money
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

        // Transfer the airport ownership
        const updatedAirport = await client.db(DB_NAME).collection('airports').findOneAndUpdate(
          { _id: new ObjectId(airportId) },
          { $set: { airline: new ObjectId(userId) } },
          { returnOriginal: false }
        );

        if (updatedAirport.value != null){

          // Post new msg on feed but doesn't care about the result
          const newMsg = {
            title: "Novo hub licenciado",
            text: `${updatedUser.value.airline} adquiriu exclusividade de uso do ${updatedAirport.value.iata} | ${updatedAirport.value.airport} (${updatedAirport.value.state} - ${updatedAirport.value.country}) como seu hub, por ${moneyFormat(price)}`,
            airline: updatedUser.value._id
          };
          await client.db(DB_NAME).collection('feed').insertOne(newMsg);
          client.close();
          res.status(200).json(updatedAirport.value);
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
