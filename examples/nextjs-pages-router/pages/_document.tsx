import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="shortcut icon" type="image/x-icon" href="https://storage.googleapis.com/graph-web/favicon.png" />
      </Head>
      <body className="m-0 p-0 bg-white text-gray-900 dark:bg-slate-900 dark:text-white font-mono w-full h-full min-h-screen">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
