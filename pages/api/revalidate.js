export default async function handler(req, res) {
  // Check for secret to confirm this is a valid request
  if (req.query.secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: 'Invalid secret' });
  }

  const { path, contentType, entryId } = req.body;

  try {
    // Revalidate specific paths based on content type and entry
    const pathsToRevalidate = [];
    
    if (path) {
      // Direct path revalidation
      pathsToRevalidate.push(path);
    } else if (contentType && entryId) {
      // Determine paths to revalidate based on content type
      switch (contentType) {
        case 'news':
          pathsToRevalidate.push('/');  // Home page shows latest news
          pathsToRevalidate.push('/blog');  // Blog listing page
          // We'd need the slug to revalidate the specific post page
          break;
        case 'product':
          pathsToRevalidate.push('/');  // Home page shows latest publication
          pathsToRevalidate.push('/publications');  // Publications listing page
          break;
        case 'people':
          pathsToRevalidate.push('/who-we-are');  // People page
          break;
        case 'event':
          pathsToRevalidate.push('/');  // Home page may show events
          pathsToRevalidate.push('/events');  // Events listing page
          break;
        case 'genericPage':
          // For generic pages, we'd need more context about which page
          pathsToRevalidate.push('/');  // Safe fallback
          break;
        case 'index':
          pathsToRevalidate.push('/');  // Home page content
          break;
        default:
          pathsToRevalidate.push('/');  // Safe fallback
      }
    } else {
      // Fallback: revalidate home page
      pathsToRevalidate.push('/');
    }

    // Revalidate all identified paths
    const revalidationPromises = pathsToRevalidate.map(async (pathToRevalidate) => {
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
      paths: pathsToRevalidate,
      results 
    });
  } catch (err) {
    console.error('Revalidation error:', err);
    return res.status(500).json({ 
      message: 'Error revalidating', 
      error: err.message 
    });
  }
}