import Head from 'next/head';

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Research and advocacy for the future of libraries." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="site-wrapper">
        {/* Navigation could be added here */}
        <header>
          {/* Header content */}
        </header>
        
        <main>
          {children}
        </main>
        
        <footer>
          {/* Footer content */}
        </footer>
      </div>
    </>
  );
}