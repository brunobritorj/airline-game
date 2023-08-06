import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import LayoutUnauthenticated from '../../components/LayoutUnauthenticated';
import BaseLayout from '../../components/BaseLayout';
import moneyFormat from '../../utils/moneyFormat'

const navbarSubItems = [
  { name: 'Voltar', url: '/aircrafts' }
];

export default function AircraftDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [aircraft, setAircraft] = useState(null);

  useEffect(() => {
    if (id) {
      // Fetch aircraft data from GET /api/aircrafts/{id}
      fetch(`/api/aircrafts/${id}`)
        .then(response => response.json())
        .then(data => {
          setAircraft(data);
        })
        .catch(error => {
          console.error('An error occurred while fetching data:', error);
        });
    }
  }, [id]);

  const handleSubmit = () => {
    if (aircraft) {
      // Perform POST request to update aircraft data
      fetch(`/api/aircrafts/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...aircraft, /* Updated data fields */ }),
      })
        .then(response => response.json())
        .then(data => {
          // Redirect to the /aircrafts page
          router.push('/aircrafts');
        })
        .catch(error => {
          console.error('An error occurred while updating data:', error);
        });
    }
  };

  return (
    <BaseLayout subtitle={`Aeronave ${id}`} navbarSubItems={navbarSubItems} icon="/images/aircrafts-color-icon.svg" color="#212529" description={"Detalhes"}>
      {aircraft ? (
        <div>
          <p>Modelo: {aircraft.model}</p>
          <p>Preço: {moneyFormat(aircraft.price)}</p>
          { aircraft.airline === null ? ( <button onClick={handleSubmit}>Comprar</button> ) : ("") }
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </BaseLayout>
  );
}
