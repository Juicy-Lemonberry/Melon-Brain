import Head from 'next/head'

import 'bootstrap/dist/css/bootstrap.min.css';

function RootLayout({ children, }: {children: React.ReactNode;}) {
  return (
    <html>
        <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            <title>Melon Brain</title>
        </Head>
        {children}
    </html>
 );
}

export default RootLayout;
