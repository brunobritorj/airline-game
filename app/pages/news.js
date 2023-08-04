import { useSession } from 'next-auth/react';
import Layout from '../components/Layout';
import DivListNews from '../components/div/DivListNews'

const navbarSubItems = [
  { name: 'All', url: '/aircrafts' },
  { name: 'Mine', url: '/aircrafts?mine' }
]

export default function Protected() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Layout>
        <p>You need to sign in to access this page.</p>
      </Layout>
    );
  }

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
    <Layout subtitle="News" icon="/images/news-icon.svg" navbarSubItems={navbarSubItems}>
      <p>Welcome, {session.user.name}!</p>
      <DivListNews news={news}/>
    </Layout>
  );
}
