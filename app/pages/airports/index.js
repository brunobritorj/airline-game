import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import LayoutUnauthenticated from '../../components/LayoutUnauthenticated';
import BaseLayout from '../../components/BaseLayout';
import DivListItems from '../../components/div/DivListItems';

const navbarSubItems = [
  { name: 'Todos', url: '/airports' },
  //{ name: 'Mine', url: '/airports?mine' },
  //{ name: 'Market', url: '/airports?market' },
]

export default function pageAirports() {
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
    <BaseLayout subtitle="Aeroportos" color={sessionStorage.getItem('color')} icon="/images/airports-color-icon.svg" description="Gerencie aeroportos aqui" navbarSubItems={navbarSubItems}>
      <DivListItems genericItems={genericItems}/>
    </BaseLayout>
  );

}
