import React from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function LayoutLogin() {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link rel="icon" href="/images/favicon.svg" />
        <title>Airline Game | Login</title>
        <link href="/css/login.css" rel="stylesheet" />
      </Head>

      <div className="text-center">
        <form className="form-signin">
          <img className="mb-4" src="http://localhost:3000/images/favicon.svg" alt="" width="100" height="100" />
          <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
          <button onClick={() => signIn('azure-ad')}>Sign in</button>
          <p className="mt-5 mb-3 text-muted">2023 @ Airline Game</p>
        </form>
      </div>
    </>
  );
}
