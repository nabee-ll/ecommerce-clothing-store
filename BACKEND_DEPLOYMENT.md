# Backend Deployment Guide - Railway 🚂

## Quick Start: Deploy Flask Backend to Railway

Railway is the easiest way to deploy your Flask backend with MySQL database included!

### Step 1: Prepare Your Code (Already Done! ✅)

The following files have been created/updated:
- ✅ `Procfile` - Tells Railway how to start your app
- ✅ `runtime.txt` - Specifies Python version
- ✅ `requirements.txt` - Updated with gunicorn for production
- ✅ `app.py` - Updated to use dynamic PORT from environment

### Step 2: Push to GitHub

```bash
cd "D:\DBMS Project\E-commerce Store"
git add .
git commit -m "Prepare backend for Railway deployment"
git push origin main
```

### Step 3: Deploy on Railway

1. **Go to Railway**: https://railway.app/
2. **Sign in** with your GitHub account
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose your repository: `ecommerce-clothing-store`
6. Railway will automatically detect it's a Flask app

### Step 4: Add MySQL Database

1. In your Railway project, click **"New"** → **"Database"** → **"Add MySQL"**
2. Railway will create a MySQL database and provide connection details
3. The database variables will be automatically available:
   - `MYSQL_HOST`
   - `MYSQL_PORT`
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`
   - `MYSQL_DATABASE`

### Step 5: Set Environment Variables

Go to your Flask service → **Variables** tab and add:

#### Database Variables (Railway provides these automatically):
```
DB_HOST=${{MYSQL.MYSQL_HOST}}
DB_USER=${{MYSQL.MYSQL_USER}}
DB_PASSWORD=${{MYSQL.MYSQL_PASSWORD}}
DB_NAME=${{MYSQL.MYSQL_DATABASE}}
```

Or manually set:
```
DB_HOST=containers-us-west-xxx.railway.app
DB_USER=root
DB_PASSWORD=<from Railway>
DB_NAME=railway
```

#### Email Configuration:
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=your_email@gmail.com
```

#### App Configuration:
```
SECRET_KEY=<generate-a-random-secret-key>
FLASK_ENV=production
CORS_ORIGINS=http://localhost:3001,https://your-vercel-app.vercel.app
```

**Important:** Add your Vercel frontend URL to `CORS_ORIGINS` after deployment!

### Step 6: Initialize Database

Railway provides a MySQL plugin. You need to create tables:

**Option A: Use Railway's MySQL Client**
1. Go to MySQL service → **Data** tab
2. Click **Query** and run your SQL schema

**Option B: Connect from Local Machine**
1. Get connection details from Railway MySQL service
2. Use MySQL Workbench or command line:
```bash
mysql -h containers-us-west-xxx.railway.app -u root -p -D railway
```
3. Run your schema SQL

**SQL Schema to Run:**
```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    image VARCHAR(500),
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price_at_time DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

### Step 7: Get Your Backend URL

1. After deployment, Railway will provide a URL like:
   ```
   https://your-app-production.up.railway.app
   ```
2. **Copy this URL!** You'll need it for the frontend.

### Step 8: Test Your Backend

Visit these endpoints to verify:
- `https://your-app-production.up.railway.app/` - Should return status
- `https://your-app-production.up.railway.app/test` - Should return "Backend is running"
- `https://your-app-production.up.railway.app/products` - Should return products list

### Step 9: Update Frontend on Vercel

1. Go to **Vercel Dashboard**
2. Select your frontend project
3. Go to **Settings** → **Environment Variables**
4. Update `VITE_API_URL`:
   ```
   VITE_API_URL=https://your-app-production.up.railway.app
   ```
5. Go to **Deployments** → **Redeploy**

### Step 10: Update CORS in Backend

1. Go back to Railway → Your Flask service → **Variables**
2. Update `CORS_ORIGINS` to include your Vercel URL:
   ```
   CORS_ORIGINS=https://your-vercel-app.vercel.app,http://localhost:3001
   ```
3. Railway will automatically redeploy

## Deployment Checklist ✓

- [ ] Push backend code to GitHub
- [ ] Create Railway project
- [ ] Add MySQL database
- [ ] Set all environment variables
- [ ] Initialize database tables
- [ ] Add sample products (optional)
- [ ] Test backend endpoints
- [ ] Copy backend URL
- [ ] Update Vercel with backend URL
- [ ] Update CORS origins
- [ ] Test full app functionality

## Troubleshooting

### Deployment Failed?
- Check Railway logs for errors
- Verify `Procfile` exists
- Verify `requirements.txt` has all dependencies

### Database Connection Failed?
- Check if MySQL plugin is added
- Verify database environment variables
- Check if tables are created

### CORS Errors?
- Make sure your Vercel URL is in `CORS_ORIGINS`
- Format: `https://your-app.vercel.app` (no trailing slash)
- Redeploy after updating

### Can't Connect from Frontend?
- Verify `VITE_API_URL` is set correctly in Vercel
- Make sure Railway app is deployed and running
- Check if backend URL is accessible

## Alternative Deployment Options

### Option 2: Render (Also Free)

1. Go to https://render.com
2. Sign in with GitHub
3. **New** → **Web Service**
4. Connect repository
5. Settings:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Environment**: Python 3
6. Add environment variables (same as Railway)
7. Add PostgreSQL database (Render doesn't offer MySQL free tier)
   - You'll need to convert to PostgreSQL or use external MySQL

### Option 3: PythonAnywhere

1. Go to https://www.pythonanywhere.com
2. Create free account
3. Upload your code
4. Set up WSGI configuration
5. Configure MySQL database
6. More manual setup required

## Cost Comparison

| Platform | Free Tier | Database | Ease |
|----------|-----------|----------|------|
| Railway | $5 credit/month | MySQL ✅ | ⭐⭐⭐⭐⭐ |
| Render | 750 hrs/month | PostgreSQL | ⭐⭐⭐⭐ |
| PythonAnywhere | Limited | MySQL ✅ | ⭐⭐⭐ |

**Recommendation**: Use Railway for easiest deployment with MySQL! 🚂

---

## Quick Commands Reference

```bash
# Push to GitHub
git add .
git commit -m "Deploy backend"
git push origin main

# Test backend locally
python app.py

# Install production dependencies
pip install -r requirements.txt
```

Good luck with your deployment! 🚀
