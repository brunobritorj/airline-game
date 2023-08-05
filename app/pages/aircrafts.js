import { useSession } from 'next-auth/react';
import LayoutUnauthenticated from '../components/LayoutUnauthenticated';
import BaseLayout from '../components/BaseLayout';
import DivListItems from '../components/div/DivListItems';

const navbarSubItems = [
  { name: 'All', url: '/aircrafts' },
  { name: 'Mine', url: '/aircrafts?mine' },
  { name: 'Market', url: '/aircrafts?market' },
]

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

export default function pageAircrafts() {
  const { data: session } = useSession();
  if (!session) { return <LayoutUnauthenticated />; }

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
    <BaseLayout subtitle="Aeronaves" color="silver" icon="/images/aircrafts-color-icon.svg" description="Gerencie as aeronaves aqui" navbarSubItems={navbarSubItems}>
      <p>Bem vindo, {session.user.name}!</p>
      <DivListItems genericItems={genericItems}/>
    </BaseLayout>
  );

}
