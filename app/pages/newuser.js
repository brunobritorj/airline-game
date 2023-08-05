import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import LayoutUnauthenticated from '../components/LayoutUnauthenticated';

export default function NewUser() {
  const { data: session } = useSession();
  const router = useRouter();

  const createUser = async () => {
    try {
      const createUserResponse = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: session.user.name,
          email: session.user.email,
        }),
      });

      if (!createUserResponse.ok) {
        throw new Error('Error creating user');
      }

      router.push('/feed'); // Navigate to /feed on successful user creation
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  if (!session) {
    return <LayoutUnauthenticated />;
  } else {
    createUser();
    return null;
  }

}
