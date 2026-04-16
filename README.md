# SoundAround

A social music discovery app that shows what people nearby are listening to in real time, powered by Last.fm.

## Tech Stack

- **Backend:** Spring Boot 3 (Kotlin), PostgreSQL (Supabase), JWT auth, Last.fm API
- **Frontend:** React 19 + TypeScript, Vite, Tailwind CSS, Leaflet maps

---

## Prerequisites

- Java 21+
- Node.js 18+
- Git

---

## Setup & Running

### 1. Clone the repository

```bash
git clone https://github.com/aniakchak09/SoundAroundTW.git
cd SoundAroundTW
```

### 2. Backend

```bash
cd backend/backend
./gradlew bootRun        # Linux / macOS
gradlew.bat bootRun      # Windows
```

The backend starts on **http://localhost:8080**.

> The database (Supabase/PostgreSQL) and mail (Mailtrap) credentials are already included in `application.yml`. No additional configuration is needed.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend starts on **http://localhost:5173** and proxies all `/api` calls to the backend automatically.

### 4. Quick start (Windows only)

Double-click **`start.bat`** in the root folder — opens both backend and frontend in separate terminals.

---

## Swagger UI

With the backend running, all API endpoints are documented and testable at:

```
http://localhost:8080/swagger-ui.html
```

To test protected endpoints:
1. Call `POST /api/auth/register` or `POST /api/auth/login`
2. Copy the `token` from the response
3. Click **Authorize** (top right) and enter `Bearer <token>`

---

## Features

- Register / Login with JWT authentication
- Link your Last.fm account and auto-sync now-playing track every 25 seconds
- Share your location and see nearby users on an interactive map
- Send and accept friend requests, view music match scores
- Submit app feedback
