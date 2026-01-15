# Deploying PLS Consultants to Render

## 🚀 Quick Deploy to Render

### Prerequisites
- GitHub account
- Render account (free tier available at https://render.com)
- Your Gemini API key

---

## Step-by-Step Deployment

### 1. Push Your Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - PLS Consultants website"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/pls-site.git
git branch -M main
git push -u origin main
```

### 2. Deploy on Render

1. **Go to Render Dashboard**
   - Visit https://dashboard.render.com
   - Click "New +" → "Static Site"

2. **Connect Your Repository**
   - Connect your GitHub account
   - Select your PLS Site repository

3. **Configure Build Settings**
   - **Name**: `pls-consultants`
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. **Add Environment Variables**
   - Click "Advanced"
   - Add environment variable:
     - **Key**: `GEMINI_API_KEY`
     - **Value**: Your actual Gemini API key

5. **Deploy**
   - Click "Create Static Site"
   - Render will automatically build and deploy your site
   - You'll get a URL like: `https://pls-consultants.onrender.com`

---

## Alternative: Using render.yaml (Infrastructure as Code)

The `render.yaml` file is already configured in your project. Render will automatically detect it.

**To use it:**
1. Go to Render Dashboard
2. Click "New +" → "Blueprint"
3. Connect your repository
4. Render will read `render.yaml` and configure everything automatically
5. Just add your `GEMINI_API_KEY` in the environment variables

---

## Environment Variables

Make sure to set these in Render Dashboard:

| Variable | Value | Required |
|----------|-------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | Yes |
| `NODE_VERSION` | 18 | Auto-set by render.yaml |

---

## Custom Domain (Optional)

1. In Render Dashboard, go to your site settings
2. Click "Custom Domains"
3. Add your domain (e.g., `plsconsultants.com`)
4. Follow DNS configuration instructions
5. Render provides free SSL certificates automatically

---

## Automatic Deployments

Once connected, Render will automatically:
- ✅ Deploy when you push to `main` branch
- ✅ Build and test your code
- ✅ Serve your site with CDN
- ✅ Provide free SSL/HTTPS
- ✅ Handle all routing (SPA support)

---

## Testing Before Deploy

Always test your build locally first:

```bash
# Build the production version
npm run build

# Preview the production build
npm run preview

# Visit http://localhost:4173 to test
```

---

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Verify Node version (should be 18+)
- Check build logs in Render dashboard

### Images Not Loading
- Ensure all images are in `public/images/` folder
- Check that paths start with `/images/` not `./images/`
- Verify images were committed to git

### API Key Issues
- Verify `GEMINI_API_KEY` is set in Render environment variables
- Check API key is valid and has proper permissions
- Look for errors in browser console

### 404 Errors on Refresh
- The `_redirects` file should handle this
- Verify `public/_redirects` exists and contains: `/*    /index.html   200`

---

## Performance Optimization

Your site is already optimized with:
- ✅ Code splitting
- ✅ Asset compression
- ✅ Image optimization
- ✅ Cache headers (configured in render.yaml)

---

## Support

- Render Docs: https://render.com/docs/static-sites
- Vite Docs: https://vitejs.dev/guide/static-deploy.html

