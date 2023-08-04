import { useSession } from 'next-auth/react';
import Layout from '../components/Layout';
import DivListItems from '../components/div/DivListItems'

const navbarSubItems = [
  { name: 'All', url: '/aircrafts' },
  { name: 'Mine', url: '/aircrafts?mine' }
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

  return (
    <Layout subtitle="News" icon="/images/news-icon.svg" navbarSubItems={navbarSubItems}>
      <p>Welcome, {session.user.name}!</p>
      <DivListItems />
    </Layout>
  );
}
