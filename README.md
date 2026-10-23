IMovies: Movie ticket booking made simple

A full-stack **MERN** app (MongoDB, Express, React, Node.js) where users browse movies, pick a showtime, choose seats on a live seat map, book tickets, and view or cancel bookings. Admins manage movies, theatres, and shows.

```
imovies/
├── client/   React (Vite) frontend
├── server/   Node + Express REST API (MVC) + MongoDB models
├── docs/     Architecture, ER diagram, user flow, deployment guide, screenshots
├── render.yaml   One-click backend deploy config (Render)
└── package.json  Helper scripts
```

 Features
- Browse, search, and filter movies by genre
- Showtimes grouped by day, with theatre and price
- Interactive seat map; taken seats are locked, and double-booking is blocked atomically on the server
- Register / sign in (JWT, bcrypt-hashed passwords)
- My tickets page with cancel (seats are released)
- Admin area: add/delete movies, theatres, shows; view all bookings

Full list, roles, and flows: see [`docs/`](docs/).

Run locally
Requirements: Node 18+, a MongoDB database (free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster, or local MongoDB).

Admin login after seeding: `admin@imovies.com` / `Admin@123` (change via `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `server/.env` before seeding).

Publish online for free (no domain needed)
Frontend on **Vercel** (`*.vercel.app`), backend on **Render** (`*.onrender.com`), database on **MongoDB Atlas**. Step-by-step guide: [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

API summary
| Method | Route | Access |
|---|---|---|
| POST | `/api/auth/register`, `/api/auth/login` | Public |
| GET | `/api/auth/me` | User |
| GET | `/api/movies`, `/api/movies/:id` | Public |
| POST/PUT/DELETE | `/api/movies` | Admin |
| GET | `/api/theatres` | Public |
| POST/PUT/DELETE | `/api/theatres` | Admin |
| GET | `/api/shows?movie=<id>` , `/api/shows/:id` | Public |
| POST/DELETE | `/api/shows` | Admin |
| POST | `/api/bookings` | User |
| GET | `/api/bookings/mine` | User |
| PATCH | `/api/bookings/:id/cancel` | Owner or admin |
| GET | `/api/bookings` | Admin |

## Tech stack
React 18, React Router, Vite · Node.js, Express · MongoDB, Mongoose · JWT, bcryptjs
