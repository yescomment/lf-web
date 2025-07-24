# Contentful ISR Implementation

This implementation adds Next.js with Incremental Static Regeneration (ISR) to support dynamic content fetching from Contentful at serve time, with preview capabilities and webhook-based cache invalidation.

## Architecture

The system has been migrated from Jekyll static site generation to Next.js ISR while preserving the existing URL structure and design.

### Key Features

1. **Incremental Static Regeneration (ISR)**: Pages are statically generated and cached, with automatic revalidation
2. **Preview Mode**: Support for Contentful's preview URLs to view draft content
3. **Webhook Revalidation**: API endpoints for cache invalidation when content is published
4. **URL Compatibility**: Preserves existing Jekyll URL structure

## Setup

### 1. Environment Variables

Copy `.env.local.example` to `.env.local` and configure:

```bash
# Contentful Configuration
CONTENTFUL_SPACE_ID=your_space_id_here
CONTENTFUL_ACCESS_TOKEN=your_access_token_here
CONTENTFUL_PREVIEW_ACCESS_TOKEN=your_preview_access_token_here

# Preview Configuration
PREVIEW_SECRET=your_preview_secret_here

# Revalidation Configuration
REVALIDATE_SECRET=your_revalidate_secret_here
```

### 2. Contentful Preview URLs

In Contentful, configure preview URLs for each content type:

- **News/Blog Posts**: `https://your-domain.com/api/preview?secret=PREVIEW_SECRET&slug={entry.fields.pretty_url}&type=news`
- **Publications**: `https://your-domain.com/api/preview?secret=PREVIEW_SECRET&slug={entry.fields.pretty_url}&type=product`
- **People**: `https://your-domain.com/api/preview?secret=PREVIEW_SECRET&slug={entry.fields.pretty_url}&type=people`
- **Generic Pages**: `https://your-domain.com/api/preview?secret=PREVIEW_SECRET&slug={entry.fields.pretty_url}&type=genericPage`

### 3. Contentful Webhooks

Set up webhooks in Contentful to trigger revalidation:

- **Webhook URL**: `https://your-domain.com/api/revalidate?secret=REVALIDATE_SECRET`
- **Events**: Entry publish, Entry unpublish
- **Content Types**: All relevant content types

## ISR Configuration

Each page type has different revalidation intervals:

- **Home Page**: 30 minutes (frequently updated with latest content)
- **Blog Posts/News**: 1 hour (content rarely changes after publication)
- **Publications**: 1 hour (content rarely changes after publication)
- **Generic Pages**: 2 hours (content changes infrequently)

## API Endpoints

### Preview Mode

- **Enter Preview**: `/api/preview?secret=PREVIEW_SECRET&slug=SLUG&type=TYPE`
- **Exit Preview**: `/api/exit-preview`

### Cache Revalidation

- **Revalidate**: `/api/revalidate?secret=REVALIDATE_SECRET`
  - POST body: `{ "path": "/specific-path" }` or `{ "contentType": "news", "entryId": "entry-id" }`

## Content Types Mapping

The system supports the following Contentful content types:

- `index` → Home page content
- `genericPage` → Generic pages (e.g., About, Contact)
- `product` → Publications (mapped to `/publications/[slug]`)
- `people` → People profiles (mapped to `/people/[slug]`)
- `event` → Events (mapped to `/events/[slug]`)
- `news` → Blog posts (mapped to `/post/[slug]`)
- `figure` → Image components
- `initiative` → Initiative content

## Deployment

### Vercel

The `vercel.json` has been updated for Next.js deployment:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

### Environment Variables in Vercel

Set up the same environment variables in Vercel dashboard or using Vercel CLI.

## Development

### Local Development

```bash
npm run dev
```

### Building

```bash
npm run build
npm start
```

## Migration Notes

- The Jekyll build system is preserved alongside Next.js for compatibility
- Jekyll scripts are renamed to `build:jekyll`
- Main build command now uses Next.js: `npm run build`
- URL structure is preserved using Next.js rewrites
- Content fetching is moved from build-time to request-time with ISR caching

## Benefits

1. **Dynamic Content**: Content updates appear without full site rebuilds
2. **Performance**: ISR provides fast static pages with dynamic updates
3. **Preview**: Content editors can preview drafts before publishing
4. **Scalability**: Better handling of large amounts of content
5. **SEO**: Maintains static generation benefits for SEO