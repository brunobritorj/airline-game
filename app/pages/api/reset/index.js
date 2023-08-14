import database from '../../../utils/dbConnection';

// -> /api/users
export default async function apiGame(req, res) {
  try {
    if (req.method === 'GET') {

      const baseFolder = 'pages/api/reset'

      // Connect to the database
      await database.connect();

      // Drop Collections
      try { await database.db.collection('users').drop(); } catch (err) { console.error(`Error dropping collection users:`, err); }
      try { await database.db.collection('feed').drop(); } catch (err) { console.error(`Error dropping collection feed:`, err); }

      // Push initial data
      const fs = require('fs');
      
      // -> Airports
      //try { await database.db.collection('airports').drop(); } catch (err) { console.error(`Error dropping collection airports:`, err); }
      //const airports = JSON.parse(fs.readFileSync(`${baseFolder}/airports.json`, 'utf8'));    // Push new data
      //await database.db.collection('airports').insertMany(airports);                          // Push new data
      await database.db.collection('airports').updateMany({}, { $set: { airline: null } })      // Just reset owner (airline)

      // -> Aircrafts
      //try { await database.db.collection('aircrafts').drop(); } catch (err) { console.error(`Error dropping collection aircrafts:`, err); }
      //const aircrafts = JSON.parse(fs.readFileSync(`${baseFolder}/aircrafts.json`, 'utf8'));  // Push new data
      //await database.db.collection('aircrafts').insertMany(aircrafts);                        // Push new data
      await database.db.collection('aircrafts').updateMany({}, { $set: { airline: null } })     // Just reset owner (airline)
      
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
      res.status(200).json({ erased: 'ok' });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
