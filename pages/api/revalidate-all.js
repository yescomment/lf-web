export default async function handler(req, res) {
  // Check for secret to confirm this is a valid request
  if (req.query.secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: 'Invalid secret' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Nuclear option: revalidate all main pages and common routes
    const allPaths = [
      '/',                    // Home page
      '/blog',               // Blog listing
      '/posts',              // Posts listing (if different from blog)
      '/publications',       // Publications listing
      '/who-we-are',         // People page
      '/people',             // People listing
      '/events',             // Events listing
    ];

    console.log('Revalidating all routes:', allPaths);

    // Revalidate all paths
    const revalidationPromises = allPaths.map(async (pathToRevalidate) => {
      try {
        await res.revalidate(pathToRevalidate);
        return { path: pathToRevalidate, success: true };
      } catch (err) {
        console.error(`Failed to revalidate ${pathToRevalidate}:`, err);
        return { path: pathToRevalidate, success: false, error: err.message };
      }
    });

    const results = await Promise.all(revalidationPromises);
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;
    
    return res.json({ 
      revalidated: true,
      strategy: 'all',
      totalPaths: allPaths.length,
      successCount,
      failureCount,
      paths: allPaths,
      results
    });
  } catch (err) {
    console.error('Full revalidation error:', err);
    return res.status(500).json({ 
      message: 'Error revalidating all paths', 
      error: err.message 
    });
  }
}