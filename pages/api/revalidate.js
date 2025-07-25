import { getContentfulClient, CONTENT_TYPES } from '../../lib/contentful';

export default async function handler(req, res) {
  // Check for secret to confirm this is a valid request
  if (req.query.secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: 'Invalid secret' });
  }

  const { path, contentType, entryId, invalidateAll = false } = req.body;

  try {
    const pathsToRevalidate = new Set();
    
    if (invalidateAll) {
      // Nuclear option: invalidate all main pages
      pathsToRevalidate.add('/');
      pathsToRevalidate.add('/posts');
      pathsToRevalidate.add('/publications');
      pathsToRevalidate.add('/people');
      pathsToRevalidate.add('/events');
      pathsToRevalidate.add('/who-we-are');
      pathsToRevalidate.add('/blog');
    } else if (path) {
      // Direct path revalidation
      pathsToRevalidate.add(path);
    } else if (contentType) {
      // Content-type based revalidation with entry-specific targeting
      await addPathsForContentType(contentType, entryId, pathsToRevalidate);
    } else {
      // Fallback: revalidate home page
      pathsToRevalidate.add('/');
    }

    // Convert Set to Array for processing
    const pathsArray = Array.from(pathsToRevalidate);
    
    // Revalidate all identified paths
    const revalidationPromises = pathsArray.map(async (pathToRevalidate) => {
      try {
        await res.revalidate(pathToRevalidate);
        return { path: pathToRevalidate, success: true };
      } catch (err) {
        console.error(`Failed to revalidate ${pathToRevalidate}:`, err);
        return { path: pathToRevalidate, success: false, error: err.message };
      }
    });

    const results = await Promise.all(revalidationPromises);
    
    return res.json({ 
      revalidated: true, 
      paths: pathsArray,
      results,
      strategy: invalidateAll ? 'all' : (entryId ? 'targeted' : 'content-type')
    });
  } catch (err) {
    console.error('Revalidation error:', err);
    return res.status(500).json({ 
      message: 'Error revalidating', 
      error: err.message 
    });
  }
}

async function addPathsForContentType(contentType, entryId, pathsToRevalidate) {
  // Always add relevant listing pages for the content type
  switch (contentType) {
    case CONTENT_TYPES.NEWS:
    case 'news':
      pathsToRevalidate.add('/');  // Home page shows latest news
      pathsToRevalidate.add('/blog');  // Blog listing page
      
      // Try to get specific entry slug for targeted revalidation
      if (entryId) {
        const entrySlug = await getEntrySlugById(entryId, CONTENT_TYPES.NEWS);
        if (entrySlug) {
          pathsToRevalidate.add(`/posts/${entrySlug}`);
          pathsToRevalidate.add(`/post/${entrySlug}`); // Jekyll-style URL
        }
      }
      break;
      
    case CONTENT_TYPES.PRODUCT:
    case 'product':
      pathsToRevalidate.add('/');  // Home page shows latest publications
      pathsToRevalidate.add('/publications');  // Publications listing page
      
      if (entryId) {
        const entrySlug = await getEntrySlugById(entryId, CONTENT_TYPES.PRODUCT);
        if (entrySlug) {
          pathsToRevalidate.add(`/publications/${entrySlug}`);
        }
      }
      break;
      
    case CONTENT_TYPES.PEOPLE:
    case 'people':
      pathsToRevalidate.add('/who-we-are');  // People page
      pathsToRevalidate.add('/people');  // People listing page
      
      if (entryId) {
        const entrySlug = await getEntrySlugById(entryId, CONTENT_TYPES.PEOPLE);
        if (entrySlug) {
          pathsToRevalidate.add(`/people/${entrySlug}`);
        }
      }
      break;
      
    case CONTENT_TYPES.EVENT:
    case 'event':
      pathsToRevalidate.add('/');  // Home page may show events
      pathsToRevalidate.add('/events');  // Events listing page
      
      if (entryId) {
        const entrySlug = await getEntrySlugById(entryId, CONTENT_TYPES.EVENT);
        if (entrySlug) {
          pathsToRevalidate.add(`/events/${entrySlug}`);
        }
      }
      break;
      
    case CONTENT_TYPES.GENERIC_PAGE:
    case 'genericPage':
      pathsToRevalidate.add('/');  // Safe fallback
      
      if (entryId) {
        const entrySlug = await getEntrySlugById(entryId, CONTENT_TYPES.GENERIC_PAGE);
        if (entrySlug) {
          pathsToRevalidate.add(`/${entrySlug}`);
        }
      }
      break;
      
    case CONTENT_TYPES.INDEX:
    case 'index':
      pathsToRevalidate.add('/');  // Home page content
      break;
      
    case CONTENT_TYPES.EVENTS_PAGE:
    case 'eventsPage':
      pathsToRevalidate.add('/events');
      pathsToRevalidate.add('/');
      break;
      
    default:
      pathsToRevalidate.add('/');  // Safe fallback
  }
}

async function getEntrySlugById(entryId, contentType) {
  try {
    const client = getContentfulClient(false);
    if (!client) {
      console.warn('Contentful client not available for slug lookup');
      return null;
    }
    
    const entry = await client.getEntry(entryId);
    
    // Verify the entry is of the expected content type
    if (entry.sys.contentType.sys.id !== contentType) {
      console.warn(`Entry ${entryId} is not of type ${contentType}`);
      return null;
    }
    
    return entry.fields.pretty_url || null;
  } catch (error) {
    console.error(`Error fetching entry ${entryId} for slug lookup:`, error);
    return null;
  }
}