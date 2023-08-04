import { useSession } from 'next-auth/react';
import LayoutLogout from '../components/LayoutLogout';
import LayoutUnauthenticated from '../components/LayoutUnauthenticated';

export default function Home() {
  const { data: session } = useSession();

  if (!session) {
    return <LayoutUnauthenticated />;
  } else {
    return <LayoutLogout>{session && <p>Are you sure, {session.user.name}?</p>}</LayoutLogout>;
  }

}
