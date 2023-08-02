import { signIn, signOut, useSession } from 'next-auth/react';

export default function Layout({ title, children }) {
  const { data: session } = useSession();

  return (
    <div>
      <header>
        <nav>
          {!session ? (
            <button onClick={() => signIn('azure-ad')}>Sign in</button>
          ) : (
            <div>
              <p>Welcome, {session.user.email}!</p>
              <button onClick={() => signOut()}>Sign out</button>
            </div>
          )}
        </nav>
      </header>
      <main>
        <h1>{title}</h1>
        {children}
      </main>
      <footer>...</footer>
    </div>
  );
}
