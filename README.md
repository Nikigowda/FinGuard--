# Finguard — Full Stack Finance App

## Project Structure
```
finguard/
├── public/
│   └── index.html          ← Frontend (auto-served by Express)
├── prisma/
│   ├── schema.prisma
│   └── seed.js
├── src/
│   ├── app.js              ← Modified to serve frontend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── schemas/
│   └── services/
├── server.js
├── package.json
└── .env.example
```

---

## Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and fill in secrets
cp .env.example .env

# 3. Set up database
npx prisma migrate dev --name init
node prisma/seed.js        # optional: adds sample data

# 4. Start server
npm start
```

Open → http://localhost:3000
Frontend + backend run on the SAME port. No separate dev server needed.

---

## Deploy to Render (Full Stack — one service)

1. Push this folder to GitHub

2. Go to render.com → New → Web Service → connect your repo

3. Set:
   - Build Command:  npm install && npx prisma generate && npx prisma migrate deploy
   - Start Command:  node server.js

4. Add Environment Variables on Render:
   ```
   DATABASE_URL        = file:./dev.db
   JWT_SECRET          = (long random string)
   JWT_REFRESH_SECRET  = (another long random string)
   NODE_ENV            = production
   PORT                = 3000
   ```

5. Deploy → your app is live at https://your-app.onrender.com

---

## Roles

| Role     | What they can do |
|----------|-----------------|
| VIEWER   | View own records |
| ANALYST  | Dashboard + all records + add records |
| ADMIN    | Everything + edit/delete + user management |
