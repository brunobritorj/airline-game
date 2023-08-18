import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DivAlert from '../../components/div/DivAlert'

export default function NewRouteForm({airline_id}){
  const router = useRouter();
  const [airportsSrc, setAirportsSrc] = useState();
  const [airportsDst, setAirportsDst] = useState();
  const [aircrafts, setAircrafts] = useState();
  const [selectedAirportSrc, setSelectedAirportSrc] = useState();
  const [selectedAirportDst, setSelectedAirportDst] = useState();
  const [selectedAircraft, setSelectedAircraft] = useState();
  const [routeAuthorizationStatus, setRouteAuthorizationStatus] = useState();

  useEffect(() => {
    // Fetch airports based on airline_id
    fetch(`/api/airports?airline=${airline_id}`)
      .then(response => response.json())
      .then(data => setAirportsSrc(data));
    // Fetch all airports
    fetch(`/api/airports`)
      .then(response => response.json())
      .then(data => setAirportsDst(data));

  }, []);

  useEffect(() => {
    if (selectedAirportSrc && selectedAirportDst){
      // Fetch aircrafts based on airline_id and route=none
      fetch(`/api/aircrafts?airline=${airline_id}&available=true`) // Need to create / implement this API (api exists, need to support the filter)
        .then(response => response.json())
        .then(data => setAircrafts(data));
    }
  }, [selectedAirportSrc, selectedAirportDst]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/routes', {
      method: 'POST',
      body: JSON.stringify({
        airline: airline_id,
        src: selectedAirportSrc,
        dst: selectedAirportDst,
        aircraft: selectedAircraft,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 201) {
      const { route_id } = await response.json();
      setRouteAuthorizationStatus("success");
      setTimeout(() => { router.back(); }, 1000); // This navigates the user to the previous page, waiting 1 second
    } else {
      setRouteAuthorizationStatus("warning");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {routeAuthorizationStatus === "warning" && ( <DivAlert kind={"warning"} title={"Negado!"} message={"Impossivel criar a rota"} /> )}
      {routeAuthorizationStatus === "success" && ( <DivAlert kind={"success"} title={"Successo!"} message={"Nova rota criada"} /> )}
      { airportsSrc &&
        <div className="mb-3">
          <label htmlFor="src" className="form-label">Hub:</label><br />
          <select id="src" className='form-select' value={selectedAirportSrc} onChange={(e) => setSelectedAirportSrc(e.target.value)}>
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
          <label htmlFor="dst" className="form-label">Destino:</label><br />
          <select id="dst" className='form-select' value={selectedAirportDst} onChange={(e) => setSelectedAirportDst(e.target.value)}>
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
                {aircraft.registration}
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
