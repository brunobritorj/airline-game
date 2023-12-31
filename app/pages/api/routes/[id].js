import { ObjectId } from 'mongodb';
import database from '../../../utils/dbConnection';
import moneyFormat from '../../../utils/moneyFormat';
import distanceFormat from '../../../utils/distanceFormat';

export default async function apiAircraftById(req, res) {

  await database.connect();
  const routeId = req.query.id;

  try {

    // -> GET /routes/{id}
    if (req.method === 'GET') {

      let query = { _id: new ObjectId(routeId) }
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
          $lookup: {
            from: "airports",
            localField: "src",
            foreignField: "_id",
            as: "srcInfo"
          }
        },
        {
          $lookup: {
            from: "airports",
            localField: "dst",
            foreignField: "_id",
            as: "dstInfo"
          }
        },
        {
          $lookup: {
            from: "aircrafts",
            localField: "aircraft",
            foreignField: "_id",
            as: "aircraftInfo"
          }
        },
        {
          $unwind: { path: "$airlineInfo", preserveNullAndEmptyArrays: true },
        },
        {
          $project: {
            _id: 1,
            airline: "$airlineInfo.airline",
            color: "$airlineInfo.color",
            src: { $arrayElemAt: ["$srcInfo.iata", 0] },
            dst: { $arrayElemAt: ["$dstInfo.iata", 0] },
            aircraft: { $arrayElemAt: ["$aircraftInfo.registration", 0] },
            distance: 1,
            profitMontly: 1
          }
        }
      ];

      // Perform the query
      const routeResult = await database.db.collection('routes').aggregate(queryPipeline).toArray();

      // Return the data as JSON response
      res.status(200).json(routeResult[0]);
  
    } else if (req.method === 'DELETE') {

      let query = { _id: new ObjectId(routeId) }
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
          $lookup: {
            from: "airports",
            localField: "src",
            foreignField: "_id",
            as: "srcInfo"
          }
        },
        {
          $lookup: {
            from: "airports",
            localField: "dst",
            foreignField: "_id",
            as: "dstInfo"
          }
        },
        {
          $lookup: {
            from: "aircrafts",
            localField: "aircraft",
            foreignField: "_id",
            as: "aircraftInfo"
          }
        },
        {
          $unwind: { path: "$airlineInfo", preserveNullAndEmptyArrays: true },
        },
        {
          $project: {
            _id: 1,
            airline: "$airlineInfo.airline",
            userId: "$airlineInfo._id",
            color: "$airlineInfo.color",
            src: { $arrayElemAt: ["$srcInfo.iata", 0] },
            dst: { $arrayElemAt: ["$dstInfo.iata", 0] },
            aircraft: { $arrayElemAt: ["$aircraftInfo.registration", 0] },
            distance: 1,
            profitMontly: 1
          }
        }
      ];

      // Perform the query
      const getResult = await database.db.collection('routes').aggregate(queryPipeline).toArray();

      const deleteResult = await database.db.collection('routes').deleteOne(query);

      if (deleteResult.deletedCount === 1) {

        // Post new msg on feed (doesn't care about the result)
        const newMsg = {
          title: "Rota encerrada",
          text: `${getResult[0].airline} encerrou a rota ${getResult[0].src}-${getResult[0].dst} (${distanceFormat(getResult[0].distance)}) realizada pelo ${getResult[0].aircraft}`,
          airline: getResult[0].userId
        };
        await database.db.collection('feed').insertOne(newMsg);

        res.status(200).json({ status: 'Deleted' });
        return;
      } else {
        res.status(404).json({ error: 'Not found' });
        return;
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }
  } catch (error) {
    console.error('API route error:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
}
