import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'; // Import useState and useEffect
import LayoutUnauthenticated from '../components/LayoutUnauthenticated';
import BaseLayout from '../components/BaseLayout';
import DivListNews from '../components/div/DivListNews'

// navbarSubItems temporary removed
const navbarSubItems = [
  { name: 'All', url: '/feed' },
  { name: 'Mine', url: '/feed?mine' },
  { name: 'Market', url: '/feed?market' },
]

export default function PageNews() {
  const { data: session } = useSession();
  const router = useRouter();
  const [newsData, setNewsData] = useState(null); // State to hold fetched data

  useEffect(() => {
    if (!session) {
      router.push('/');
      return;
    }

    const userName = sessionStorage.getItem('userName');
    const userEmail = sessionStorage.getItem('userEmail');
    const userAirline = sessionStorage.getItem('userAirline');
    const userColor = sessionStorage.getItem('userColor');

    if (!userName || !userEmail || !userAirline || !userColor) {
      router.push('/');
      return;
    }

    fetch(`/api/feed`)
      .then(async response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data) {
          const news = {
            title: "Notícias recentes",
            items: data,
            //bottom: {
            //  "text": "Todas as notícias",
            //  "link": "/"
            //}
          };
          setNewsData(news); // Store fetched data in state
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [session, router]);

  if (!session) {
    return <LayoutUnauthenticated />;
  }

  return (
    <BaseLayout subtitle="Feed" icon="/images/feed-color-icon.svg" color={sessionStorage.getItem('userColor')} description="Mantenha-se informado aqui">
      <p>Bem vindo, {session.user.name}!</p>
      {newsData && <DivListNews news={newsData} />} {/* Render only when newsData is available */}
    </BaseLayout>
  );
}
