# MediPay Deployment Guide

This guide covers deploying MediPay to various platforms including GitHub Pages, Vercel, and Netlify.

## Prerequisites

Before deploying:
1. Complete the setup in SETUP.md
2. Test the application locally
3. Ensure `npm run build` completes successfully
4. Have your Supabase credentials ready

## GitHub Pages Deployment

### Option 1: Using GitHub Actions (Recommended)

1. **Update vite.config.ts**

Add the base path for your repository:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/your-repo-name/', // Replace with your repository name
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
```

2. **Create GitHub Actions Workflow**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

3. **Add Secrets to GitHub**

Go to your repository on GitHub:
- Settings > Secrets and variables > Actions
- Click "New repository secret"
- Add:
  - `VITE_SUPABASE_URL` - Your Supabase URL
  - `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key

4. **Enable GitHub Pages**

- Go to Settings > Pages
- Source: GitHub Actions
- Click Save

5. **Push to GitHub**

```bash
git add .
git commit -m "Deploy MediPay"
git push origin main
```

Your app will be available at: `https://your-username.github.io/your-repo-name/`

### Option 2: Manual Deployment

1. Update `vite.config.ts` with the base path (see above)

2. Build the project:

```bash
npm run build
```

3. Install gh-pages:

```bash
npm install --save-dev gh-pages
```

4. Add to package.json scripts:

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

5. Deploy:

```bash
npm run deploy
```

## Vercel Deployment

### Option 1: Using Vercel CLI

1. **Install Vercel CLI**

```bash
npm install -g vercel
```

2. **Login**

```bash
vercel login
```

3. **Deploy**

```bash
vercel
```

Follow the prompts:
- Set up and deploy: Yes
- Project name: medipay (or your choice)
- Directory: ./
- Override settings: No

4. **Add Environment Variables**

```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

Paste your values when prompted.

5. **Deploy to Production**

```bash
vercel --prod
```

### Option 2: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click "Deploy"

Your app will be available at: `https://your-project.vercel.app`

## Netlify Deployment

### Option 1: Using Netlify CLI

1. **Install Netlify CLI**

```bash
npm install -g netlify-cli
```

2. **Login**

```bash
netlify login
```

3. **Initialize**

```bash
netlify init
```

Follow the prompts.

4. **Create netlify.toml**

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

5. **Deploy**

```bash
netlify deploy --prod
```

### Option 2: Using Netlify Dashboard

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" > "Import an existing project"
3. Connect to your Git provider
4. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click "Deploy site"

Your app will be available at: `https://your-site.netlify.app`

## Custom Domain Setup

### Vercel

1. Go to your project dashboard
2. Settings > Domains
3. Add your domain
4. Update DNS records as instructed

### Netlify

1. Go to Site settings > Domain management
2. Add custom domain
3. Configure DNS settings

### GitHub Pages

1. Settings > Pages > Custom domain
2. Enter your domain
3. Update DNS with a CNAME record

## Environment Variables for Production

Make sure to set these for production:

```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
```

### Important Notes:

1. **Use HTTPS**: All platforms provide free SSL
2. **Environment Variables**: Never commit secrets to Git
3. **Supabase URL**: Same Supabase project works for dev and prod
4. **CORS**: Supabase automatically allows requests from your deployed domain

## Post-Deployment Checklist

- [ ] Test user registration
- [ ] Test login/logout
- [ ] Add a prescription
- [ ] View cost prediction
- [ ] Test payment simulation
- [ ] Check mobile responsiveness
- [ ] Verify all charts render correctly
- [ ] Test all navigation links

## Performance Optimization

### 1. Enable Caching

All platforms automatically cache your static assets.

### 2. Use a CDN

Vercel, Netlify, and GitHub Pages all use CDNs by default.

### 3. Optimize Images

If you add images:
```bash
npm install vite-plugin-image-optimizer
```

### 4. Code Splitting

Already configured with Vite's automatic code splitting.

## Monitoring and Analytics

### Vercel Analytics

Add to your project:
```bash
npm install @vercel/analytics
```

### Netlify Analytics

Enable in site settings (paid feature).

### Google Analytics

Add to `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

## Troubleshooting

### Blank Page After Deploy

1. Check browser console for errors
2. Verify environment variables are set
3. Ensure base path is correct (GitHub Pages)
4. Check build logs for errors

### 404 on Page Refresh

Add redirect rules:

**Vercel**: Create `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

**Netlify**: Already handled by `netlify.toml` above

### Build Fails

1. Check Node version (use 18+)
2. Clear cache and rebuild
3. Check for TypeScript errors
4. Verify all dependencies are installed

### Supabase Connection Issues

1. Check that Supabase project is active
2. Verify API keys are correct
3. Check Supabase service status
4. Ensure RLS policies are set up

## Rollback

### Vercel
```bash
vercel rollback
```

### Netlify
Go to Deploys > Click previous deploy > Publish deploy

### GitHub Pages
Revert the commit and push

## CI/CD Best Practices

1. **Test before deploy**: Add tests to your workflow
2. **Use staging**: Deploy to staging before production
3. **Monitor deployments**: Set up deployment notifications
4. **Automatic deployments**: Deploy on push to main
5. **Preview deployments**: Both Vercel and Netlify provide preview URLs for PRs

## Cost Considerations

### Free Tiers:

- **GitHub Pages**: Free for public repos
- **Vercel**: 100GB bandwidth/month
- **Netlify**: 100GB bandwidth/month
- **Supabase**: 500MB database, 2GB bandwidth

### When to Upgrade:

- High traffic (>100k visitors/month)
- Large database (>500MB)
- Need better support
- Want custom domains without branding

## Security Checklist

- [ ] Environment variables are not in Git
- [ ] Using HTTPS
- [ ] Supabase RLS policies are enabled
- [ ] API keys are rotated regularly
- [ ] Dependencies are up to date
- [ ] No sensitive data in client-side code

## Support

If you encounter issues:

1. Check deployment logs
2. Review platform documentation
3. Check Supabase status
4. Test locally first

Happy deploying!
