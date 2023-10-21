import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import LayoutUnauthenticated from '../../components/LayoutUnauthenticated';
import BaseLayout from '../../components/BaseLayout';
import DivRoutesMap from '../../components/div/DivRoutesMap';

const navbarSubItems = [
  { name: 'Todas', url: '/routes' },
  { name: 'Minhas rotas', url: '/routes?filter=mine' },
  { name: 'Concorrentes', url: '/routes?filter=rivals' },
  { name: 'Mapa', url: '/routes/map' },
  { name: 'Nova rota', url: '/routes/new' },
];

export default function PageRoutes() {
  const { data: session } = useSession();
  const router = useRouter();

  // Accessing query parameters
  const { filter } = router.query;

  // State variable for routes
  const [routesData, setRoutesData] = useState(null);

  useEffect(() => {
    // Reading all user data from sessionStorage
    const properties = ['_id', 'name', 'email', 'airline', 'color'];
    const userData = {};
    properties.forEach(property => {
      userData[property] = sessionStorage.getItem(property);
    });
    if (!userData._id) {
      router.push('/');
      return;
    } else {
      // Fetch aircrafts from an API endpoint
      let url = '/api/routes'
      if (filter === 'mine') { url = `/api/routes?airline=${userData._id}`}
      else if (filter === 'rivals') { url = `/api/routes?airline=!${userData._id}`}
      fetch(url)
        .then(response => response.json())
        .then(data => {
          setRoutesData(data);
          console.log(data);
        })
        .catch(error => {
          console.error('An error occurred while fetching data:', error);
        });
    }
  }, [filter]);

  if (!session) {
    return <LayoutUnauthenticated />;
  }

  return (
    <BaseLayout subtitle="Rotas" color={sessionStorage.getItem('color')} icon="/images/routes-color-icon.svg" description="Gerencie rotas aereas aqui!" navbarSubItems={navbarSubItems}>
      {routesData && <DivRoutesMap routes={routesData}/>} {/* Render only when routesData is available */}
    </BaseLayout>
  );

}
