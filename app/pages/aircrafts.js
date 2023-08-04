import { useSession } from 'next-auth/react';
import Layout from '../components/Layout';

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

  return (
    <Layout subtitle="Aircrafts" icon="/images/aircrafts-icon.svg" navbarSubItems={navbarSubItems}>
      <p>Welcome, {session.user.name}!</p>
    </Layout>
  );

}
