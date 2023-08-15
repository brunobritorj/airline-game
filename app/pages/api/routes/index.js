import { ObjectId } from 'mongodb';
import database from '../../../utils/dbConnection';
import distanceInKm from '../../../utils/distanceMeasures';
import moneyFormat from '../../../utils/moneyFormat';

export default async function apiNewRoute(req, res) {

  await database.connect();

  try {

    // -> GET /api/routes
    if (req.method === 'GET') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }
    // -> POST /api/routes/
    else if (req.method === 'POST') {

      // Get data from body
      const { airline, src, dst, aircraft } = req.body;
      if (!airline || !src || !dst || !aircraft) {
        res.status(400).json({ error: 'Missing required field in request body' });
        return;
      }

      // Check if aircraft is available
      const aircraftRoutes = await database.db.collection('routes').find({ aircraft: new ObjectId(aircraft) }).toArray();
      if (aircraftRoutes.length > 0) {
        res.status(400).json({ error: 'Aircraft is already allocated to a route' });
        return;
      }

      // Check if aircraft owner is the airline owner
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
        res.status(400).json({ error: 'Aircraft does not support this route range' });
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
