import { connectToDatabase, client, DB_NAME } from '../../../utils/mongodb';

// -> /api/users
export default async function apiGame(req, res) {
  try {
    if (req.method === 'GET') {

      const baseFolder = 'pages/api/reset'
      // Connect to the database
      await connectToDatabase();

      // Drop Collections
      try { await client.db(DB_NAME).collection('users').drop(); } catch (err) { console.error(`Error dropping collection users:`, err); }
      //try { await client.db(DB_NAME).collection('airports').drop(); } catch (err) { console.error(`Error dropping collection airports:`, err); }
      //try { await client.db(DB_NAME).collection('aircrafts').drop(); } catch (err) { console.error(`Error dropping collection aircrafts:`, err); }
      //try { await client.db(DB_NAME).collection('feed').drop(); } catch (err) { console.error(`Error dropping collection feed:`, err); }

      // Push initial data
      const fs = require('fs');
      
      // -> Airports
      //const airports = JSON.parse(fs.readFileSync(`${baseFolder}/airports.json`, 'utf8'));      // Push new data
      //await client.db(DB_NAME).collection('airports').insertMany(airports);                     // Push new data
      await client.db(DB_NAME).collection('airports').updateMany({}, { $set: { airline: null } }) // Just reset owner (airline)

      // -> Aircrafts
      //const aircrafts = JSON.parse(fs.readFileSync(`${baseFolder}/aircrafts.json`, 'utf8'));      // Push new data
      //await client.db(DB_NAME).collection('aircrafts').insertMany(aircrafts);                     // Push new data
      await client.db(DB_NAME).collection('aircrafts').updateMany({}, { $set: { airline: null } })  // Just reset owner (airline)
      
      // -> Feed
      const feed = [
        {
          "title": "Nova partida foi iniciada",
          "text": "Faca sua companhia aérea crescer, adquira novos hubs, aeronaves, e abra novas rotas.",
          "airline": null
        }
      ]
      
      await client.db(DB_NAME).collection('feed').insertMany(feed);

      // Close the database connection
      client.close();

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
