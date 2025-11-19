# Backend Server

Express.js server with TypeScript and MongoDB (Mongoose) for authentication.

## Installation

```bash
npm install
```

## Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update `.env` with your MongoDB connection string and JWT secret.

## Running the Server

### Development mode
```bash
npm run dev
```

### Production mode
```bash
npm run build
npm start
```

## API Endpoints

### Public Routes

#### Register
- **POST** `/api/auth/register`
- Body: `{ "email": "user@example.com", "password": "password123" }`
- Response: `{ "success": true, "token": "...", "user": { "id": "...", "email": "..." } }`

#### Login
- **POST** `/api/auth/login`
- Body: `{ "email": "user@example.com", "password": "password123" }`
- Response: `{ "success": true, "token": "...", "user": { "id": "...", "email": "..." } }`

### Protected Routes

#### Get Current User
- **GET** `/api/auth/me`
- Headers: `Authorization: Bearer <token>`
- Response: `{ "success": true, "user": { "id": "...", "email": "..." } }`

## Technologies

- Express.js
- TypeScript
- MongoDB (Mongoose)
- JWT for authentication
- bcryptjs for password hashing

