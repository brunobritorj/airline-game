import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import LayoutUnauthenticated from '../../components/LayoutUnauthenticated';
import BaseLayout from '../../components/BaseLayout';
import DivAlert from '../../components/div/DivAlert'
import moneyFormat from '../../utils/moneyFormat'
import distanceFormat from '../../utils/distanceFormat'

const APP_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

const navbarSubItems = [
  { name: 'Voltar', url: '/routes' }
];

export default function AircraftDetails({ route }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [sellStatus, setSellStatus] = useState(null);

  // Reading all user data from sessionStorage
  if (!session) { return <LayoutUnauthenticated />; }
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
  
    const response = await fetch(`/api/routes/${route._id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if (response.ok) {
      setSellStatus("success");
      setTimeout(() => { router.back(); }, 1000); // This navigates the user to the previous page, waiting 1 second
    } else {
      setSellStatus("warning");
    }
  };

  return (
    <BaseLayout subtitle={`${route.src}-${route.dst}`} navbarSubItems={navbarSubItems} icon="/images/routes-color-icon.svg" color={route.color} description={"Rota"}>
      {route ? (
        <form onSubmit={handleSubmit}>
          {sellStatus === "warning" && ( <DivAlert kind={"warning"} title={"Erro!"} message={"Encerramento invalido"} /> )}
          {sellStatus === "success" && ( <DivAlert kind={"success"} title={"Successo!"} message={"Encerramento realizado"} /> )}
          <div className="mb-3">
            <fieldset disabled>
              <label htmlFor="aircraft" className="form-label">Aeronave:</label><br />
              <input className="form-control" type="text" id="aircraft" name="aircraft" value={route.aircraft} readOnly/>
            </fieldset>
          </div>
          <div className="mb-3">
            <fieldset disabled>
              <label htmlFor="distance" className="form-label">Distância:</label><br />
              <input className="form-control" type="text" id="distance" name="distance" value={distanceFormat(route.distance)} readOnly/>
            </fieldset>
          </div>
          <div className="mb-3">
            <fieldset disabled>
              <label htmlFor="airport" className="form-label">Fluxo mensal:</label><br />
              <input className="form-control" type="text" id="airport" name="airport" value={moneyFormat(route.profitMontly)} readOnly/>
            </fieldset>
          </div>
          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-danger">Encerrar rota</button>
          </div>
        </form>
      ) : (
        <p>Loading...</p>
      )}
    </BaseLayout>
  );
}

export async function getServerSideProps(context) {
  // Fetch route data using the id from a service or API
  const response = await fetch(`${APP_URL}/api/routes/${context.query.id}`);
  const route = await response.json();

  return {
    props: {
      route,
    },
  };
}
