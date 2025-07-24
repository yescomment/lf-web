import { createClient } from 'contentful';

let contentfulClient = null;
let contentfulPreviewClient = null;

// Initialize clients only if we have the required environment variables
function initializeClients() {
  if (!contentfulClient && process.env.CONTENTFUL_SPACE_ID && process.env.CONTENTFUL_ACCESS_TOKEN) {
    try {
      contentfulClient = createClient({
        space: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
      });

      if (process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN) {
        contentfulPreviewClient = createClient({
          space: process.env.CONTENTFUL_SPACE_ID,
          accessToken: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN,
          host: 'preview.contentful.com',
        });
      }
    } catch (error) {
      console.error('Failed to initialize Contentful clients:', error);
    }
  }
}

// Get client based on preview mode
export function getContentfulClient(preview = false) {
  initializeClients();
  
  if (preview && contentfulPreviewClient) {
    return contentfulPreviewClient;
  }
  
  return contentfulClient;
}

// Content type mappers
export const CONTENT_TYPES = {
  INDEX: 'index',
  GENERIC_PAGE: 'genericPage',
  PRODUCT: 'product',
  PEOPLE: 'people',
  EVENTS_PAGE: 'eventsPage',
  EVENT: 'event',
  NEWS: 'news',
  FIGURE: 'figure',
  INITIATIVE: 'initiative',
};

// Fetch all entries of a specific content type
export async function getEntriesByType(contentType, preview = false) {
  const client = getContentfulClient(preview);
  
  if (!client) {
    console.warn('Contentful client not initialized. Returning empty array.');
    return [];
  }
  
  try {
    const response = await client.getEntries({
      content_type: contentType,
      include: 2, // Include linked entries up to 2 levels deep
    });
    
    return response.items;
  } catch (error) {
    console.error(`Error fetching ${contentType}:`, error);
    return [];
  }
}

// Fetch a single entry by content type and slug
export async function getEntryBySlug(contentType, slug, preview = false) {
  const client = getContentfulClient(preview);
  
  if (!client) {
    console.warn('Contentful client not initialized. Returning null.');
    return null;
  }
  
  try {
    const response = await client.getEntries({
      content_type: contentType,
      'fields.pretty_url': slug,
      include: 2,
    });
    
    return response.items[0] || null;
  } catch (error) {
    console.error(`Error fetching ${contentType} with slug ${slug}:`, error);
    return null;
  }
}

// Fetch index page content
export async function getIndexContent(preview = false) {
  const entries = await getEntriesByType(CONTENT_TYPES.INDEX, preview);
  return entries[0] || null;
}

// Fetch all news/blog posts
export async function getAllNews(preview = false) {
  const entries = await getEntriesByType(CONTENT_TYPES.NEWS, preview);
  return entries.sort((a, b) => 
    new Date(b.fields.publication_date) - new Date(a.fields.publication_date)
  );
}

// Fetch all publications
export async function getAllPublications(preview = false) {
  const entries = await getEntriesByType(CONTENT_TYPES.PRODUCT, preview);
  return entries.sort((a, b) => 
    new Date(b.fields.publication_date) - new Date(a.fields.publication_date)
  );
}

// Fetch all people
export async function getAllPeople(preview = false) {
  return await getEntriesByType(CONTENT_TYPES.PEOPLE, preview);
}

// Fetch all events
export async function getAllEvents(preview = false) {
  return await getEntriesByType(CONTENT_TYPES.EVENT, preview);
}

// Fetch all generic pages
export async function getAllGenericPages(preview = false) {
  return await getEntriesByType(CONTENT_TYPES.GENERIC_PAGE, preview);
}

// Helper to get all slugs for a content type (for static generation)
export async function getAllSlugsForContentType(contentType) {
  const entries = await getEntriesByType(contentType, false);
  return entries
    .filter(entry => entry.fields && entry.fields.pretty_url)
    .map(entry => ({
      params: { slug: entry.fields.pretty_url }
    }));
}