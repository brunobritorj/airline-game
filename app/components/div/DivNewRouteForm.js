import { useState, useEffect } from 'react';

export default function NewRouteForm({airline_id}){
  const [airports, setAirports] = useState();
  const [aircrafts, setAircrafts] = useState();
  const [airportRemote, setAirportRemote] = useState();
  const [selectedAirportHub, setSelectedAirportHub] = useState();
  const [selectedAircraft, setSelectedAircraft] = useState();

  useEffect(() => {
    // Fetch airports based on airline_id
    fetch(`/api/airports?airline=${airline_id}`)
      .then(response => response.json())
      .then(data => setAirports(data));

    // Fetch aircrafts based on airline_id and route=none
    fetch(`/api/aircrafts?airline=${airline_id}&route=none`)
      .then(response => response.json())
      .then(data => setAircrafts(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/routes/newrequest', {
      method: 'POST',
      body: JSON.stringify({
        airportHub: selectedAirportHub,
        aircraft: selectedAircraft,
        airportRemote: airportRemote,
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

      <label>
        Airport Remote:
        <input
          type="text"
          value={airportRemote}
          onChange={(e) => setAirportRemote(e.target.value)}
        />
      </label>
      <br />

      <button type="submit">Submit</button>
    </form>
  );
};
