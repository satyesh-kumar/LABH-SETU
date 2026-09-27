# LabhSetu — Deployment Guide

## 1. Quick Start (Local Development)

### Prerequisites
- Node.js v18+ (tested on v22.x)
- npm v9+
- Python 3.10+ (Optional for dedicated AI microservice)

### Step 1: Install Dependencies
```bash
# In server directory
cd server
npm install

# In client directory
cd ../client
npm install
```

### Step 2: Configure Environment
Copy `.env.example` in root or create `.env` in `server/`:
```env
PORT=5000
MONGODB_URI= # Leave empty to use embedded in-memory MongoDB
JWT_SECRET=labhsetu_jwt_secret_dev_key
CLIENT_URL=http://localhost:5173
```

### Step 3: Run Database Seed (Optional)
The server auto-seeds demo schemes on first boot if the database is empty. You can also trigger it manually:
```bash
cd server
npm run seed
```

### Step 4: Start Applications
```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd client
npm run dev
```

Visit the application at: `http://localhost:5173`

---

## 2. Docker Deployment
A complete multi-container setup is defined in `docker-compose.yml`:
```bash
docker-compose up --build
```
This runs:
- `labhsetu-client`: Frontend on port 5173
- `labhsetu-server`: API on port 5000
- `labhsetu-ai-service`: AI Service on port 8000
- `labhsetu-mongodb`: MongoDB 6.0 on port 27017

---

## 3. Cloud Deployment
- **Frontend:** Build with `npm run build` and deploy `dist/` to Vercel, Netlify, or AWS CloudFront.
- **Backend:** Deploy `server/` to Render, AWS App Runner, or Railway with MongoDB Atlas connection string.
- **AI Service:** Deploy `ai-service/` as a containerized service on Render or Cloud Run.
