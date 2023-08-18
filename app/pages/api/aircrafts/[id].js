import { ObjectId } from 'mongodb';
import database from '../../../utils/dbConnection';
import moneyFormat from '../../../utils/moneyFormat';

export default async function apiAircraftById(req, res) {

  await database.connect();
  const aircraftId = req.query.id;

  try {

    // -> GET /aircrafts/{id}
    if (req.method === 'GET') {

      let query = { _id: new ObjectId(aircraftId) }
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
            model: 1,
            registration: 1,
            range: 1,
            passengers: 1,
            price: 1,
            airline: { $ifNull: ["$airlineInfo.airline", null] },
            color: { $ifNull: ["$airlineInfo.color", "#212529"] },
          }
        }
      ];

      // Perform the query
      const aircraftResult = await database.db.collection('aircrafts').aggregate(queryPipeline).toArray();

      // Return the data as JSON response
      res.status(200).json(aircraftResult[0]);

    }

    // -> POST /aircrafts/{id}
    else if (req.method === 'POST') {

      // Get data from body
      const { userId, price } = req.body;
      if (!userId) {
        res.status(400).json({ error: 'Missing userId in request body' });
        return;
      }

      // Update the document decreasing assets.money
      const updatedUser = await database.db.collection('users').findOneAndUpdate(
        {
          "_id": new ObjectId(userId),
          "assets.cash": { $gte: price } // Assures that user has money
        },
        { $inc: { 'assets.cash': - price } }, // Payment
        { returnOriginal: false } // Return the updated document
      );

      // If user had enought money to pay
      if (updatedUser.value != null){

        // Transfer the aircraft ownership and decrease 15% of the aircraft value
        const updatedAircraft = await database.db.collection('aircrafts').findOneAndUpdate(
          {
            _id: new ObjectId(aircraftId),
            price: price // Assures that the price payed by the user is the same as the price of the aircraft
          },
          { $set: {
            airline: new ObjectId(userId),
            price: (price * 0.85),
          } },
          { returnOriginal: false }
        );

        if (updatedAircraft.value != null){

          // Post new msg on feed (doesn't care about the result)
          const newMsg = {
            title: "Nova aeronave adquirida",
            text: `${updatedUser.value.airline} adquiriu a aeronave ${updatedAircraft.value.registration} por ${moneyFormat(price)}`,
            airline: updatedUser.value._id
          };
          
          await database.db.collection('feed').insertOne(newMsg);
          res.status(200).json(updatedAircraft.value);
          return;

        } else {
          res.status(400).json({error: 'Unable to transfer ownership'});
          return;
        }

      } else {
        res.status(400).json({error: 'Not enought money'});
        return;
      }
    }

    // -> DELETE /aircrafts/{id}
    else if (req.method === 'DELETE') {

      // Get data from body
      const { userId } = req.body;
      if (!userId) {
        res.status(400).json({ error: 'Missing userId in request body' });
        return;
      }

      // Transfer the aircraft ownership
      const updatedAircraft = await database.db.collection('aircrafts').findOneAndUpdate(
        {
          _id: new ObjectId(aircraftId),
          airline: new ObjectId(userId) // Assures that aircraft is owned by the user
        },
        { $set: { airline: null } },
        { returnOriginal: false }
      );

      if (updatedAircraft.value != null){

        // Update the document increasing assets.money
        const updatedUser = await database.db.collection('users').findOneAndUpdate(
          {
            _id: new ObjectId(userId),
          },
          { $inc: { 'assets.cash': + updatedAircraft.value.price } }, // Payment (+)
          { returnOriginal: false } // Return the updated document
        );
      
        res.status(200).json({ message: 'Sold' });
        return;

      } else {
        res.status(404).json({ error: 'Not found' });
        return;
      }

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
