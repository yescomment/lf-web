import { getEntryBySlug, getAllSlugsForContentType, CONTENT_TYPES } from '../../lib/contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Head from 'next/head';

export default function NewsPost({ post, preview }) {
  if (!post) {
    return <div>Post not found</div>;
  }

  const { fields } = post;

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

      <main className={`announcement-layout ${preview ? 'preview-mode' : ''}`}>
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

          {fields.tags && fields.tags.length > 0 && (
            <div className="tags">
              <h3>Tags:</h3>
              <ul>
                {fields.tags.map((tag, index) => (
                  <li key={index}>{tag}</li>
                ))}
              </ul>
            </div>
          )}
        </article>

        <nav className="post-navigation">
          <a href="/blog" className="back-link">← Back to all posts</a>
        </nav>
      </main>
    </>
  );
}

export async function getStaticPaths() {
  const paths = await getAllSlugsForContentType(CONTENT_TYPES.NEWS);
  
  return {
    paths,
    fallback: 'blocking', // Enable ISR for new posts
  };
}

export async function getStaticProps({ params, preview = false }) {
  const post = await getEntryBySlug(CONTENT_TYPES.NEWS, params.slug, preview);

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
      preview,
    },
    // ISR: Revalidate every hour
    revalidate: 60 * 60,
  };
}