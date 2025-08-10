# Journey Tracker - MERN Stack Application

A real-time group journey tracking application built with the MERN stack.

## Features

- User authentication (signup/login)
- Journey session management
- Real-time location sharing
- Google Maps integration

## Project Structure

```
journey-tracker/
├── server/          # Node.js/Express backend
│   ├── controllers/ # Route controllers
│   ├── models/      # MongoDB models
│   ├── routes/      # API routes
│   ├── middleware/  # Authentication middleware
│   └── server.js    # Main server file
└── client/          # React frontend
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── pages/       # Page components
    │   └── services/    # API services
    └── public/
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB instance
- Google Maps API key

### Server Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file and add your environment variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Client Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file and add your Google Maps API key:
   ```
   REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

4. Start the React app:
   ```bash
   npm start
   ```

## Current Status

✅ Phase 1 Implementation (Complete):
- Project setup and environment configuration
- User authentication system (JWT-based)
- Journey session management
- Basic Google Maps integration
- MongoDB schemas for User, JourneySession, and LocationUpdate

🚧 Next Steps (Phase 2):
- Socket.IO integration for real-time location sharing
- Live map markers and updates
- Travel-time calculation using Google Maps API

## API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login

### Journey Management
- `POST /api/journeys` - Create new journey (requires auth)
- `GET /api/journeys/:code` - Join journey by code (requires auth)

## Technologies Used

### Frontend
- React.js
- React Router DOM
- Axios
- Google Maps JavaScript API

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- bcryptjs for password hashing

## Environment Variables

### Server (.env)
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### Client (.env)
```
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```
