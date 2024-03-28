import type { Metadata } from 'next';
import { Fira_Mono } from 'next/font/google';

import './globals.css';

import { Providers } from './Providers';

const firaMono = Fira_Mono({
  weight: ['400', '500', '700'],
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-fira-mono',
});

export const metadata = {
  title: 'The Graph | NextJS App Router Subgraph Querying Example',
  description:
    'Demos how to query the Graph Network Arbitrum Subgraph published to The Graph Network using an API Key obtained on The Graph Studio in a NextJS application using the nextjs app router',
} satisfies Metadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${firaMono.variable}`}>
      <head>
        <link rel="shortcut icon" type="image/x-icon" href="https://storage.googleapis.com/graph-web/favicon.png" />
      </head>
      <body className="m-0 p-0 bg-white text-gray-900 dark:bg-slate-900 dark:text-white font-mono w-full h-full min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
