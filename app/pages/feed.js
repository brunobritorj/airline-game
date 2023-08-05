import { useSession } from 'next-auth/react';
import LayoutUnauthenticated from '../components/LayoutUnauthenticated';
import BaseLayout from '../components/BaseLayout';
import DivListItems from '../components/div/DivListItems';
import DivListNews from '../components/div/DivListNews'

const navbarSubItems = [
  { name: 'All', url: '/feed' },
  { name: 'Mine', url: '/feed?mine' },
  { name: 'Market', url: '/feed?market' },
]

export default function pageNews() {
  const { data: session } = useSession();
  if (!session) { return <LayoutUnauthenticated />; }

  const news = {
    title: "Recent news",
    items: [
      {
        color: "blue",
        name: "@username1",
        text: "Some text here regarding the user blue"
      },
      {
        color: "red",
        name: "@username2",
        text: "Some text here related to a new route that has started"
      }
    ],
    bottomText: "All news",
    bottonLink: "/"
  }

  return (
    <BaseLayout subtitle="Feed" color="silver" icon="/images/feed-color-icon.svg" description="Mantenha-se informado aqui" navbarSubItems={navbarSubItems}>
      <p>Bem vindo, {session.user.name}!</p>
      <DivListNews news={news}/>
    </BaseLayout>
  );

}
