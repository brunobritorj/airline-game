import { ObjectId } from 'mongodb';
import database from '../../../utils/dbConnection';
import distanceInKm from '../../../utils/distanceMeasures';
import moneyFormat from '../../../utils/moneyFormat';
import distanceFormat from '../../../utils/distanceFormat';

export default async function apiNewRoute(req, res) {

  await database.connect();

  try {

    // -> GET /api/routes
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
        },
        {
          $limit: 100,
        }
      ];

      // Perform the query
      let data;
      data = await database.db.collection('routes').aggregate(queryPipeline).sort({ _id: -1 }).toArray();
      
      // Return the data as JSON response
      res.status(200).json(data);
    }
    // -> POST /api/routes/
    else if (req.method === 'POST') {

      // Get data from body
      const { airline, src, dst, aircraft } = req.body;
      if (!airline || !src || !dst || !aircraft) {
        res.status(400).json({ error: 'Missing required field in request body' });
        return;
      }

      // Check if source and destination airports are the same
      if (src === dst) {
        res.status(400).json({ error: 'Aeroportos de origem e destino não podem ser o mesmo' });
        return;
      }

      // Check if route already exists
      const routes = await database.db.collection('routes').find({ src: new ObjectId(src), dst: new ObjectId(dst) }).toArray();
      if (routes.length > 0) {
        res.status(400).json({ error: 'Rota ja existe' });
        return;
      }

      // Check if aircraft is available
      const aircraftRoutes = await database.db.collection('routes').find({ aircraft: new ObjectId(aircraft) }).toArray();
      if (aircraftRoutes.length > 0) {
        res.status(400).json({ error: 'Aeronave ja esta alocada em outra rota' });
        return;
      }

      // Check if aircraft's owner is the airline owner
      const aircraftData = await database.db.collection('aircrafts').find({ _id: new ObjectId(aircraft) }).toArray();
      if (aircraftData[0].airline.toString() !== airline) {
        res.status(400).json({ error: 'Aircraft owner is not the current user' });
        return;
      }

      const srcAirportData = await database.db.collection('airports').find({_id: new ObjectId(src)}).toArray();
      const dstAirportData = await database.db.collection('airports').find({_id: new ObjectId(dst)}).toArray();

      // Determine the distance between airports and check if aircraft supports the route range
      const distance = distanceInKm( [srcAirportData[0].lat, srcAirportData[0].lon], [dstAirportData[0].lat, dstAirportData[0].lon]);
      if (distance > aircraftData[0].range){
        res.status(400).json({ error: `Aeronave não suporta voo de ${distanceFormat(distance)}` });
        return;
      }

      const airlineData = await database.db.collection('users').findOne({ _id: new ObjectId(airline)});

      // Calculate the montly profit !!! NEEDS ATTENTION
      const profitMontly = 10000000 * (distance / aircraftData[0].range);

      // Update the routes collection
      await database.db.collection('routes').insertOne({
        airline: new ObjectId(airline),
        src: new ObjectId(src),
        dst: new ObjectId(dst),
        aircraft: new ObjectId(aircraft),
        distance: distance,
        passengersMontly: 0,
        profitMontly: profitMontly
      });

      // Post new msg on feed (doesn't care about the result)
      const newMsg = {
        title: "Nova rota iniciada",
        text: `${airlineData.airline} iniciou uma nova rota ${srcAirportData[0].iata}-${dstAirportData[0].iata} com sua aeronave ${aircraftData[0].registration}. Estima-se um fluxo mensal de ${moneyFormat(profitMontly)}`,
        airline: new ObjectId(airline)
      };
      await database.db.collection('feed').insertOne(newMsg);

      res.status(201).json({ message: 'New route created!' });
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
