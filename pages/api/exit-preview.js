export default function handler(req, res) {
  // Clears the preview mode cookies
  res.clearPreviewData();
  
  // Redirect to the home page
  res.redirect('/');
}