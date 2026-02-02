# Render Deployment Checklist (Single Service)

Quick reference for deploying to Render as a unified service.

## Pre-Deployment

- [ ] Code is tested locally and working
- [ ] `npm run type-check` passes for both frontend and backend
- [ ] All changes committed to Git
- [ ] GitHub repository created and code pushed

## Service Deployment

- [ ] Create Web Service on Render
- [ ] Set Root Directory: `backend`
- [ ] Set Build Command: `npm install && npm run build:full`
- [ ] Set Start Command: `npm start`
- [ ] Add Environment Variables:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=10000`
  - [ ] `USE_MOCK_DATA=true`
  - [ ] `CORS_ORIGIN=*`
- [ ] Deploy and wait for completion (5-10 minutes)
- [ ] Copy application URL: `https://_____.onrender.com`

## Post-Deployment Verification

- [ ] Open application URL in browser
- [ ] Verify all 12 teams display correctly
- [ ] Check browser console for errors
- [ ] Verify WebSocket connection (DevTools → Network → WS)
- [ ] Test with multiple browser tabs
- [ ] Wait 5 minutes and verify auto-update works

## API Verification Tests

```bash
# Test health endpoint
curl https://YOUR_APP.onrender.com/api/health

# Test scoreboard endpoint
curl https://YOUR_APP.onrender.com/api/scoreboard

# Test manual refresh
curl -X POST https://YOUR_APP.onrender.com/api/refresh
```

## Your Deployment Info

**Application URL**: `_________________________________`

**Date Deployed**: `_________________________________`

**Render Service Name**: `_________________________________`

## Common Issues & Solutions

### "Failed to fetch" or blank page
1. Wait 30-60 seconds (cold start on free tier)
2. Check Render logs for build errors
3. Verify `build:full` script works locally
4. Hard refresh browser (Ctrl+Shift+R)

### Build fails
1. Check Render logs for specific error
2. Test locally: `cd backend && npm run build:full`
3. Verify both `frontend/` and `backend/` folders exist
4. Ensure all dependencies are in `package.json`

### WebSocket connection failed
1. Wait for service to fully start (30-60 seconds)
2. Check that service is "Live" in Render dashboard
3. Verify no firewall/VPN blocking WebSocket
4. Try different network or browser

### Service spins down after 15 minutes
- **Expected behavior** on free tier
- First request after spin-down takes 30-60 seconds
- Upgrade to $7/month for always-on
- Or use external ping service (UptimeRobot)

## Advantages of Single-Service Deployment

✅ **Simpler**: One service instead of two
✅ **Cheaper**: One free tier instance instead of two
✅ **No CORS**: Same-origin, no cross-origin issues
✅ **Easier Config**: Fewer environment variables
✅ **Single URL**: One domain for everything

## Architecture

```
https://your-app.onrender.com
├── /                   → Frontend (React app)
├── /assets/*           → Frontend static files
├── /api/health         → Backend REST API
├── /api/scoreboard     → Backend REST API
├── /api/refresh        → Backend REST API
└── WebSocket           → Backend Socket.io
```

## Need Help?

- **Full Guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Render Docs**: https://render.com/docs
- **Community**: https://community.render.com

---

## Update Deployment

When you make changes:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Render automatically rebuilds and redeploys (5-10 min).
