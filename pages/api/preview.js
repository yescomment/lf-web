export default function handler(req, res) {
  // Check for secret to confirm this is a valid request
  if (req.query.secret !== process.env.PREVIEW_SECRET || !req.query.slug) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({});

  // Redirect to the path from the fetched post
  // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
  const slug = req.query.slug;
  const contentType = req.query.type || 'genericPage';
  
  // Construct the appropriate URL based on content type
  let redirectUrl = '/';
  
  switch (contentType) {
    case 'news':
      redirectUrl = `/post/${slug}`;
      break;
    case 'product':
      redirectUrl = `/publications/${slug}`;
      break;
    case 'people':
      redirectUrl = `/people/${slug}`;
      break;
    case 'event':
      redirectUrl = `/events/${slug}`;
      break;
    case 'genericPage':
      redirectUrl = `/${slug}`;
      break;
    default:
      redirectUrl = `/${slug}`;
  }

  res.redirect(redirectUrl);
}