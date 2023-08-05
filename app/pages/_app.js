import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css';
import '../styles/offcanvas.css';
import '../styles/custom.css';

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
