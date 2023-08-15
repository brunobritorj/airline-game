import database from '../../../utils/dbConnection';
import generateAircrafts from '../../../utils/generateResources';

// -> /api/reset
export default async function apiGame(req, res) {
  try {
    if (req.method === 'GET') {

      const baseFolder = 'pages/api/reset'

      // Connect to the database
      await database.connect();

      // Drop Collections
      try { let dropUsers = await database.db.collection('users').drop(); } catch (err) { console.error(`Error dropping collection users:`, err); }
      try { let dropFeed = await database.db.collection('feed').drop(); } catch (err) { console.error(`Error dropping collection feed:`, err); }
      try { let dropAircrafts = await database.db.collection('aircrafts').drop(); } catch (err) { console.error(`Error dropping collection aircrafts:`, err); }
      try { let dropRoutes = await database.db.collection('routes').drop(); } catch (err) { console.error(`Error dropping collection routes:`, err); }

      // Create aircrafts
      const aircrafts = generateAircrafts(10);
      await database.db.collection('aircrafts').insertMany(aircrafts);

      //// Create Airports form file
      //try { await database.db.collection('airports').drop(); } catch (err) { console.error(`Error dropping collection airports:`, err); }
      //const fs = require('fs');
      //const airports = JSON.parse(fs.readFileSync(`${baseFolder}/airports.json`, 'utf8'));
      //await database.db.collection('airports').insertMany(airports);
      
      // Reset Airports owner (airline)
      await database.db.collection('airports').updateMany({}, { $set: { airline: null } })      // Just reset owner (airline)
      
      // -> Feed
      const feed = [
        {
          "title": "Nova partida foi iniciada",
          "text": "Faca sua companhia aérea crescer, adquira novos hubs, aeronaves, e abra novas rotas.",
          "airline": null
        }
      ]
      
      await database.db().collection('feed').insertMany(feed);
      
      // Return JSON response
      res.status(200).json({ newGame: 'ok' });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
