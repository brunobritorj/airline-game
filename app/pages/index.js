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
          return; // Add this line to stop further execution
        } else if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // Parse response as JSON to the next step (.then)
      })
      .then(data => {
        if (data) {

          // Save user data to sessionStorage
          Object.entries(data).forEach(([key, value]) => {
            if (typeof value != 'object' && value !== null) {
              sessionStorage.setItem(key, value);
            }
          });

          router.push('/feed'); // Navigate to /feed if user already exists
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
}
