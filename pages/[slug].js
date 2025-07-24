import { getEntryBySlug, getAllSlugsForContentType, CONTENT_TYPES } from '../lib/contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Head from 'next/head';

export default function GenericPage({ page, preview }) {
  if (!page) {
    return <div>Page not found</div>;
  }

  const { fields } = page;

  return (
    <>
      <Head>
        <title>{fields.title} - Library Futures</title>
        <meta name="description" content={fields.introduction || fields.title} />
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

      <main className={`generic-layout ${preview ? 'preview-mode' : ''}`}>
        <div className="row expanded top-section--generic section--gray">
          <div className="column large-4 medium-12 small-12">
            {fields.featured_image && (
              <div 
                className="background-image-container" 
                style={{ 
                  backgroundImage: `url('https:${fields.featured_image.fields.file.url}')` 
                }}
              />
            )}
          </div>
          <div className="column large-6 large-offset-1 medium-12 small-12">
            <h1>{fields.title}</h1>
            <div className="bar" style={{ backgroundImage: "url('/images/bar-p.svg')" }}></div>
            
            {fields.introduction && (
              <div className="markdown-secondary">
                {typeof fields.introduction === 'string' ? (
                  <p>{fields.introduction}</p>
                ) : (
                  documentToReactComponents(fields.introduction)
                )}
              </div>
            )}

            {fields.button && (
              <div className="button-container">
                <a className="button button--full" href={fields.button.button_url}>
                  {fields.button.button_text}
                </a>
              </div>
            )}
          </div>
        </div>

        {fields.body && (
          <div className="row expanded">
            <div className="column large-8 large-offset-2 medium-12 small-12">
              <div className="content">
                {documentToReactComponents(fields.body)}
              </div>
            </div>
          </div>
        )}

        {fields.pinned_research && fields.pinned_research.length > 0 && (
          <div className="row expanded">
            <div className="column large-12">
              {fields.pinned_title && <h2>{fields.pinned_title}</h2>}
              <div className="cards-wrapper">
                {fields.pinned_research.map((item, index) => (
                  <div key={index} className="card">
                    <h3>
                      <a href={`/publications/${item.fields.pretty_url}`}>
                        {item.fields.title}
                      </a>
                    </h3>
                    {item.fields.subtitle && <p>{item.fields.subtitle}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export async function getStaticPaths() {
  const paths = await getAllSlugsForContentType(CONTENT_TYPES.GENERIC_PAGE);
  
  return {
    paths,
    fallback: 'blocking', // Enable ISR for new pages
  };
}

export async function getStaticProps({ params, preview = false }) {
  const page = await getEntryBySlug(CONTENT_TYPES.GENERIC_PAGE, params.slug, preview);

  if (!page) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      page,
      preview,
    },
    // ISR: Revalidate every 2 hours for generic pages
    revalidate: 2 * 60 * 60,
  };
}