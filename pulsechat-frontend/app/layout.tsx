import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import SocketProvider from '@/contexts/SocketProvider';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PulseChat - Real-Time Messaging',
  description: 'Modern real-time chat application built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Suppress COOP warnings in development */}
        {process.env.NODE_ENV === 'development' && (
          <Script id="suppress-coop-warnings">
            {`
              const originalError = console.error;
              console.error = (...args) => {
                if (
                  typeof args[0] === 'string' &&
                  args[0].includes('Cross-Origin-Opener-Policy')
                ) {
                  return;
                }
                originalError.apply(console, args);
              };
            `}
          </Script>
        )}
        
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          <SocketProvider>{children}</SocketProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
