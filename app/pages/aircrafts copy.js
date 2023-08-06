import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import LayoutUnauthenticated from '../components/LayoutUnauthenticated';
import BaseLayout from '../components/BaseLayout';
import DivListItems from '../components/div/DivListItems';

const navbarSubItems = [
  { name: 'Todas', url: '/aircrafts' },
  { name: 'Minha frota', url: '/aircrafts?filter=mine' },
  { name: 'Concorrentes', url: '/aircrafts?filter=rivals' },
  { name: 'À venda', url: '/aircrafts?filter=sale' },
]

export default function pageAircrafts() {
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
  
  const genericItems = {
    title: "Recent updates",
    items: [
      {
        color: "blue",
        name: "Aircraft A",
        text: "GIG-SDU",
      },
      {
        color: "red",
        name: "Aircraft B",
        text: "$ 300",
        link: {
          name: "Visitar",
          url: "/aircrafts/id_here"
        }
      }
    ],
    bottomText: "All",
    bottonLink: "/"
  }

  return (
    <BaseLayout subtitle="Aeronaves" color={sessionStorage.getItem('color')} icon="/images/aircrafts-color-icon.svg" description="Gerencie as aeronaves aqui" navbarSubItems={navbarSubItems}>
      <DivListItems genericItems={genericItems}/>
    </BaseLayout>
  );

}
