import React from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { signOut, useSession } from 'next-auth/react';

export default function LayoutAuthenticated({ title = 'Airline Game', children }) {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" type="image/x-icon" href="/images/favicon.svg"></link>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
          crossOrigin="anonymous"
        />
      </Head>
      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4"
        crossOrigin="anonymous"
      />
      <div>
        <header>
          <nav>
            <div>
              <p>{session.user.email}</p>
              <button onClick={() => signOut()}>Sign out</button>
            </div>
          </nav>
        </header>
        <main>
          {children}
        </main>
        <footer>...</footer>
      </div>
    </>
  );
}
