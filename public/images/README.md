# Image Assets Directory

This folder contains all static images used throughout the PLS Consultants website.

## Folder Structure

```
public/images/
├── backgrounds/     # Hero images, section backgrounds
├── services/        # Service-related imagery
├── partners/        # Partner company logos
├── team/           # Team member photos
└── README.md       # This file
```

## Usage

Reference images from this folder using absolute paths starting with `/images/`:

```tsx
// Example in React components:
<img src="/images/team/pedro.jpg" alt="Pedro Xavier" />
<img src="/images/partners/montague-logo.png" alt="Montague Solicitors" />
<img src="/images/backgrounds/hero.jpg" alt="Hero background" />
```

## Image Guidelines

### Recommended Formats
- **Photos**: `.jpg` or `.webp` (for better compression)
- **Logos**: `.png` or `.svg` (for transparency)
- **Icons**: `.svg` (scalable)

### Recommended Sizes
- **Hero backgrounds**: 2000px wide minimum
- **Service images**: 1200px wide
- **Partner logos**: 400px wide (transparent background)
- **Team photos**: 800px wide
- **Favicon**: 512x512px

### Optimization
- Compress images before uploading (use tools like TinyPNG, ImageOptim)
- Use appropriate formats (WebP for modern browsers)
- Keep file sizes under 500KB when possible

## Current External Images

The following images are currently hosted externally and can be replaced:

### Team
- Pedro Xavier photo: Currently using ImgBB
  - Replace with: `/images/team/pedro.jpg`

### Backgrounds
- Hero background: Currently using Unsplash
  - Replace with: `/images/backgrounds/hero.jpg`

### Partners
- Montague Solicitors logo: Currently external
  - Replace with: `/images/partners/montague.png`
- AQ Archers logo: Currently external
  - Replace with: `/images/partners/aq-archers.png`

### NoVo Avatar
- NoVo static avatar: Currently using ImgBB
  - Replace with: `/images/novo-avatar.png`
- NoVo talking animation: Currently using ImgBB
  - Replace with: `/images/novo-talking.gif`

## Adding New Images

1. Place your image in the appropriate subfolder
2. Use descriptive, lowercase filenames with hyphens (e.g., `pedro-xavier-headshot.jpg`)
3. Update the component to reference the new path
4. Test locally before deploying

## Example Migration

To replace an external image with a local one:

**Before (in constants.tsx):**
```tsx
PEDRO_XAVIER: 'https://i.ibb.co/6y1Z0B5/pedro-xavier-studio.png'
```

**After:**
```tsx
PEDRO_XAVIER: '/images/team/pedro-xavier.png'
```

