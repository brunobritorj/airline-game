import { useSession } from 'next-auth/react';
import Layout from '../components/Layout';

export default function Protected() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Layout title="Airline Game | Protected">
        <p>You need to sign in to access this page.</p>
      </Layout>
    );
  }

  return (
    <Layout title="Airline Game | Protected">
      <h1>Protected Page</h1>
      <p>Welcome, {session.user.email}!</p>
    </Layout>
  );
}
