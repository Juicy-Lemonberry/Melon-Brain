import { AppProps } from 'next/app';
import Head from 'next/head'

import 'bootstrap/dist/css/bootstrap.min.css';

function MainApp({ Component, pageProps }: AppProps) {
  return (
    <>
        <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            <title>Melon Brain</title>
        </Head>
            <Component {...pageProps} />
    </>
 );
}

export default MainApp;
