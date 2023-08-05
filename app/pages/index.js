import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import LayoutUnauthenticated from '../components/LayoutUnauthenticated';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    return <LayoutUnauthenticated />;
  } else {
    fetch(`/api/users?email=${session.user.email}`)
      .then(async response => {
        if (response.status === 404) {
          router.push('/newuser'); // First access of the user, redirect to create it in the DB
        } else if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        return response.json(); // Parse response as JSON
      })
      .then(data => {
        console.log('User Data:', data);
        router.push('/feed'); // Navigate to /feed if user alread exists
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
}
