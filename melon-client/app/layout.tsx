import { Metadata } from 'next'
import 'bootstrap/dist/css/bootstrap.min.css';
 
export const metadata: Metadata = {
  title: 'Melon Brain',
}

function RootLayout({ children, }: {children: React.ReactNode;}) {
  return (
    <html>
        {children}
    </html>
 );
}

export default RootLayout;
