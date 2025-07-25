# Instant Cache Invalidation with Contentful Webhooks

This implementation provides **instant cache invalidation** when content is updated in Contentful, supporting both targeted invalidation of specific pages and broad invalidation of all routes.

## 🚀 How It Works

When content is updated in Contentful, webhooks trigger cache invalidation endpoints that use Next.js's `revalidate()` function to instantly update the cached static pages.

## 📡 Webhook Endpoints

### 1. Targeted Invalidation: `/api/revalidate`

**Best for**: Precise updates that only affect specific pages.

```bash
POST https://your-domain.com/api/revalidate?secret=REVALIDATE_SECRET
Content-Type: application/json

{
  "contentType": "news",
  "entryId": "abc123"
}
```

**Features:**
- ✅ Automatically determines which pages need revalidation based on content type
- ✅ Fetches entry slug from Contentful to invalidate specific entry pages
- ✅ Invalidates both listing pages and individual entry pages
- ✅ Supports Jekyll-style URL rewrites (e.g., `/post/:slug` → `/posts/:slug`)

### 2. Nuclear Option: `/api/revalidate-all`

**Best for**: When you need to ensure all pages are updated immediately.

```bash
POST https://your-domain.com/api/revalidate-all?secret=REVALIDATE_SECRET
```

**Features:**
- ✅ Invalidates all main pages instantly
- ✅ Simple webhook setup - no payload required
- ✅ Guaranteed to update all content regardless of dependencies

### 3. Manual Path Invalidation

For specific paths or advanced use cases:

```bash
POST https://your-domain.com/api/revalidate?secret=REVALIDATE_SECRET
Content-Type: application/json

{
  "path": "/specific-page"
}
```

## 🎯 Content Type Mapping

The system automatically maps Contentful content types to the pages that need invalidation:

| Content Type | Pages Invalidated | Entry-Specific Page |
|-------------|------------------|-------------------|
| `news` | `/`, `/blog` | `/posts/{slug}`, `/post/{slug}` |
| `product` | `/`, `/publications` | `/publications/{slug}` |
| `people` | `/who-we-are`, `/people` | `/people/{slug}` |
| `event` | `/`, `/events` | `/events/{slug}` |
| `genericPage` | `/` | `/{slug}` |
| `index` | `/` | - |
| `eventsPage` | `/events`, `/` | - |

## ⚙️ Contentful Webhook Setup

### Option 1: Targeted Invalidation (Recommended)

1. Go to Contentful → Settings → Webhooks
2. Create a new webhook with:
   - **URL**: `https://your-domain.com/api/revalidate?secret=YOUR_REVALIDATE_SECRET`
   - **Method**: POST
   - **Headers**: `Content-Type: application/json`
   - **Payload**: 
   ```json
   {
     "contentType": "{entry.sys.contentType.sys.id}",
     "entryId": "{entry.sys.id}"
   }
   ```

### Option 2: Nuclear Option (Simple)

1. Go to Contentful → Settings → Webhooks
2. Create a new webhook with:
   - **URL**: `https://your-domain.com/api/revalidate-all?secret=YOUR_REVALIDATE_SECRET`
   - **Method**: POST
   - **No payload required**

## 🔧 Environment Variables

Add to your `.env.local`:

```bash
REVALIDATE_SECRET=your_secure_secret_here
```

## 📊 Response Format

Both endpoints return detailed information about the revalidation process:

```json
{
  "revalidated": true,
  "strategy": "targeted", // or "all"
  "paths": ["/", "/posts/my-article"],
  "results": [
    { "path": "/", "success": true },
    { "path": "/posts/my-article", "success": true }
  ],
  "successCount": 2,
  "failureCount": 0
}
```

## 🚨 Fallback Strategies

The system includes multiple fallback layers:

1. **Entry-specific revalidation**: Fetches the entry slug for precise targeting
2. **Content-type revalidation**: Falls back to content-type-based invalidation if slug lookup fails
3. **Safe fallback**: Always revalidates the home page as a minimum

## 💡 Usage Recommendations

### For Most Use Cases: Targeted Invalidation
- Use `/api/revalidate` with content type and entry ID
- Provides optimal performance with minimal cache clearing
- Automatically handles URL patterns and rewrites

### For Simplicity: Nuclear Option
- Use `/api/revalidate-all` when you want to ensure everything is updated
- No webhook payload configuration required
- Ideal for initial setup or when content has complex dependencies

### For Advanced Cases: Manual Path Control
- Use `/api/revalidate` with specific paths
- Useful for custom invalidation logic or edge cases
- Combine with `invalidateAll: true` flag for maximum control

## 🔒 Security

- All endpoints require the `REVALIDATE_SECRET` parameter
- CORS headers are configured to allow Contentful webhook requests
- Failed revalidations are logged but don't prevent other paths from being updated

## ⚡ Performance Benefits

- **Instant Updates**: Content changes appear immediately without waiting for ISR intervals
- **Surgical Precision**: Only affected pages are revalidated, maintaining cache efficiency
- **Parallel Processing**: Multiple pages are revalidated simultaneously for speed
- **Smart Fallbacks**: System gracefully handles edge cases and API failures

This implementation ensures your site provides instant content updates while maintaining the performance benefits of static generation and intelligent caching.