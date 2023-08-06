import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
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
    <BaseLayout subtitle="Aeronaves" color={sessionStorage.getItem('color')} icon="/images/aircrafts-color-icon.svg" description="Gerencie as aeronaves aqui" navbarSubItems={navbarSubItems}>
      <DivListItems genericItems={genericItems}/>
    </BaseLayout>
  );

}
