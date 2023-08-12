import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import LayoutUnauthenticated from '../../components/LayoutUnauthenticated';
import BaseLayout from '../../components/BaseLayout';
import DivListAirports from '../../components/div/DivListAirports';

const navbarSubItems = [
  { name: 'Todos', url: '/airports' },
  { name: 'Meus hubs', url: '/airports?filter=mine' },
  { name: 'Concorrentes', url: '/airports?filter=rivals' },
  { name: 'Hubs disponiveis', url: '/airports?filter=sale' },
];

export default function PageNews() {
  const { data: session } = useSession();
  const router = useRouter();

  // Accessing query parameters
  const { filter } = router.query;

  // State variable for airports
  const [airportsData, setAirportsData] = useState(null);

  useEffect(() => {
    // Reading all user data from sessionStorage
    const properties = ['_id', 'name', 'email', 'airline', 'color'];
    const userData = {};
    properties.forEach(property => {
      userData[property] = sessionStorage.getItem(property);
    });
    if (!userData._id) {
      router.push('/');
    } else {
      // Fetch airports from an API endpoint
      let url = '/api/airports'
      if (filter === 'mine') { url = `/api/airports?airline=${userData._id}`}
      else if (filter === 'rivals') { url = `/api/airports?airline=!${userData._id}`}
      else if (filter === 'sale') { url = `/api/airports?airline=none`}
      fetch(url)
        .then(response => response.json())
        .then(data => {
          setAirportsData(data);
        })
        .catch(error => {
          console.error('An error occurred while fetching data:', error);
        });
    }
  }, [filter]); // Run this effect only once, when the component mounts

  if (!session) {
    return <LayoutUnauthenticated />;
  }
  
  return (
    <BaseLayout subtitle="Aeroportos" color={sessionStorage.getItem('color')} icon="/images/airports-color-icon.svg" description="Gerencie aeroportos aqui!" navbarSubItems={navbarSubItems}>
      {airportsData && <DivListAirports airports={airportsData} />} {/* Render only when airportsData is available */}
    </BaseLayout>
  );
}
