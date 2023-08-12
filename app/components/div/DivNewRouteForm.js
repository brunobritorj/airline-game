import { useState, useEffect } from 'react';

const APP_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

export default function NewRouteForm({airline_id}){
  const [airports, setAirports] = useState();
  const [aircrafts, setAircrafts] = useState();
  const [airportDestination, setAirportDestination] = useState();
  const [selectedAirportHub, setSelectedAirportHub] = useState();
  const [selectedAircraft, setSelectedAircraft] = useState();

  useEffect(() => {
    // Fetch airports based on airline_id
    fetch(`${APP_URL}/api/airports?airline=${airline_id}`)
      .then(response => response.json())
      .then(data => setAirports(data));

    // Fetch aircrafts based on airline_id and route=none
  fetch(`${APP_URL}/api/aircrafts?airline=${airline_id}`)
      .then(response => response.json())
      .then(data => setAircrafts(data));
  }, []);

  console.log(aircrafts);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/routes/newrequest', {
      method: 'POST',
      body: JSON.stringify({
        airportHub: selectedAirportHub,
        aircraft: selectedAircraft,
        airportDestination: airportDestination,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 201) {
      const { route_id } = await response.json();
      window.location.href = `/routes/${route_id}`;
    } else {
      alert('Form submission failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>

      { airports &&
        <label>
          Hub de origem: 
          <select
            value={selectedAirportHub}
            onChange={(e) => setSelectedAirportHub(e.target.value)}
          >
            {airports.map((airport, index) => (
              <option key={airport._id} value={airport._id}>
                {airport.iata}
              </option>
            ))}
          </select>
        </label>
      }
      <br />
      <label>
        Destino:
        <input
          type="text"
          value={airportDestination}
          onChange={(e) => setAirportDestination(e.target.value)}
        />
      </label>
      <br />

      <button type="submit">Submit</button>
    </form>
  );
};
