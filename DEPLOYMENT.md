# Zembile Deployment Guide

## Architecture
- **API** → Render (Node.js web service)
- **Frontend** → Vercel
- **Admin Panel** → Vercel (separate project)
- **Database** → MongoDB Atlas (already configured)

---

## 1. Deploy API to Render

### Steps
1. Go to [render.com](https://render.com) → New → Web Service
2. Connect your GitHub repo
3. Configure:
   - **Name:** `zembile-api`
   - **Root Directory:** `api`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** Free

### Environment Variables (add in Render dashboard)
```
NODE_ENV=production
PORT=4000
JWT_SECRET=<generate a strong 32+ char secret>
MONGODB_URI=mongodb+srv://yibieone_db_user:...@zembile.qvs7pdf.mongodb.net/
CHAPA_SECRET_KEY=CHASECK_TEST-nmuhBhxIBDDA5nbNsJ7EfFhwhR8o10Vn
CHAPA_PUBLIC_KEY=CHAPUBK_TEST-V5rhtB3XvMXTzKdzKFEplQVqJJzi3QXN
CHAPA_WEBHOOK_SECRET=DPi4ET5RMgetAyq0Qllj6E9T
FRONTEND_URL=https://zembile.vercel.app
ADMIN_URL=https://zembile-admin.vercel.app
API_BASE_URL=https://zembile-api.onrender.com
MAX_FILE_SIZE=5242880
```

After deploy, your API URL will be: `https://zembile-api.onrender.com`

> **Note:** Free Render services spin down after 15 min of inactivity. First request after sleep takes ~30s.

---

## 2. Deploy Frontend to Vercel

### Steps
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### Environment Variables (add in Vercel dashboard)
```
VITE_API_URL=https://zembile-api.onrender.com/api
```

After deploy, your frontend URL will be: `https://zembile.vercel.app`

---

## 3. Deploy Admin Panel to Vercel

### Steps
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import the **same** GitHub repo
3. Configure:
   - **Root Directory:** `adminpanel`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### Environment Variables
```
VITE_API_URL=https://zembile-api.onrender.com/api
```

After deploy, your admin URL will be: `https://zembile-admin.vercel.app`

---

## 4. Update CORS After Deployment

Once you have your actual Vercel URLs, update these in Render's environment variables:
```
FRONTEND_URL=https://your-actual-frontend.vercel.app
ADMIN_URL=https://your-actual-admin.vercel.app
```

---

## 5. Update Chapa Webhook URL

In your [Chapa dashboard](https://dashboard.chapa.co):
- Set webhook URL to: `https://zembile-api.onrender.com/api/chapa/callback`

---

## Quick Checklist

- [ ] Push code to GitHub
- [ ] Deploy API to Render, add all env vars
- [ ] Deploy frontend to Vercel with `VITE_API_URL`
- [ ] Deploy admin panel to Vercel with `VITE_API_URL`
- [ ] Update `FRONTEND_URL` and `ADMIN_URL` in Render with actual Vercel URLs
- [ ] Test login at `https://zembile-admin.vercel.app` with `admin@zembile.com` / `admin123456`
- [ ] Test a product purchase on the frontend
- [ ] Update Chapa webhook URL in Chapa dashboard

---

## Local Development

```bash
# API
cd api && npm run dev        # runs on http://localhost:4000

# Frontend
cd frontend && npm run dev   # runs on http://localhost:5174

# Admin Panel
cd adminpanel && npm run dev # runs on http://localhost:3001
```
