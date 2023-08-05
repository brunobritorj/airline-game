import { useEffect } from 'react';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import LayoutLogout from '../components/LayoutLogout';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push('/');
    }
  }, [session, router]);

  return (
    <LayoutLogout>
      {session && <p>Are you sure, {session.user.name}?</p>}
    </LayoutLogout>
  );
}
