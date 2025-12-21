# EcoTrack - Deployment Guide

This guide will help you deploy EcoTrack to production using **Vercel** (for the Next.js app) and **Railway** or **Supabase** (for PostgreSQL database).

---

## Prerequisites

- GitHub account
- Vercel account ([vercel.com](https://vercel.com))
- Railway account ([railway.app](https://railway.app)) OR Supabase account ([supabase.com](https://supabase.com))

---

## Step 1: Database Setup

### Option A: Railway (Recommended)

1. **Create New Project**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Provision PostgreSQL"

2. **Get Database URL**
   - Click on your PostgreSQL service
   - Go to "Connect" tab
   - Copy the `DATABASE_URL` (starts with `postgresql://`)

### Option B: Supabase

1. **Create New Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose region and password

2. **Get Database URL**
   - Go to Project Settings → Database
   - Copy the "Connection string" (URI format)
   - Replace `[YOUR-PASSWORD]` with your database password

---

## Step 2: Environment Variables

Create a `.env.production` file with these variables:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# JWT Secret (generate random string)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Optional: If you want to use external APIs
# OPENAI_API_KEY="sk-..."
```

**Generate a secure JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Step 3: Push to GitHub

1. **Initialize Git** (if not already done)
   ```bash
   git init
   git add .
   git commit -m "Initial commit - EcoTrack"
   ```

2. **Create GitHub Repository**
   - Go to [github.com/new](https://github.com/new)
   - Name it "ecotrack" (or your preferred name)
   - **Don't** initialize with README

3. **Push Code**
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/ecotrack.git
   git branch -M main
   git push -u origin main
   ```

---

## Step 4: Deploy to Vercel

1. **Import Project**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   - Framework Preset: **Next.js**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Add Environment Variables**
   - Go to "Environment Variables" section
   - Add these variables:
     ```
     DATABASE_URL = your-database-url-from-railway
     JWT_SECRET = your-generated-secret
     ```

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build completion

---

## Step 5: Database Migration

After deployment, run Prisma migrations:

1. **Install Vercel CLI** (if not installed)
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Link Project**
   ```bash
   vercel link
   ```

4. **Run Prisma Commands**
   ```bash
   # Generate Prisma Client
   vercel env pull .env.production
   npx prisma generate
   
   # Push database schema
   npx prisma db push
   
   # (Optional) Seed challenges
   npx prisma db seed
   ```

---

## Step 6: Post-Deployment

### Verify Deployment
1. Visit your Vercel URL (e.g., `ecotrack.vercel.app`)
2. Register a new account
3. Test all features:
   - Dashboard
   - Calculator
   - Activities
   - Challenges
   - Leaderboard
   - Map
   - Profile

### Custom Domain (Optional)
1. Go to Vercel → Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

---

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | ✅ Yes | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | ✅ Yes | Secret key for JWT tokens | Random 32-char string |
| `NODE_ENV` | No | Environment (auto-set by Vercel) | `production` |

---

## Troubleshooting

### Build Fails
- Check Vercel deployment logs
- Ensure all dependencies are in `package.json`
- Verify environment variables are set

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check if Railway/Supabase database is running
- Ensure database allows external connections

### Prisma Errors
```bash
# Regenerate Prisma Client
npx prisma generate

# Reset database (⚠️ deletes all data)
npx prisma db push --force-reset
```

---

## Production Checklist

- [ ] Database created and accessible
- [ ] Environment variables configured
- [ ] Code pushed to GitHub
- [ ] Vercel deployment successful
- [ ] Database schema migrated (`prisma db push`)
- [ ] Challenges seeded (`prisma db seed`)
- [ ] Test account created
- [ ] All features tested
- [ ] Custom domain configured (optional)

---

## Maintenance

### Update Deployment
```bash
git add .
git commit -m "Update feature"
git push origin main
```
Vercel will automatically redeploy.

### View Logs
- Go to Vercel → Your Project → Deployments
- Click on deployment → "Logs" tab

### Database Backup
- **Railway**: Automatic daily backups
- **Supabase**: Automatic backups (paid plans)

---

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check database connection
3. Review this guide
4. Create an issue on GitHub

---

**🎉 Congratulations! EcoTrack is now live!**
