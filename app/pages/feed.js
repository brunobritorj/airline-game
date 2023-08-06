import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'; // Import useState and useEffect
import LayoutUnauthenticated from '../components/LayoutUnauthenticated';
import BaseLayout from '../components/BaseLayout';
import DivListNews from '../components/div/DivListNews'
import DivListAssets from '../components/div/DivListAssets';
import moneyFormat from '../utils/moneyFormat'

const navbarSubItems = [
  { name: 'Todas', url: '/feed' },
  //{ name: 'Minhas', url: '/feed?filter=mine' },
  //{ name: 'Concorrentes', url: '/feed?filter=rival' },
  //{ name: 'Outros', url: '/feed?filter=others' },
]

export default function PageNews() {
  const { data: session } = useSession();
  const router = useRouter();
  const [newsData, setNewsData] = useState(); // State to hold fetched data
  const [assetsData, setAssetsData] = useState([
    {
      icon: "/images/bank-color-icon.svg",
      name: "Saldo bancário",
      text: "Carregando ..."
    },
  ]); // State to hold fetched data, with default value of loading
  
  // Accessing query parameters
  const { filter } = router.query;

  useEffect(() => {
    // Test if user has a session
    if (!session) {
      router.push('/');
      return;
    }

    // Reading all user data from sessionStorage
    const properties = ['_id', 'name', 'email', 'airline', 'color'];
    const userData = {};
    properties.forEach(property => {
      userData[property] = sessionStorage.getItem(property);
    });
    if (!userData._id) {
      router.push('/');
      return;
    }
    else {
      fetch(`/api/feedpage?email=${session.user.email}`)
        .then(async response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          if (data) {
            const assets = [
              {
                icon: "/images/bank-color-icon.svg",
                name: "Saldo bancário",
                text: moneyFormat(data.userData.assets.cash)
              },
            ];
            setAssetsData(assets); // Store fetched data in state
            const news = {
              title: "Notícias recentes",
              items: data.feedData
            };
            setNewsData(news); // Store fetched data in state
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }, [session, router]);

  if (!session) {
    return <LayoutUnauthenticated />;
  }
  
  return (
    <BaseLayout subtitle="Feed" navbarSubItems={navbarSubItems} icon="/images/feed-color-icon.svg" color={sessionStorage.getItem('color')} description="Mantenha-se informado aqui!">
      <p>Bem vindo, {session.user.name}!</p>
      {assetsData && <DivListAssets assets={assetsData} />} {/* Render only when newsData is available */}
      {newsData && <DivListNews news={newsData} />}
    </BaseLayout>
  );
}
