import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router'; // Import from 'next/router' instead of 'next/navigation'
import LayoutUnauthenticated from '../components/LayoutUnauthenticated';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter(); // Use the useRouter hook

  if (!session) {
    return <LayoutUnauthenticated />;
  }
  else {
    router.push('/feed');
    return null;
  }

}
