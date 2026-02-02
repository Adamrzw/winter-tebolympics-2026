# Deployment Guide - Render (Single Service)

This guide will help you deploy the Winter Tebolympics application to Render as a single unified service.

## Overview

The application is now structured so the backend serves the frontend static files. This means:
- ✅ One service to deploy (not two)
- ✅ No CORS issues (same origin)
- ✅ Simpler configuration
- ✅ Lower cost (one free tier instance)

## Prerequisites

1. A [GitHub](https://github.com) account
2. A [Render](https://render.com) account (free tier)
3. Git installed locally

## Step 1: Push Code to GitHub

Initialize a git repository and push your code to GitHub:

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Winter Tebolympics 2026"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/winter-tebolympics-2026.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Render

### Option A: Using Render Dashboard (Recommended)

1. Log in to [Render Dashboard](https://dashboard.render.com)

2. Click **"New +"** → **"Web Service"**

3. Connect your GitHub repository

4. Configure the service:
   - **Name**: `winter-tebolympics`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: (leave empty - use repository root)
   - **Runtime**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

5. Add Environment Variables (click "Advanced"):
   ```
   NODE_ENV=production
   PORT=10000
   USE_MOCK_DATA=true
   CORS_ORIGIN=*
   ```

6. Click **"Create Web Service"**

7. Wait for deployment (5-10 minutes). Render will:
   - Install backend dependencies
   - Build backend TypeScript
   - Install frontend dependencies
   - Build frontend React app
   - Start the server

8. You'll get a URL like: `https://winter-tebolympics.onrender.com`

### Option B: Using render.yaml (Blueprint)

1. The repository includes a `render.yaml` file that configures everything automatically

2. In Render Dashboard, click **"New +"** → **"Blueprint"**

3. Connect your GitHub repository

4. Render will detect the `render.yaml` and create the service with all settings pre-configured

5. Click **"Apply"** and wait for deployment

## Step 3: Verify Deployment

1. Open your application URL: `https://winter-tebolympics.onrender.com`

2. You should see:
   - The "2026 Winter Tebolympics" header
   - All 12 teams with their countries
   - Live countdown timer
   - Real-time updates every 5 minutes

3. Test the API directly:
   ```bash
   # Health check
   curl https://winter-tebolympics.onrender.com/api/health

   # Get scoreboard
   curl https://winter-tebolympics.onrender.com/api/scoreboard

   # Trigger manual refresh
   curl -X POST https://winter-tebolympics.onrender.com/api/refresh
   ```

4. Check browser console for any errors

5. Test WebSocket connection:
   - Open DevTools → Network tab → Filter by "WS"
   - You should see active WebSocket connection

6. Open multiple browser tabs - all should receive updates simultaneously

## How It Works

### Architecture

```
┌─────────────────────────────────────────────┐
│         Render Web Service (Node.js)        │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │   Express Server (Port 10000)       │   │
│  │                                     │   │
│  │   ┌─────────────┐  ┌────────────┐  │   │
│  │   │ REST API    │  │ Socket.io  │  │   │
│  │   │ /api/*      │  │ WebSocket  │  │   │
│  │   └─────────────┘  └────────────┘  │   │
│  │                                     │   │
│  │   ┌─────────────────────────────┐  │   │
│  │   │ Static Files Middleware     │  │   │
│  │   │ Serves React Build (dist)   │  │   │
│  │   └─────────────────────────────┘  │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### Build Process

All dependencies and build scripts are in the root `package.json`:

1. **Install**: Single `npm install` installs all dependencies
2. **Backend Build**: TypeScript → JavaScript (`backend/dist/`)
3. **Frontend Build**: React → Static files (`frontend/dist/`)
4. **Runtime**: Backend serves frontend files + API + WebSocket

### Request Flow

- `GET /` → Frontend (index.html)
- `GET /assets/*` → Frontend static assets
- `GET /api/*` → Backend API
- `WebSocket` → Backend Socket.io

## Free Tier Details

### What's Included (Free)
- 750 hours/month (automatic spin-down after 15 min inactivity)
- HTTPS/WSS automatically configured
- Automatic deployments from GitHub
- 512 MB RAM
- Custom domain support

### Limitations
- **Spin-down**: Service sleeps after 15 minutes of inactivity
- **Cold Start**: First request takes 30-60 seconds after spin-down
- **Build Time**: 5-10 minutes for each deployment

### Upgrade Option
- **Paid Tier**: $7/month
- Always-on (no spin-down)
- Faster builds
- More RAM

## Environment Variables

All configuration is handled through environment variables in Render:

| Variable | Value | Purpose |
|----------|-------|---------|
| `NODE_ENV` | `production` | Enables production mode |
| `PORT` | `10000` | Render assigns this automatically |
| `USE_MOCK_DATA` | `true` | Use mock medal data |
| `CORS_ORIGIN` | `*` | Allow all origins (same-origin so safe) |

## Custom Domain (Optional)

To use your own domain:

1. Go to service settings in Render Dashboard
2. Click **"Custom Domain"**
3. Add your domain (e.g., `tebolympics.yourdomain.com`)
4. Update your DNS with the provided CNAME record:
   ```
   tebolympics.yourdomain.com CNAME winter-tebolympics.onrender.com
   ```
5. Wait for DNS propagation (5-60 minutes)
6. Render automatically provisions SSL certificate

## Monitoring

### View Logs
- Go to your service in Render Dashboard
- Click **"Logs"** tab
- Real-time log streaming
- Filter by time period

### Metrics
- Click **"Metrics"** tab
- View CPU, memory, and bandwidth usage
- Monitor request rates

### Health Checks
- Render automatically hits `/api/health` every minute
- Service marked unhealthy if endpoint fails
- Automatic restart on health check failure

## Updating the Application

### Automatic Deployment
Render automatically deploys when you push to the `main` branch:

```bash
git add .
git commit -m "Update message"
git push origin main
```

Wait 5-10 minutes for build and deployment.

### Manual Deployment
In Render Dashboard:
1. Go to your service
2. Click **"Manual Deploy"**
3. Select branch
4. Click **"Deploy"**

### Rollback
If something goes wrong:
1. Go to **"Events"** tab
2. Find previous successful deployment
3. Click **"Rollback"**

## Troubleshooting

### Service won't start
**Check logs for errors:**
- Build command failed → Verify `npm run build:full` works locally
- Start command failed → Verify `npm start` works after build
- Port issues → Render sets PORT automatically, don't hardcode

### Can't access application
**Verify deployment:**
```bash
curl https://YOUR_APP.onrender.com/api/health
```
Should return: `{"status":"ok","timestamp":"..."}`

### WebSocket connection fails
**Common causes:**
- Service is spinning up (wait 30-60 seconds)
- Firewall blocking WebSockets (try different network)
- Browser cache (hard refresh: Ctrl+Shift+R)

### Frontend shows old version
**Clear browser cache:**
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Clear cache in DevTools
- Try incognito/private window

### Build fails
**Check build logs:**
1. Verify `backend/package.json` has `build:full` script
2. Ensure both `frontend` and `backend` folders exist
3. Check for TypeScript errors locally first

### Service keeps spinning down
**This is normal on free tier:**
- After 15 minutes of inactivity
- Upgrade to $7/month for always-on
- Or: Set up external ping service (like UptimeRobot)

## Performance Tips

### Reduce Cold Start Time
1. Keep dependencies minimal
2. Optimize build size
3. Consider upgrading to paid tier

### Improve Responsiveness
1. Use CDN for static assets (already handled by Render)
2. Enable compression (Express handles this)
3. Optimize frontend bundle size

## Security

### Best Practices
- ✅ Never commit `.env` files (already in `.gitignore`)
- ✅ Use Render environment variables for secrets
- ✅ HTTPS/WSS enabled automatically
- ✅ Regular dependency updates

### CORS Configuration
Since backend serves frontend (same origin), CORS is not an issue. The `CORS_ORIGIN=*` is safe because:
- API and frontend are same domain
- WebSocket uses same origin
- No cross-origin requests in production

## Cost Breakdown

### Free Tier (Recommended for personal use)
- **Cost**: $0/month
- **Includes**: 750 hours
- **Best for**: Personal projects, demos, hobby apps
- **Limitation**: Spins down after 15 min

### Paid Tier (For production)
- **Cost**: $7/month
- **Includes**: Always-on, faster builds, more RAM
- **Best for**: Production apps with guaranteed uptime

## Next Steps

1. ✅ Deploy to Render
2. ✅ Verify application works
3. ✅ Test WebSocket connection
4. ⬜ Set up custom domain (optional)
5. ⬜ Configure monitoring/alerts
6. ⬜ Consider upgrading for always-on

---

## Your Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] Web Service created with correct settings
- [ ] Environment variables configured
- [ ] Build completed successfully
- [ ] Application accessible at Render URL
- [ ] Health endpoint returns OK
- [ ] WebSocket connection works
- [ ] Real-time updates functioning
- [ ] Tested with multiple browser tabs

**Your Application URL**: `https://winter-tebolympics.onrender.com`

Enjoy your deployed Winter Tebolympics application! 🏔️

---

## Support

- **Render Docs**: https://render.com/docs
- **Render Community**: https://community.render.com
- **Project Issues**: Open an issue on your GitHub repository
