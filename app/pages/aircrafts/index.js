import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import LayoutUnauthenticated from '../../components/LayoutUnauthenticated';
import BaseLayout from '../../components/BaseLayout';
import DivListAircrafts from '../../components/div/DivListAircrafts';

const navbarSubItems = [
  { name: 'Todas', url: '/aircrafts' },
  { name: 'Minha frota', url: '/aircrafts?filter=mine' },
  { name: 'Concorrentes', url: '/aircrafts?filter=rivals' },
  { name: 'Loja', url: '/aircrafts?filter=sale' },
];

export default function PageAircrafts() {
  const { data: session } = useSession();
  const router = useRouter();

  // Accessing query parameters
  const { filter } = router.query;

  // State variable for aircrafts
  const [aircraftsData, setAircraftsData] = useState(null);

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
      // Fetch aircrafts from an API endpoint
      let url = '/api/aircrafts'
      if (filter === 'mine') { url = `/api/aircrafts?airline=${userData._id}`}
      else if (filter === 'rivals') { url = `/api/aircrafts?airline=!${userData._id}`}
      else if (filter === 'sale') { url = `/api/aircrafts?airline=none`}
      fetch(url) // Replace with your actual API endpoint
        .then(response => response.json())
        .then(data => {
          setAircraftsData(data);
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
    <BaseLayout subtitle="Aeronaves" navbarSubItems={navbarSubItems} icon="/images/aircrafts-color-icon.svg" color={sessionStorage.getItem('color')} description="Gerencie as aeronaves aqui!">
      {aircraftsData && <DivListAircrafts aircrafts={aircraftsData} />} {/* Render only when aircraftsData is available */}
    </BaseLayout>
  );
}
