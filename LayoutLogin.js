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
        <link href="/css/bootstrap.min.css" rel="stylesheet" />
        <link href="/css/signin-page.css" rel="stylesheet" />
      </Head>

      <div className="text-center">
        <form className="form-signin">
          <img className="mb-4" src="http://localhost:3000/images/favicon.svg" alt="" width="100" height="100" />
          <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
          <button onClick={() => signIn('azure-ad')}>Sign in</button>
          <button onClick={() => signIn('azure-ad')} className="btn btn-lg btn-secondary btn-block">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-microsoft" viewBox="0 0 16 16">
              <path d="M7.462 0H0v7.19h7.462V0zM16 0H8.538v7.19H16V0zM7.462 8.211H0V16h7.462V8.211zm8.538 0H8.538V16H16V8.211z"></path>
            </svg> Login
          </button>
          <p className="mt-5 mb-3 text-muted">2023 @ Airline Game</p>
        </form>
      </div>
    </>
  );
}
