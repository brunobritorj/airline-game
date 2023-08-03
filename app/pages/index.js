import { useSession } from 'next-auth/react';
import Layout from '../components/Layout';

export default function Home() {
  const { data: session } = useSession();

  if (!session) {
    return <Layout />;
  } else {
    return <Layout title="Airline Game | Home">
        <h1>Hello World!</h1>
        {session && <p>Welcome, {session.user.email}!</p>}
      </Layout>;

  }
}
