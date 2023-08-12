import { useState, useEffect } from 'react';

const APP_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

export default function NewRouteForm({airline_id}){
  const [airportsSrc, setAirportsSrc] = useState();
  const [airportsDst, setAirportsDst] = useState();
  const [aircrafts, setAircrafts] = useState();
  const [selectedAirportSrc, setSelectedAirportSrc] = useState();
  const [selectedAirportDst, setSelectedAirportDst] = useState();
  const [selectedAircraft, setSelectedAircraft] = useState();

  useEffect(() => {

    // Fetch airports based on airline_id
    fetch(`${APP_URL}/api/airports?airline=${airline_id}`)
      .then(response => response.json())
      .then(data => setAirportsSrc(data));

    // Fetch airports based on airline_id     <-------------- PRECISA MUDAR A API PARA SELECIONAR AEROPORTOS DE DESTINO
    fetch(`${APP_URL}/api/airports?airline=${airline_id}`)
      .then(response => response.json())
      .then(data => setAirportsDst(data));

    // Fetch aircrafts based on airline_id and route=none
    fetch(`${APP_URL}/api/aircrafts?airline=${airline_id}`)
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
      { airportsSrc &&
        <div className="mb-3">
          <label htmlFor="airportHub" className="form-label">Hub:</label><br />
          <select id="airportHub" className='form-select' value={selectedAirportSrc} onChange={(e) => setSelectedAirportSrc(e.target.value)}>
            <option disabled selected value>Selecione seu aeroporto de origem</option>
            {airportsSrc.map((airport) => (
              <option key={airport._id} value={airport._id}>
                {airport.iata}
              </option>
            ))}
          </select>
        </div>
      }
      {selectedAirportSrc && airportsDst &&
        <div className="mb-3">
          <label htmlFor="airportDst" className="form-label">Destino:</label><br />
          <select id="airportDst" className='form-select' value={selectedAirportDst} onChange={(e) => setSelectedAirportDst(e.target.value)}>
            <option disabled selected value>Selecione seu aeroporto de destino</option>
            {airportsDst.map((airport) => (
              <option key={airport._id} value={airport._id}>
                {airport.iata}
              </option>
            ))}
          </select>
        </div>
      }
      {selectedAirportSrc && selectedAirportDst && aircrafts &&
        <div className="mb-3">
          <label htmlFor="aircraft" className="form-label">Aeronave:</label><br />
          <select id="aircraft" className='form-select' value={selectedAircraft} onChange={(e) => setSelectedAircraft(e.target.value)}>
            <option disabled selected value>Selecione a aeronave para o voo</option>
            {aircrafts.map((aircraft) => (
              <option key={aircraft._id} value={aircraft._id}>
                {`${aircraft._id} (${aircraft.model})`}
              </option>
            ))}
          </select>
        </div>
      }
      { selectedAirportSrc && selectedAirportDst && selectedAircraft &&
        <div className="d-grid gap-2">
          <button type="submit" className="btn btn-secondary">Solicitar autorização</button>
        </div>
      }
    </form>
  );
};
