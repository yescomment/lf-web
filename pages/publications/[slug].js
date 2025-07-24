import { getEntryBySlug, getAllSlugsForContentType, CONTENT_TYPES } from '../../lib/contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Head from 'next/head';

export default function Publication({ publication, preview }) {
  if (!publication) {
    return <div>Publication not found</div>;
  }

  const { fields } = publication;

  return (
    <>
      <Head>
        <title>{fields.title} - Library Futures</title>
        <meta name="description" content={fields.subtitle || fields.title} />
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

      <main className={`publication-layout ${preview ? 'preview-mode' : ''}`}>
        <article>
          <header>
            <h1>{fields.title}</h1>
            {fields.subtitle && <p className="subtitle">{fields.subtitle}</p>}
            {fields.publication_date && (
              <time dateTime={fields.publication_date}>
                {new Date(fields.publication_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            )}
            {fields.author && <p className="author">By {fields.author}</p>}
          </header>

          {fields.featured_image && (
            <div className="featured-image">
              <img 
                src={`https:${fields.featured_image.fields.file.url}`}
                alt={fields.featured_image.fields.description || fields.title}
              />
            </div>
          )}

          <div className="content">
            {fields.body && documentToReactComponents(fields.body)}
          </div>

          {fields.downloadable_file && (
            <div className="download-section">
              <a 
                href={`https:${fields.downloadable_file.fields.file.url}`}
                download
                className="button button--download"
              >
                Download {fields.downloadable_file.fields.file.fileName}
              </a>
            </div>
          )}

          {fields.external_url && (
            <div className="external-link">
              <a 
                href={fields.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="button button--external"
              >
                View External Resource
              </a>
            </div>
          )}
        </article>

        <nav className="publication-navigation">
          <a href="/publications" className="back-link">← Back to all publications</a>
        </nav>
      </main>
    </>
  );
}

export async function getStaticPaths() {
  const paths = await getAllSlugsForContentType(CONTENT_TYPES.PRODUCT);
  
  return {
    paths,
    fallback: 'blocking', // Enable ISR for new publications
  };
}

export async function getStaticProps({ params, preview = false }) {
  const publication = await getEntryBySlug(CONTENT_TYPES.PRODUCT, params.slug, preview);

  if (!publication) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      publication,
      preview,
    },
    // ISR: Revalidate every hour
    revalidate: 60 * 60,
  };
}