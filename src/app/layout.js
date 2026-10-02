import { Outfit } from 'next/font/google';
import ClientLoader from '@/components/common/ClientLoader';
import './globals.css';

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

config.autoAddCss = false;

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
});

export const metadata = {
  title: 'Code Collab - Realtime Collaborative Code Editor',
  description: 'A seamless, realtime collaborative coding platform powered by WebRTC.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} bg-background-dark text-white antialiased min-h-screen`}>
        <ClientLoader>
          {children}
        </ClientLoader>
      </body>
    </html>
  );
}
