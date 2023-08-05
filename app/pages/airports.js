import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import LayoutUnauthenticated from '../components/LayoutUnauthenticated';
import BaseLayout from '../components/BaseLayout';
import DivListItems from '../components/div/DivListItems';

const navbarSubItems = [
  { name: 'All', url: '/airports' },
  { name: 'Mine', url: '/airports?mine' },
  { name: 'Market', url: '/airports?market' },
]


export default function pageAirports() {
  const { data: session } = useSession();
  const router = useRouter();
  if (!session) { return <LayoutUnauthenticated />; }

  const userName = sessionStorage.getItem('userName')
  const userEmail = sessionStorage.getItem('userEmail')
  const userAirline = sessionStorage.getItem('userAirline')
  const userColor = sessionStorage.getItem('userColor')
  if (!userName || !userEmail || !userAirline || !userColor) { router.push('/')}
  
  const genericItems = {
    title: "Recent updates",
    items: [
      {
        color: "blue",
        name: "Aircraft A",
        text: "$100",
        link: {
          name: "Buy",
          url: "/post/1"
        }
      },
      {
        color: "red",
        name: "Aircraft B",
        text: "$300",
        link: {
          name: "Sell",
          url: "/post/2"
        }
      }
    ],
    bottomText: "All",
    bottonLink: "/"
  }

  return (
    <BaseLayout subtitle="Aeroportos" color={userColor} icon="/images/airports-color-icon.svg" description="Gerencie aeroportos aqui" navbarSubItems={navbarSubItems}>
      <p>Bem vindo, {session.user.name}!</p>
      <DivListItems genericItems={genericItems}/>
    </BaseLayout>
  );

}
