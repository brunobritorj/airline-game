import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import LayoutUnauthenticated from '../components/LayoutUnauthenticated';
import BaseLayout from '../components/BaseLayout';
import DivListAircrafts from '../components/div/DivListAircrafts';

const navbarSubItems = [
  { name: 'Todas', url: '/aircrafts' },
  { name: 'Minha frota', url: '/aircrafts?filter=mine' },
  { name: 'Concorrentes', url: '/aircrafts?filter=rivals' },
  { name: 'À venda', url: '/aircrafts?filter=sale' },
];

export default function PageNews() {
  const { data: session } = useSession();
  const router = useRouter();

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
      fetch('/api/aircrafts') // Replace with your actual API endpoint
        .then(response => response.json())
        .then(data => {
          setAircraftsData(data);
          console.log(data);
        })
        .catch(error => {
          console.error('An error occurred while fetching data:', error);
        });
    }
  }, []); // Run this effect only once, when the component mounts

  if (!session) {
    return <LayoutUnauthenticated />;
  }
  
  return (
    <BaseLayout subtitle="Aeronaves" navbarSubItems={navbarSubItems} icon="/images/aircrafts-color-icon.svg" color={sessionStorage.getItem('color')} description="Gerencie as aeronaves aqui!">
      {aircraftsData && <DivListAircrafts aircrafts={aircraftsData} />} {/* Render only when aircraftsData is available */}
    </BaseLayout>
  );
}
