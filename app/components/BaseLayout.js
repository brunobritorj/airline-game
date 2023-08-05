import React from 'react';
import Head from 'next/head';
import Script from 'next/script';
import Link from 'next/link'
import { useSession } from 'next-auth/react';
import LayoutHeader from './div/LayoutHeader'

const navbarItems = [
  { name: 'News', url: '/news' },
  { name: 'Aircrafts', url: '/aircrafts' },
  { name: 'Airports', url: '/airports' },
  { name: 'Routes', url: '/routes' }
];

export default function LayoutAuthenticated({
    title = 'Airline Game',
    subtitle,
    color = "silver",
    icon = '/images/favicon.svg',
    description = "Generic description",
    navbarSubItems = [],
    navbarSubItemActive = null,
    children
  }) {

  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>{title + ' | ' + subtitle}</title>
        <link rel="icon" type="image/x-icon" href="/images/favicon.svg"></link>
      </Head>
      <Script src="/js/bootstrap.bundle.min.js.download" />
      <LayoutHeader />
      <div>
        <div className="nav-scroller bg-body shadow-sm">
          <nav className="nav" aria-label="Secondary navigation">
            {navbarSubItems.map((item, index) => (
              <React.Fragment key={index}>
                {navbarSubItemActive === item.name ? (
                  <Link className="nav-link active" aria-current="page" href={item.url}>
                    {item.name}
                  </Link>
                ) : (
                  <Link className="nav-link" href={item.url}>
                    {item.name}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>
        <main className="container">
          <div className={`d-flex align-items-center p-3 my-3 text-white rounded shadow-sm`} style={{backgroundColor:color}}>
            <img className="me-3" src={icon} alt="" width="48" height="38" />
            <div className="lh-1">
              <h1 className="h6 mb-0 text-white lh-1">{subtitle}</h1>
              <small>{description}</small>
            </div>
          </div>
          {children}
        </main>
      </div>
    </>
  );
}
