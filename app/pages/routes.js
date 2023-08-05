import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import LayoutUnauthenticated from '../components/LayoutUnauthenticated';
import BaseLayout from '../components/BaseLayout';
import DivListItems from '../components/div/DivListItems';

const navbarSubItems = [
  { name: 'All', url: '/routes' },
  { name: 'Mine', url: '/routes?mine' },
  { name: 'Market', url: '/routes?market' },
]


export default function pageRoutes() {
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
    <BaseLayout subtitle="Rotas" color={userColor} icon="/images/routes-color-icon.svg" description="Gerencie rotas aereas aqui" navbarSubItems={navbarSubItems}>
      <p>Bem vindo, {session.user.name}!</p>
      <DivListItems genericItems={genericItems}/>
    </BaseLayout>
  );

}
