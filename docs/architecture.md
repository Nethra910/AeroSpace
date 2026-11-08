# MANI Aerospace — Architecture

## Technology Stack

- Frontend: React + Vite
- Styling: Tailwind CSS
- Routing: React Router
- Backend: Python + FastAPI
- API: REST
- Database: MySQL
- 3D Simulator: Three.js

## System Architecture

```text
Browser
   |
   v
React Frontend
   |
   | REST API / HTTP
   v
FastAPI Backend
   |
   v
MySQL Database
```

## Frontend Responsibilities

- Page rendering and routing
- Shared layouts and components
- API communication
- Authentication state
- Admin dashboard

## Backend Responsibilities

- API endpoints
- Authentication and authorization
- Business logic
- Input validation
- Database operations

## Security

- Password hashing
- Protected admin endpoints
- Session-based authentication
- Environment variables for secrets

## Deployment

Frontend, backend, and database will be deployed separately.
