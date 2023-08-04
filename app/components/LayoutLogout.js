import React, { Children } from 'react';
import Head from 'next/head';
import { signOut, useSession } from 'next-auth/react';

export default function LayoutUnauthenticated({ title = 'Airline Game | Login', children }) {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <title>{title}</title>
        <link rel="icon" type="image/x-icon" href="/images/favicon.svg"></link>
      </Head>
      <style jsx global>{`
        html,
        body {
          height: 100%;
        }
        body {
          display: -ms-flexbox;
          display: -webkit-box;
          display: flex;
          -ms-flex-align: center;
          -ms-flex-pack: center;
          -webkit-box-align: center;
          align-items: center;
          -webkit-box-pack: center;
          justify-content: center;
          padding-top: 40px;
          padding-bottom: 40px;
          background-color: #f5f5f5;
        }
      `}</style>
      <div className="text-center">
        <img className="mb-4" src="/images/favicon.svg" alt="" width="100" height="100" />
        <h1 className="h3 mb-3 font-weight-normal">{children}</h1>
        <button onClick={() => signOut()} className="btn btn-lg btn-secondary btn-block">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-microsoft" viewBox="0 0 16 16">
            <path d="M7.462 0H0v7.19h7.462V0zM16 0H8.538v7.19H16V0zM7.462 8.211H0V16h7.462V8.211zm8.538 0H8.538V16H16V8.211z"></path>
          </svg> Logout
        </button>
        <p className="mt-5 mb-3 text-muted">2023 @ Airline Game</p>
      </div>
    </>
  );
}
