# Vercel Deployment Guide for NOIR E-Commerce Store

## Quick Fix for 404 Error ✅

The `vercel.json` file has been created with the proper configuration to fix the 404 error. This file tells Vercel how to:
1. Build your React app from the `Frontend` folder
2. Serve all routes correctly (fixes the 404 error)
3. Handle client-side routing for your single-page application

## Files Added/Modified:

1. ✅ `vercel.json` - Main configuration file
2. ✅ `Frontend/vite.config.ts` - Updated build settings
3. ✅ `Frontend/services/api.ts` - Dynamic API URL support
4. ✅ `Frontend/vite-env.d.ts` - TypeScript definitions
5. ✅ `Frontend/.env.example` - Environment variable template

## Step-by-Step Deployment

### Step 1: Push to GitHub

Your changes are ready to be pushed. Run these commands:

```bash
cd "D:\DBMS Project\E-commerce Store"
git add .
git commit -m "Add Vercel deployment configuration"
git push origin main
```

### Step 2: Deploy on Vercel

1. Go to https://vercel.com and sign in with GitHub
2. Click "Add New Project"
3. Import your repository: `ecommerce-clothing-store`
4. Vercel will automatically detect the `vercel.json` configuration
5. **Important:** Add environment variable:
   - Variable name: `VITE_API_URL`
   - Value: Your backend URL (for now, you can use `http://localhost:5000` or deploy backend first)
6. Click "Deploy"

### Step 3: Deploy Your Backend (Important!)

Your frontend needs a live backend API. Options:

#### Option A: Railway (Recommended - Easy & Free Tier)
1. Go to https://railway.app
2. Sign in with GitHub
3. Create new project → Deploy from GitHub repo
4. Select your repository
5. Add environment variables (all from your `.env` file)
6. Railway will give you a URL like `https://your-app.up.railway.app`
7. Copy this URL and update `VITE_API_URL` in Vercel

#### Option B: Render
1. Go to https://render.com
2. Sign in with GitHub
3. Create new Web Service
4. Connect your repository
5. Set build command: `pip install -r requirements.txt`
6. Set start command: `python app.py`
7. Add environment variables
8. Copy the URL and update in Vercel

#### Option C: PythonAnywhere
1. Go to https://www.pythonanywhere.com
2. Create account and upload your files
3. Set up MySQL database
4. Configure WSGI file for Flask
5. Get your URL and update in Vercel

## After Backend Deployment

1. Go back to Vercel dashboard
2. Go to your project → Settings → Environment Variables
3. Update `VITE_API_URL` with your backend URL
4. Redeploy (Vercel → Deployments → Click "..." → Redeploy)

## Testing Your Deployment

1. Visit your Vercel URL (e.g., `https://your-app.vercel.app`)
2. You should see the homepage (no more 404!)
3. Try navigating to different pages
4. Test login/register functionality
5. Test product browsing and cart features

## Troubleshooting

### Still getting 404?
- Check if `vercel.json` was pushed to GitHub
- Check Vercel build logs for errors
- Make sure Output Directory is set to `Frontend/dist`

### API not working?
- Check if `VITE_API_URL` is set in Vercel
- Check if backend is deployed and running
- Check CORS settings in `app.py`

### Build fails?
- Check if `package.json` has correct dependencies
- Check Vercel build logs for specific errors
- Try building locally first: `cd Frontend && npm run build`

## Important Notes

⚠️ **For Development:**
- The app will use `http://localhost:5000` as API URL
- Make sure backend is running locally

⚠️ **For Production:**
- Set `VITE_API_URL` environment variable in Vercel
- Point it to your deployed backend URL
- Make sure to update CORS in backend to allow your Vercel domain

## CORS Configuration in Backend

Make sure your `app.py` has this CORS configuration:

```python
from flask_cors import CORS

# Update CORS to include your Vercel URL
CORS(app, resources={
    r"/*": {
        "origins": [
            "http://localhost:3000",
            "http://localhost:3001",
            "https://your-app.vercel.app"  # Add your Vercel URL
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})
```

## Success Checklist ✓

- [ ] `vercel.json` created
- [ ] Code pushed to GitHub
- [ ] Project imported to Vercel
- [ ] Deployment successful (no 404 error)
- [ ] Backend deployed
- [ ] `VITE_API_URL` set in Vercel
- [ ] CORS updated in backend
- [ ] Full app working on Vercel URL

---

Good luck with your deployment! 🚀
