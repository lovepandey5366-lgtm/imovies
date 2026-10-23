# Deploy for free, no domain purchase

You will get three free URLs: the site (`your-app.vercel.app`), the API (`your-api.onrender.com`), and a cloud database. Total cost: 0.

## 0. Push to GitHub
```bash
cd imovies
git init
git add .
git commit -m "IMovies MERN app"
git branch -M main
git remote add origin https://github.com/<your-username>/imovies.git
git push -u origin main
```
Create the empty `imovies` repo on github.com first. The `.gitignore` already keeps `node_modules` and secrets out.

## 1. Database: MongoDB Atlas (free M0)
1. Sign up at mongodb.com/atlas, create a free **M0** cluster.
2. **Database Access**: add a user with a password (save it).
3. **Network Access**: add IP `0.0.0.0/0` (Render uses changing IPs).
4. **Connect → Drivers**: copy the connection string and replace `<password>`. Add the database name: `...mongodb.net/imovies?retryWrites=true&w=majority`.

## 2. Backend: Render (free web service)
1. Sign up at render.com with GitHub → **New → Web Service** → pick your repo.
2. Settings: **Root Directory** `server`, **Build** `npm install`, **Start** `npm start`, **Instance** Free. (Or use **New → Blueprint**, which reads `render.yaml`.)
3. Environment variables:
   - `MONGO_URI` = your Atlas string
   - `JWT_SECRET` = any long random string
   - `CLIENT_URL` = your Vercel URL (add it after step 3; no trailing slash)
4. Deploy. Open `https://<your-api>.onrender.com/api/health`. You should see `{"status":"ok"}`.
5. **Seed data once** from your own computer, using the same Atlas string:
   ```bash
   cp server/.env.example server/.env   # put the Atlas MONGO_URI in it
   npm --prefix server install
   npm run seed
   ```
Free Render services sleep after ~15 minutes idle; the first request afterwards takes up to a minute. Mention this if you demo it.

## 3. Frontend: Vercel (free)
1. Sign up at vercel.com with GitHub → **Add New → Project** → import the repo.
2. **Root Directory**: `client`. Framework preset: Vite (auto-detected).
3. Environment variable: `VITE_API_URL` = `https://<your-api>.onrender.com/api`
4. Deploy. Your site is live at `https://<project>.vercel.app`.
5. Go back to Render and set `CLIENT_URL` to that exact Vercel URL, then redeploy the API.

`client/vercel.json` already handles page refreshes on routes like `/admin`.

### Alternative: Netlify
Base directory `client`, build command `npm run build`, publish directory `client/dist`, same `VITE_API_URL` variable. `client/public/_redirects` handles routing.

## Troubleshooting
- **Movies do not load / CORS error**: `CLIENT_URL` on Render must match the site URL exactly (https, no trailing slash). Redeploy after changing it.
- **Request is slow the first time**: Render free tier waking up.
- **MongoDB connection failed in logs**: wrong password, missing `/imovies` database name, or Atlas Network Access not set to `0.0.0.0/0`.
- **Changed `VITE_API_URL`**: redeploy the frontend; Vite bakes it in at build time.
