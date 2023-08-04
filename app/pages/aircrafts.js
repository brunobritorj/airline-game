import { useSession } from 'next-auth/react';
import Layout from '../components/Layout';
import DivListItems from '../components/div/DivListItems'

const navbarSubItems = [
  { name: 'All', url: '/aircrafts' },
  { name: 'Mine', url: '/aircrafts?mine' },
  { name: 'Market', url: '/aircrafts?market' },
]


export default function Protected() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Layout>
        <p>You need to sign in to access this page.</p>
      </Layout>
    );
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
    <Layout subtitle="Aircrafts" icon="/images/aircrafts-icon.svg" navbarSubItems={navbarSubItems}>
      <p>Welcome, {session.user.name}!</p>
      <DivListItems genericItems={genericItems}/>
    </Layout>
  );

}
