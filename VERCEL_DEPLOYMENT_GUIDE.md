# VERCEL DEPLOYMENT GUIDE

## Status
The PLS-Site frontend is **ready for production deployment to Vercel**.

## Build Status
✅ **Production Build Complete**
- Bundle: 779.87KB (gzip: 196.23KB)
- Build time: 2.90s
- Modules: 104 transformed
- Errors: 0
- Ready to deploy

## GitHub Status
✅ **Code Pushed to GitHub**
- Repository: `https://github.com/NovocomAi/PLS-Site`
- Latest Commit: `24a61d0`
- Branch: main
- Status: Synced with origin

## Vercel Deployment Steps

### Quick Start (Recommended - 5 minutes)
1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Select "Import Git Repository"
4. Search for and select `NovocomAi/PLS-Site`
5. Configure:
   - **Framework Preset**: Vite (auto-detected)
   - **Root Directory**: ./ (default)
   - **Build Command**: npm run build (auto-detected)
   - **Output Directory**: dist (auto-detected)

6. Add Environment Variables:
   ```
   VITE_SUPABASE_URL = https://ivrnnzubplghzizefmjw.supabase.co
   VITE_SUPABASE_ANON_KEY = [from Supabase dashboard]
   VITE_RESEND_API_KEY = [from Resend dashboard]
   VITE_GEMINI_API_KEY = [from Google AI Studio]
   ```

7. Click "Deploy"
8. Wait for deployment to complete (typically 2-3 minutes)
9. Get your production URL (will be like: https://pls-site.vercel.app)

### Custom Domain Setup
After deployment, go to Project Settings → Domains:
1. Add `plsproservice.com`
   - Vercel will provide DNS records
   - Update DNS provider with CNAME record
   
2. Add `plsadmin.com`
   - Configure same way
   - Both will point to same Vercel project

### Environment Variables Reference
```json
{
  "VITE_SUPABASE_URL": "https://ivrnnzubplghzizefmjw.supabase.co",
  "VITE_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "VITE_RESEND_API_KEY": "re_...",
  "VITE_GEMINI_API_KEY": "AIza..."
}
```

## Vercel Config
The project includes `vercel.json` with:
- ✅ Framework: Vite
- ✅ Build command configured
- ✅ Environment variables specified
- ✅ Caching headers for assets
- ✅ Redirects configured

## Post-Deployment Tests
After deploying:

### Basic Tests
1. [ ] App loads without errors
2. [ ] CSS and assets load correctly
3. [ ] React app initializes
4. [ ] Console has no critical errors

### Login Tests
1. [ ] Navigate to /login
2. [ ] Test client login (email/password)
3. [ ] Verify Supabase auth works
4. [ ] Check JWT token generation

### Feature Tests
1. [ ] Client dashboard loads
2. [ ] Admin dashboard loads
3. [ ] Case retrieval works
4. [ ] Document upload functionality
5. [ ] Messaging system works

### Performance Tests
1. [ ] First Contentful Paint < 2s
2. [ ] Full page load < 3s
3. [ ] Interactive within 2s
4. [ ] No 404 errors on assets

### Security Tests
1. [ ] HTTPS enforced
2. [ ] CSP headers present
3. [ ] Auth tokens validated
4. [ ] Database RLS policies working

## Troubleshooting

### Build Fails
- Check that all dependencies are in package.json
- Verify Node version compatibility
- Clear `.next` or `dist/` directories if they exist

### Environment Variables Not Working
- Ensure variables are prefixed with `VITE_` for client-side
- Re-deploy after adding variables
- Check Vercel dashboard for variable status

### Database Connection Issues
- Verify Supabase URL is correct
- Check anon key has proper permissions
- Review RLS policies in Supabase dashboard

### Domain Not Working
- Allow 24-48 hours for DNS propagation
- Verify CNAME records in DNS provider
- Check Vercel domain settings
- Test with DNS lookup tools

## Rollback Procedure
If issues occur:
1. Go to Vercel dashboard → Deployments
2. Find previous stable deployment
3. Click "Promote to Production"
4. Site will rollback to previous version

## Support Resources
- Vercel Docs: https://vercel.com/docs
- Vite Docs: https://vitejs.dev
- Supabase Docs: https://supabase.com/docs
- React Docs: https://react.dev

---

**Next Step**: Follow "Quick Start" section above to deploy!
