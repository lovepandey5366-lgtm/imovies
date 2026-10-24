# IMovies: Movie Ticket Booking Made Simple

A full-stack **MERN** application (MongoDB, Express, React, Node.js) featuring a modern **Midnight Sapphire & Electric Cyan** cinema design, real-world blockbuster movies with official HD posters, interactive live seat mapping, and all-in-one deployment on **Vercel** with a **MongoDB Atlas** cloud database.

---

## Project Structure

```
imovies/
├── api/             Vercel serverless function entry point (Express app wrapper)
├── client/          React 18 + Vite frontend
│   ├── public/      Static assets, favicon, redirects
│   ├── src/         React components, pages, context, styles
│   └── vercel.json  Client routing configuration
├── server/          Node.js + Express REST API (MVC pattern)
│   ├── src/
│   │   ├── config/       Database connection
│   │   ├── controllers/  Auth, Movie, Theatre, Show, Booking controllers
│   │   ├── middleware/   JWT authentication & error handlers
│   │   ├── models/       Mongoose schemas (User, Movie, Theatre, Show, Booking)
│   │   ├── routes/       Express route definitions
│   │   └── seed.js       Seeding script for real movies, theatres, and admin
│   └── server.js    Express server entry point
├── docs/            Architecture, ER diagram, deployment guide
├── vercel.json      Root Vercel fullstack build & rewrite configuration
└── package.json     Root helper scripts and serverless dependencies
```

---

## Features

### User & Cinema Experience
* **Real-World Blockbuster Movies**: Official HD posters and details across Comedy, Romance, Action, Sci-Fi, and Drama (*Deadpool & Wolverine, Barbie, La La Land, Titanic, Oppenheimer, Interstellar, The Dark Knight, Dune 2, Spider-Verse, Top Gun, The Batman, RRR, Kung Fu Panda, The Hangover, Anyone But You*).
* **Dynamic Auto-Moving Marquee**: Infinite trending reel of movie posters gliding across the screen with interactive hover-to-pause and one-click booking.
* **Dual Vertical Stream**: Ambient floating cinema perks and feature tiles streaming continuously along the right side of the hero section.
* **Interactive 3D Motion**: Smooth spring-tilt elevation, poster zoom, and electric-cyan spotlight halos on movie cards.
* **Interactive Seat Selection**: Dynamic seat map with spring pop animations, booked seat locking, double-booking prevention, and an ambient glowing curved cinema screen.
* **Authentication**: Secure JWT-based user authentication with bcrypt password hashing.
* **My Bookings / Digital Tickets**: Boarding pass-style digital tickets with tear-off stubs, QR identifiers, and live ticket cancellation.

### Admin Dashboard
* **Content Management**: Add and delete movies, theatres, and showtime schedules.
* **Booking Oversight**: View all user bookings, occupancy stats, and transactions across theatres.
* Default Admin Login: `admin@imovies.com` / `Admin@123` (configurable in `server/.env`).

---

## Run Locally

### Prerequisites
* **Node.js** (v18 or higher)
* **MongoDB** (local instance or free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)

### Setup Steps

```bash
# 1. Clone repository
git clone https://github.com/lovepandey5366-lgtm/imovies.git
cd imovies

# 2. Install all dependencies (root, server, and client)
npm run install:all
npm install

# 3. Configure environment variables
# Copy server/.env.example to server/.env and fill in values:
# PORT=5000
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret_key
# CLIENT_URL=http://localhost:5173

# 4. Seed initial database (movies, theatres, shows, admin user)
npm run seed

# 5. Start development servers
# Terminal 1 (Backend API):
npm run dev:server

# Terminal 2 (Frontend Client):
npm run dev:client
```

Client runs at: `http://localhost:5173`  
Backend API runs at: `http://localhost:5000`

---

## Deployment (Vercel + MongoDB Atlas)

The repository is configured for **All-in-One Full-Stack Deployment on Vercel**:

1. **Database**: Hosted on [MongoDB Atlas](https://www.mongodb.com/atlas) (Free M0 Cluster).
   * Network Access must include `0.0.0.0/0` (Allow Access from Anywhere).
2. **Frontend & Backend**: Hosted together on [Vercel](https://vercel.com) via `vercel.json` and `api/index.js`.
   * **Root Directory**: `./` (Root)
   * **Build Command**: `npm run build`
   * **Output Directory**: `client/dist`
   * **Environment Variables**:
     * `MONGO_URI`: `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/imovies?retryWrites=true&w=majority`
     * `JWT_SECRET`: Any random secure secret string

---

## REST API Summary

| Method | Route | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & issue JWT token |
| `GET` | `/api/auth/me` | User | Get current logged-in user profile |
| `GET` | `/api/movies` | Public | List movies (supports `?q=` search and `?genre=` filter) |
| `GET` | `/api/movies/:id` | Public | Get single movie details and metadata |
| `POST` | `/api/movies` | Admin | Create a new movie listing |
| `PUT` | `/api/movies/:id` | Admin | Update an existing movie |
| `DELETE` | `/api/movies/:id` | Admin | Delete movie and cascade-delete associated shows |
| `GET` | `/api/theatres` | Public | List all theatres and seating configurations |
| `POST` | `/api/theatres` | Admin | Create a new theatre |
| `PUT` | `/api/theatres/:id` | Admin | Update theatre details |
| `DELETE` | `/api/theatres/:id` | Admin | Delete theatre |
| `GET` | `/api/shows` | Public | List shows (supports `?movie=<id>` filter) |
| `GET` | `/api/shows/:id` | Public | Get show details with real-time seat availability map |
| `POST` | `/api/shows` | Admin | Create a showtime for a movie at a theatre |
| `DELETE` | `/api/shows/:id` | Admin | Delete showtime |
| `POST` | `/api/bookings` | User | Book selected seats (atomic seat-lock validation) |
| `GET` | `/api/bookings/mine` | User | View current user's booked tickets |
| `PATCH` | `/api/bookings/:id/cancel` | Owner / Admin | Cancel a booking and release seats back to show |
| `GET` | `/api/bookings` | Admin | View all system-wide bookings |
| `GET` | `/api/health` | Public | Serverless health check (`{"status":"ok"}`) |

---

## Tech Stack

* **Frontend**: React 18, React Router DOM 6, Vite, CSS Modules / Custom Glassmorphic CSS Variables
* **Backend**: Node.js, Express 4, Vercel Serverless Functions (`@vercel/node`)
* **Database & ODM**: MongoDB Atlas, Mongoose 8 (cached serverless connections)
* **Authentication**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs`
* **Typography**: Bricolage Grotesque, Instrument Sans

  Video for better Understanding
  https://www.loom.com/share/2bc45893ad3248e0acc8e6a5813e227c
