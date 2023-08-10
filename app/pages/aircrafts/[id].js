// pages/aircrafts/[id].js

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import LayoutUnauthenticated from '../../components/LayoutUnauthenticated';
import BaseLayout from '../../components/BaseLayout';
import moneyFormat from '../../utils/moneyFormat'

const navbarSubItems = [
  { name: 'Voltar', url: '/aircrafts' }
];

export default function AircraftDetails({ aircraft }) {
  const { data: session } = useSession();
  const router = useRouter();
  if (!session) { return <LayoutUnauthenticated />; }

  // Reading all user data from sessionStorage
  const properties = ['_id', 'name', 'email', 'airline', 'color'];
  const userData = {};
  properties.forEach(property => {
    userData[property] = sessionStorage.getItem(property);
  });
  if (!userData._id) {
    router.push('/');
    return;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const data = {
      userId: userData._id,
      model: aircraft.model,
      price: aircraft.price
    };
    const response = await fetch(`/api/aircrafts/${aircraft._id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Indicate JSON content
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      router.replace(router.asPath);
    } else {
      console.error('Error purchasing aircraft');
    }
  };

  return (
    <BaseLayout subtitle={`Aeronave ${aircraft._id}`} navbarSubItems={navbarSubItems} icon="/images/aircrafts-color-icon.svg" color="#212529" description={"Detalhes"}>
      {aircraft ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <fieldset disabled>
              <label htmlFor="model" className="form-label">Modelo:</label><br />
              <input className="form-control" type="text" id="model" name="model" value={aircraft.model} readOnly/><br />
            </fieldset>
            <fieldset disabled>
              <label htmlFor="price" className="form-label">Preco:</label><br />
              <input className="form-control" type="text" id="price" name="price" value={moneyFormat(aircraft.price)} readOnly/><br />
            </fieldset>
            { aircraft.airline === null ? (
              <>
                <input type="hidden" id="userId" name="userId" value={userData._id} />
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-secondary">Comprar</button>
                </div>
              </>
            ) : ("") }
          </div>
        </form>
      ) : (
        <p>Loading...</p>
      )}
    </BaseLayout>
  );
}

export async function getServerSideProps(context) {
  // Fetch aircraft data using the id from a service or API
  const response = await fetch(`${process.env.VERCEL_URL}/api/aircrafts/${context.query.id}`);
  const aircraft = await response.json();

  return {
    props: {
      aircraft,
    },
  };
}
