import { getAllNews, getAllPublications, getIndexContent } from '../lib/contentful';
import Head from 'next/head';

export default function Home({ latestNews, latestPublication, indexContent, preview }) {
  return (
    <>
      <Head>
        <title>Library Futures</title>
        <meta 
          name="description" 
          content="Research and advocacy for the future of libraries." 
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {preview && (
        <div style={{ 
          backgroundColor: '#ff0000', 
          color: 'white', 
          padding: '10px', 
          textAlign: 'center',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000
        }}>
          Preview Mode - <a href="/api/exit-preview" style={{ color: 'white' }}>Exit Preview</a>
        </div>
      )}

      <main role="main" id="main" className={`index ${preview ? 'preview-mode' : ''}`}>
        {/* Navigation placeholder */}
        <div className="row expanded section--gray top-section">
          <div className="column large-5 medium-12 small-12">
            <h1 className="visually-hidden">Library Futures</h1>
            <div className="main-header" aria-hidden="true">
              <img 
                id="main-logo" 
                src="/images/lf-vertical-lockup-color.svg" 
                alt="Library Futures Logo"
              />
            </div>
            <p>
              We mobilize a community of experts to encourage the adoption of technologies 
              that uplift libraries in the digital age, promoting new possibilities for 
              preservation of and unfettered access to information.
            </p>
            
            {/* Email signup form */}
            <div className="form">
              <div id="mc_embed_signup">
                <form 
                  className="field-row" 
                  action="https://libraryfutures.us2.list-manage.com/subscribe/post?u=e46ce6c2905a00acf5c43debe&amp;id=2c035225f5&amp;f_id=00439fe3f0" 
                  method="post" 
                  id="mc-embedded-subscribe-form" 
                  name="mc-embedded-subscribe-form"
                  target="_blank"
                >
                  <input 
                    type="email" 
                    name="EMAIL" 
                    className="required email" 
                    id="mce-EMAIL" 
                    required 
                    placeholder="Email address"
                  />
                  <div className="clear">
                    <input 
                      type="submit" 
                      name="subscribe" 
                      id="mc-embedded-subscribe" 
                      className="button" 
                      value="Get updates"
                    />
                  </div>
                  <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
                    <input type="text" name="b_e46ce6c2905a00acf5c43debe_2c035225f5" tabIndex="-1" />
                  </div>
                </form>
              </div>
              <p>
                Library Futures is a project of{' '}
                <a href="https://www.nyuengelberg.org">
                  The Engelberg Center on Innovation Law & Policy at NYU Law
                </a>.
              </p>
              <div className="button-container">
                <a className="button button--arrow" href="/our-work">What we do</a>
                <a className="button button--arrow" href="/who-we-are">Who we are</a>
              </div>
            </div>
          </div>
          
          <div className="column large-6 large-offset-1 no-padding medium-12 small-12">
            <h2 className="heading-c">The latest</h2>
            
            {latestNews && (
              <div className="card-featured">
                <h3>
                  <a href={`/post/${latestNews.fields.pretty_url}`}>
                    {latestNews.fields.title}
                  </a>
                </h3>
                <p>{latestNews.fields.subtitle}</p>
                <time>
                  {new Date(latestNews.fields.publication_date).toLocaleDateString()}
                </time>
              </div>
            )}
            
            <div className="button-container button-container--right">
              <a className="button button--arrow" href="/blog">All posts</a>
            </div>
          </div>
        </div>

        {/* Publications section */}
        <div className="row expanded inverted-section">
          <div className="column large-4 medium-12 small-12 no-padding">
            {latestPublication && (
              <div className="card-publication">
                <h3>
                  <a href={`/publications/${latestPublication.fields.pretty_url}`}>
                    {latestPublication.fields.title}
                  </a>
                </h3>
                <p>{latestPublication.fields.subtitle}</p>
              </div>
            )}
          </div>
          <div className="column large-7 large-offset-1 medium-12 small-12">
            <p>
              <a className="link link--arrow inverted" href="/publications">
                See all publications
              </a>
            </p>
            <h3 className="heading-b">Or, see what else we do:</h3>
            <p>
              <a className="link link--arrow inverted" href="https://cats.libraryfutures.net">
                CATS: a twice-monthly newsletter about copyright and technology
              </a>
            </p>
            <p>
              <a className="link link--arrow inverted" href="https://www.controlleddigitallending.org">
                Controlled Digital Lending: loan print books to digital patrons
              </a>
            </p>
            <p>
              <a className="link link--arrow inverted" href="https://ebooksforus.com">
                E-books for Us: comics on the real cost of library e-books
              </a>
            </p>
          </div>
        </div>

        {/* Blog posts section */}
        <div className="row expanded twitter-news-container">
          <div className="column">
            <h3 className="heading-b">More from our Blog</h3>
            <a className="link link--arrow" href="/blog">All Posts</a>
            {/* This will be populated with more blog posts */}
          </div>
        </div>
      </main>
    </>
  );
}

export async function getStaticProps({ preview = false }) {
  try {
    const [newsItems, publications, indexContent] = await Promise.all([
      getAllNews(preview),
      getAllPublications(preview),
      getIndexContent(preview),
    ]);

    const latestNews = newsItems[0] || null;
    const latestPublication = publications[0] || null;

    return {
      props: {
        latestNews,
        latestPublication,
        indexContent,
        preview,
      },
      // ISR: Revalidate every 30 minutes in production
      revalidate: 30 * 60,
    };
  } catch (error) {
    console.error('Error in getStaticProps for home page:', error);
    
    return {
      props: {
        latestNews: null,
        latestPublication: null,
        indexContent: null,
        preview,
      },
      revalidate: 30 * 60,
    };
  }
}