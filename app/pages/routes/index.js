import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import LayoutUnauthenticated from '../../components/LayoutUnauthenticated';
import BaseLayout from '../../components/BaseLayout';
import DivListItems from '../../components/div/DivListItems';

const navbarSubItems = [
  { name: 'Todas', url: '/routes' },
  { name: 'Minhas rotas', url: '/routes?filter=mine' },
  { name: 'Concorrentes', url: '/routes?filter=rivals' },
  { name: 'Nova rota!', url: '/routes/new' },
];

export default function PageRoutes() {
  const { data: session } = useSession();
  const router = useRouter();
  if (!session) { return <LayoutUnauthenticated />; }

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
  
  const genericItems = {
    title: "Recent updates",
    items: [
      {
        color: "blue",
        name: "GIG-CDG",
        text: "+$1M /mes",
        link: {
          name: "Ver",
          url: "/id"
        }
      },
      {
        color: "red",
        name: "GIG-GRU",
        text: "+$500K /mes",
        link: {
          name: "Ver",
          url: "/id"
        }
      }
    ],
  }

  return (
    <BaseLayout subtitle="Rotas" color={sessionStorage.getItem('color')} icon="/images/routes-color-icon.svg" description="Gerencie rotas aereas aqui!" navbarSubItems={navbarSubItems}>
      {genericItems && <DivListItems genericItems={genericItems}/>} {/* Render only when genericItems is available */}
    </BaseLayout>
  );

}
