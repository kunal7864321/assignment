# Mini Social Post Application

A full-stack social feed application built with the MERN stack (MongoDB, Express, React, Node.js). Users can sign up, log in, create posts with text and images, like/unlike posts, and comment.

## Tech Stack

- **Frontend:** React 18, React Bootstrap, React Router, Axios, React Icons
- **Backend:** Node.js, Express, Mongoose, JWT, bcryptjs, Multer, Cloudinary
- **Database:** MongoDB (Mongoose ODM)

## Project Structure

```
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── cloudinary.js      # Cloudinary configuration
│   ├── middleware/
│   │   └── auth.js            # JWT verification middleware
│   ├── models/
│   │   ├── User.js            # User schema (username, email, password)
│   │   └── Post.js            # Post schema (text, imageUrl, likes, comments)
│   ├── routes/
│   │   ├── auth.js            # /api/auth/signup, /api/auth/login
│   │   └── posts.js           # /api/posts CRUD, like, comment
│   ├── server.js              # Express app entry point
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/index.html
│   ├── src/
│   │   ├── api/axios.js       # Axios instance with JWT interceptor
│   │   ├── context/AuthContext.jsx  # React Context for auth state
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── PostCard.jsx
│   │   │   ├── CreatePost.jsx
│   │   │   ├── CommentSection.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── Feed.jsx
│   │   ├── App.jsx
│   │   └── index.js
│   ├── package.json
│   └── .env.example
└── README.md
```

## Environment Variables

### Backend (`backend/.env`)

| Variable                | Description                  |
| ----------------------- | ---------------------------- |
| `PORT`                  | Server port (default 5000)   |
| `MONGO_URI`             | MongoDB connection string    |
| `JWT_SECRET`            | Secret key for JWT signing   |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name        |
| `CLOUDINARY_API_KEY`    | Cloudinary API key           |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret        |
| `CORS_ORIGIN`           | Allowed CORS origin(s)       |

### Frontend (`frontend/.env`)

| Variable            | Description                       |
| ------------------- | --------------------------------- |
| `REACT_APP_API_URL` | Backend API base URL              |

## Setup Instructions

### Prerequisites

- Node.js >= 16
- MongoDB (local or Atlas)
- Cloudinary account (free tier)

### 1. Clone and install dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure environment variables

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your values

# Frontend
cp frontend/.env.example frontend/.env
# Edit frontend/.env if needed (default points to http://localhost:5000)
```

### 3. Run the application

Open two terminals:

```bash
# Terminal 1 — Backend (http://localhost:5000)
cd backend
npm run dev

# Terminal 2 — Frontend (http://localhost:3000)
cd frontend
npm start
```

### 4. Open in browser

Navigate to `http://localhost:3000`

## API Routes

| Method | Endpoint                | Auth Required | Description              |
| ------ | ----------------------- | ------------- | ------------------------ |
| POST   | `/api/auth/signup`      | No            | Register a new user      |
| POST   | `/api/auth/login`       | No            | Login                    |
| POST   | `/api/posts`            | Yes           | Create a post            |
| GET    | `/api/posts?page=&limit=` | No          | Get paginated feed       |
| POST   | `/api/posts/:id/like`   | Yes           | Toggle like              |
| POST   | `/api/posts/:id/comment`| Yes           | Add a comment            |
