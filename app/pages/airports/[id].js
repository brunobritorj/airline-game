// pages/airports/[id].js

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import LayoutUnauthenticated from '../../components/LayoutUnauthenticated';
import BaseLayout from '../../components/BaseLayout';
import moneyFormat from '../../utils/moneyFormat'
import DivAlert from '../../components/div/DivAlert'

const APP_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

const navbarSubItems = [
  { name: 'Voltar', url: '/airports' }
];

export default function AirportDetails({ airport }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [alertStatus, setAlertStatus] = useState(null);
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
      model: airport.model,
      price: airport.price
    };
    const response = await fetch(`/api/airports/${airport._id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Indicate JSON content
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      setAlertStatus({
        kind: "success",
        title: "Negócio fechado!",
        msg: "Você possui licença para operar no aerporto"
      });
    } else {
      const errorData = await response.json();
      setAlertStatus({
        kind: "danger",
        title: "Erro!",
        msg: errorData.error
      });
    }

  };

  return (
    <BaseLayout subtitle={`${airport.iata} | ${airport.airport}`} navbarSubItems={navbarSubItems} icon="/images/airports-color-icon.svg" color={airport.color} description={`${airport.city} - ${airport.country}`}>
      {airport ? (
        <form onSubmit={handleSubmit}>
          {alertStatus && (<DivAlert kind={alertStatus.kind} title={alertStatus.title} message={alertStatus.msg} />)}
          <div className="mb-3">
            <fieldset disabled>
              <label htmlFor="price" className="form-label">Preço:</label><br />
              <input className="form-control" type="text" id="price" name="price" value={moneyFormat(airport.price)} readOnly/><br />
            </fieldset>
            { airport.airline === null ? (
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
  const response = await fetch(`${APP_URL}/api/airports/${context.query.id}`);
  const airport = await response.json();
  return {
    props: {
      airport,
    },
  };
}
