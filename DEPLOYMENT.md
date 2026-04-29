# PassTheSalt Deployment Guide

This document covers local development, Railway backend deployment, and GitHub Pages frontend deployment.

## 📋 Overview

- **Backend**: Spring Boot + PostgreSQL running on Railway
- **Frontend**: React + Vite deployed on GitHub Pages
- **Local Development**: Both backend and frontend run locally with fallback support

---

## 🚀 Local Development Setup

### Prerequisites
- Java 17 (for backend)
- Node.js 18+ (for frontend)
- PostgreSQL 12+ (or use Railway's PostgreSQL)
- Maven 3.8+

### 1. Backend - Local PostgreSQL Setup

Create `.env` file in the project root:

```plaintext
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=yourpassword
PGDATABASE=passthesalt
PORT=8080
CLERK_SECRET_KEY=sk_test_PDXnC4byowNftxwEv8HnNGByXs9OfL8iHKKvOdJqXV
```

Or use Railway's PostgreSQL:

```plaintext
PGHOST=your-railway-postgres-host
PGPORT=5432
PGUSER=your-pg-user
PGPASSWORD=your-pg-password
PGDATABASE=your-pg-database
PORT=8080
CLERK_SECRET_KEY=sk_test_PDXnC4byowNftxwEv8HnNGByXs9OfL8iHKKvOdJqXV
```

### 2. Start Backend Locally

```bash
cd backend
mvn -DskipTests spring-boot:run
```

Backend will start on `http://localhost:8080`

### 3. Frontend - Local Setup

Create `frontend/.env.local`:

```plaintext
VITE_BASE_PATH=/
VITE_BACKEND_URL=http://localhost:8080
```

Start frontend development server:

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at `http://localhost:3000` (or `http://localhost:3001` if 3000 is in use).

The Vite dev proxy will forward all `/api/*` requests to `http://localhost:8080`.

---

## 🚀 Production Deployment

### Railway Backend Setup

1. **Create Railway Project**
   - Go to [Railway.app](https://railway.app)
   - Create a new project
   - Add PostgreSQL plugin
   - Add Java plugin

2. **Configure Environment Variables**

   In Railway Dashboard, add these environment variables:
   - `PGHOST`: Railway PostgreSQL host (auto-provided)
   - `PGPORT`: 5432
   - `PGUSER`: Railway PostgreSQL user (auto-provided)
   - `PGPASSWORD`: Railway PostgreSQL password (auto-provided)
   - `PGDATABASE`: passthesalt (or your db name)
   - `CLERK_SECRET_KEY`: Your Clerk secret key

3. **Deploy Backend to Railway**

   Connect your GitHub repo to Railway:
   - Go to Railway → Your Project → Connect Repository
   - Select your GitHub repo
   - Set root directory to `backend/`
   - Railway will auto-detect Maven and build

4. **Get Railway Backend URL**

   After deployment, note the production URL (e.g., `https://passthesalt-production.up.railway.app`)

### GitHub Pages Frontend Setup

1. **Update GitHub Secrets**

   In your GitHub repo settings → Secrets and variables → Actions, add:
   - `VITE_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key

2. **Enable GitHub Pages**
   - Go to repo → Settings → Pages
   - Set source to "GitHub Actions"
   - The workflow will auto-deploy on push to `main` branch

3. **Update Frontend for Production**

   The workflow uses:
   ```
   VITE_BASE_PATH=/PassTheSalt/
   VITE_BACKEND_URL=https://passthesalt-production.up.railway.app
   ```

   (Update the backend URL to match your Railway deployment)

### Frontend Automatic Deployment

Once GitHub Actions workflow is set up, push to `main` branch:

```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

GitHub Actions will automatically build and deploy to GitHub Pages at:
`https://yourusername.github.io/PassTheSalt/`

---

## 🔐 CORS Configuration

Backend `SecurityConfig` is configured to allow requests from:
- Local development: `http://localhost:3000`, `http://localhost:3001`, `http://127.0.0.1:3001`
- Production: `https://yourusername.github.io/PassTheSalt/`

Update `backend/src/main/java/com/passthesalt/config/SecurityConfig.java` if needed:

```java
private static final List<String> ALLOWED_ORIGINS = List.of(
    "http://localhost:3000",
    "http://localhost:3001",
    "https://yourusername.github.io/PassTheSalt/");
```

---

## 🔑 Clerk Configuration

**Publishable Key** (frontend):
```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

**Secret Key** (backend):
```
CLERK_SECRET_KEY=sk_test_...
```

Add test accounts in Clerk Dashboard:
- `alekmillionaire@salt.dev` (Admin role)
- `venujan.nagendirakumer@salt.dev` (User role)
- `notajm@salt.dev` (Mob role)

---

## 📝 API Configuration

### Frontend API URLs

The frontend uses `VITE_BACKEND_URL` environment variable:

- **Local Dev**: `http://localhost:8080` (via Vite proxy)
- **Production**: `https://passthesalt-production.up.railway.app` (full URL)

Update these in:
- `frontend/.env.local` (development)
- `frontend/.env.production` (production)
- `.github/workflows/deploy-frontend.yml` (GitHub Actions)

---

## 🛠️ Troubleshooting

### Backend returns 401 Unauthorized

1. Verify `CLERK_SECRET_KEY` is set in Railway
2. Check that Authorization header is being sent: `Authorization: Bearer <token>`
3. Verify Clerk issuer matches in backend config

### Frontend can't reach backend

1. Check `VITE_BACKEND_URL` in `.env.local` or `.env.production`
2. Verify backend is running and accessible
3. Check CORS headers in backend response
4. In production, ensure GitHub Pages URL is in `ALLOWED_ORIGINS`

### Clerk login fails

1. Verify `VITE_CLERK_PUBLISHABLE_KEY` is set
2. Check Clerk dashboard for test account existence
3. Verify user role is set in database after first login

---

## 📊 Database Management

### Local PostgreSQL

```bash
# Connect to local database
psql -U postgres -d passthesalt -h localhost

# Common queries
\dt                    # List all tables
\d users               # Describe users table
SELECT * FROM users;   # Query users
```

### Railway PostgreSQL

```bash
# Via Railway CLI
railway connect postgresql

# Or use pgAdmin/DBeaver with Railway credentials
```

### Schema Creation

Hibernate auto-creates tables on first run (see `spring.jpa.hibernate.ddl-auto=update`).

---

## 🧪 Testing Checklist

### Local Development
- [ ] Backend starts: `mvn spring-boot:run`
- [ ] Frontend starts: `npm run dev`
- [ ] Login works with Clerk
- [ ] API calls succeed (check Network tab)
- [ ] All three roles (admin, user, mob) route correctly

### Production
- [ ] Backend deployed on Railway
- [ ] PostgreSQL database connected
- [ ] Frontend builds and deploys to GitHub Pages
- [ ] Frontend can reach backend (no 401 errors)
- [ ] Clerk authentication works in production
- [ ] All pages load correctly on GitHub Pages URL

---

## 📚 References

- [Railway Documentation](https://docs.railway.app)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Clerk Documentation](https://clerk.com/docs)
- [Vite Documentation](https://vitejs.dev)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)

