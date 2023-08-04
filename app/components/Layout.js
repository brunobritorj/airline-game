import React from 'react';
import Head from 'next/head';
import Script from 'next/script';
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react';

const navbarItems = [
  { name: 'News', url: '/news' },
  { name: 'Aircrafts', url: '/aircrafts' },
  { name: 'Airports', url: '/airports' },
  { name: 'Routes', url: '/routes' }
];

export default function LayoutAuthenticated({
    title = 'Airline Game',
    subtitle,
    icon='/images/favicon.svg',
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
      <Script
        src="/js/offcanvas.js.download"
      />
      <Script
        src="/js/bootstrap.bundle.min.js.download"
      />
      <div>
        <nav className="navbar navbar-expand-lg fixed-top navbar-dark bg-dark" aria-label="Main navigation">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">{title}</a>
            <button className="navbar-toggler p-0 border-0" type="button" id="navbarSideCollapse" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="navbar-collapse offcanvas-collapse" id="navbarsExampleDefault">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                {navbarItems.map((item, index) => (
                  <li className="nav-item" key={index}><Link className="nav-link" href={item.url}>{item.name}</Link></li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
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
          <div className="d-flex align-items-center p-3 my-3 text-white bg-purple rounded shadow-sm">
            <img className="me-3" src={icon} alt="" width="48" height="38" />
            <div className="lh-1">
              <h1 className="h6 mb-0 text-white lh-1">{subtitle}</h1>
              <small>Since 2011</small>
            </div>
          </div>
          {children}
        </main>
      </div>
    </>
  );
}
