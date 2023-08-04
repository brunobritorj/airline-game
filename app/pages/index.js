import { useSession } from 'next-auth/react';
import LayoutAuthenticated from '../components/LayoutAuthenticated';
import LayoutUnauthenticated from '../components/LayoutUnauthenticated';

export default function Home() {
  const { data: session } = useSession();

  if (!session) {
    return <LayoutUnauthenticated />;
  } else {
    return <LayoutAuthenticated title="Airline Game | Home">
        <h1>Hello World!</h1>
        {session && <p>Welcome, {session.user.name}!</p>}
      </LayoutAuthenticated>;

  }

}
