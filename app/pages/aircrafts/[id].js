// pages/aircrafts/[id].js

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import LayoutUnauthenticated from '../../components/LayoutUnauthenticated';
import BaseLayout from '../../components/BaseLayout';
import moneyFormat from '../../utils/moneyFormat'
import DivAlert from '../../components/div/DivAlert'

const APP_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

const navbarSubItems = [
  { name: 'Voltar', url: '/aircrafts' }
];

export default function AircraftDetails({ aircraft }) {
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
  
    if (aircraft.airline === null) {
      const data = {
        userId: userData._id,
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
        setAlertStatus({
          kind: "success",
          title: "Successo!",
          msg: "Compra realizada"
        });
        router.replace(router.asPath);
      } else {
        const errorData = await response.json();
        setAlertStatus({
          kind: "danger",
          title: "Erro!",
          msg: errorData.error
        });
        router.replace(router.asPath);
      }
    }
    else {
      const data = {
        userId: userData._id,
      };
      const response = await fetch(`/api/aircrafts/${aircraft._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json', // Indicate JSON content
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setAlertStatus({
          kind: "success",
          title: "Successo!",
          msg: "Venda realizada"
        });
        router.replace(router.asPath);
      } else {
        const errorData = await response.json();
        setAlertStatus({
          kind: "danger",
          title: "Erro!",
          msg: errorData.error
        });
        router.replace(router.asPath);
      }
    }

  };
  return (
    <BaseLayout subtitle={`Aeronave ${aircraft.registration}`} navbarSubItems={navbarSubItems} icon="/images/aircrafts-color-icon.svg" color={aircraft.color} description={"Detalhes"}>
      {aircraft ? (
        <form onSubmit={handleSubmit}>
          {alertStatus && (<DivAlert kind={alertStatus.kind} title={alertStatus.title} message={alertStatus.msg} />)}
          <div className="mb-3">
            <fieldset disabled>
              <label htmlFor="range" className="form-label">Range (KM):</label><br />
              <input className="form-control" type="text" id="range" name="range" value={aircraft.range} readOnly/><br />
            </fieldset>
            <fieldset disabled>
              <label htmlFor="passengers" className="form-label">Passageiros:</label><br />
              <input className="form-control" type="text" id="passengers" name="passengers" value={aircraft.passengers} readOnly/><br />
            </fieldset>
            <fieldset disabled>
              <label htmlFor="price" className="form-label">Preço:</label><br />
              <input className="form-control" type="text" id="price" name="price" value={moneyFormat(aircraft.price)} readOnly/><br />
            </fieldset>
            <div className="d-grid gap-2">
              { aircraft.airline === null ? (
                <button type="submit" className="btn btn-secondary">Comprar</button>
              ) : (
                <button type="submit" className="btn btn-danger">Vender</button>
              ) }
            </div>
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
  const response = await fetch(`${APP_URL}/api/aircrafts/${context.query.id}`);
  const aircraft = await response.json();

  return {
    props: {
      aircraft,
    },
  };
}
