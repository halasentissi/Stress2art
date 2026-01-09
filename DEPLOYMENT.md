# How to Deploy Stress2Art to the Web

## Step 1: Build Your App

First, build your production-ready app:

```bash
npm run build
```

This creates a `dist` folder with all your optimized files.

## Step 2: Choose a Hosting Platform

### Option A: Vercel (Recommended - Easiest & Free)

**Why Vercel?**
- Free tier with custom domains
- Automatic HTTPS
- Easy deployment from GitHub
- Great performance

**Steps:**

1. **Push your code to GitHub** (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite settings
   - Click "Deploy"
   - Your app will be live in ~2 minutes!

3. **Add Custom Domain:**
   - In your Vercel project dashboard, go to "Settings" → "Domains"
   - Click "Add Domain"
   - Enter your domain (e.g., `stress2art.com`)
   - Follow DNS instructions:
     - Add a CNAME record: `www` → `cname.vercel-dns.com`
     - Or A record: `@` → Vercel's IP (shown in dashboard)
   - Wait for DNS propagation (5-60 minutes)
   - SSL certificate is automatically configured!

---

### Option B: Netlify (Also Great & Free)

**Why Netlify?**
- Free tier with custom domains
- Automatic HTTPS
- Easy drag-and-drop deployment
- Great for static sites

**Steps:**

1. **Build your app:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/login
   - Drag and drop your `dist` folder to Netlify dashboard
   - OR connect to GitHub for continuous deployment
   - Your app is live instantly!

3. **Add Custom Domain:**
   - Go to "Site settings" → "Domain management"
   - Click "Add custom domain"
   - Enter your domain
   - Follow DNS instructions (similar to Vercel)
   - SSL is automatic!

**Note:** The `netlify.toml` and `_redirects` files are already configured for SPA routing.

---

### Option C: GitHub Pages (Free but Limited)

**Steps:**

1. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json scripts:**
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

4. **Enable GitHub Pages:**
   - Go to your repo → Settings → Pages
   - Select source: "gh-pages" branch
   - Your site will be at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`

5. **Custom Domain:**
   - Create a `CNAME` file in `public` folder with your domain
   - Add CNAME record in your DNS pointing to `YOUR_USERNAME.github.io`

---

### Option D: Cloudflare Pages (Free & Fast)

**Steps:**

1. **Push to GitHub** (same as Vercel)

2. **Deploy:**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Go to "Pages" → "Create a project"
   - Connect GitHub repository
   - Build settings:
     - Build command: `npm run build`
     - Build output directory: `dist`
   - Click "Save and Deploy"

3. **Custom Domain:**
   - In project settings → "Custom domains"
   - Add your domain
   - Update DNS records as instructed
   - SSL is automatic!

---

## Step 3: Buy a Domain

**Popular Domain Registrars:**
- **Namecheap** - [namecheap.com](https://namecheap.com) - Good prices, easy to use
- **Google Domains** - [domains.google](https://domains.google) - Simple interface
- **Cloudflare Registrar** - [cloudflare.com/products/registrar](https://cloudflare.com/products/registrar) - At-cost pricing
- **GoDaddy** - [godaddy.com](https://godaddy.com) - Popular but more expensive

**Steps to Buy:**
1. Search for your desired domain (e.g., `stress2art.com`)
2. Add to cart and checkout
3. Complete purchase

---

## Step 4: Configure DNS

After buying a domain, you need to point it to your hosting:

### For Vercel:
- **CNAME method (recommended):**
  - Add CNAME: `www` → `cname.vercel-dns.com`
  - Add A record: `@` → Vercel's IP (shown in dashboard)

### For Netlify:
- Add CNAME: `www` → `YOUR_SITE.netlify.app`
- Add A record: `@` → Netlify's IP (shown in dashboard)

### For Cloudflare Pages:
- Add CNAME: `@` → `YOUR_SITE.pages.dev`
- Add CNAME: `www` → `YOUR_SITE.pages.dev`

**DNS Propagation:** Takes 5-60 minutes, sometimes up to 48 hours.

---

## Step 5: Environment Variables

If your app uses environment variables (like Supabase keys), add them in your hosting platform:

- **Vercel:** Project Settings → Environment Variables
- **Netlify:** Site Settings → Environment Variables
- **Cloudflare Pages:** Settings → Environment Variables

Create a `.env.production` file locally to know what variables you need:
```env
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

---

## Quick Start (Recommended: Vercel)

1. **Build:**
   ```bash
   npm run build
   ```

2. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

3. **Deploy:**
   - Go to vercel.com
   - Import GitHub repo
   - Deploy (takes 2 minutes)

4. **Add Domain:**
   - Buy domain from Namecheap/Google
   - Add domain in Vercel dashboard
   - Update DNS records
   - Wait for SSL (automatic)

**You're live! 🎉**

---

## Troubleshooting

**404 errors on routes?**
- Make sure you have the redirect configuration (already included)
- Vercel: `vercel.json` ✓
- Netlify: `netlify.toml` and `_redirects` ✓

**Build fails?**
- Check Node.js version (should be 18+)
- Run `npm install` to ensure dependencies are installed
- Check build logs in hosting dashboard

**Domain not working?**
- Wait for DNS propagation (can take up to 48 hours)
- Check DNS records are correct
- Use [dnschecker.org](https://dnschecker.org) to verify propagation

