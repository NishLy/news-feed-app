# News Feed App Monorepo

This is a monorepo for the **News Feed App**, containing both the backend (NestJS) and frontend (Next.js) applications.

---

## Features

| Feature                | Description                                                                                                                                                                                           | Status    |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| User Management        | Allows users to create an account with a unique username and password. Users can also log in to receive a session token and refresh token (JWT) for authentication.                                   | Developed |
| Post Creation          | Authenticated users can create text-based posts with a maximum length of 200 characters. Each post stores a unique ID, the user's ID, the content, and a creation timestamp.                          | Developed |
| Follow/Unfollow System | Users have the ability to follow and unfollow other users. A user cannot follow themselves. This relationship is stored in the database.                                                              | Developed |
| News Feed              | Logged-in users can view a news feed that displays posts from all the users they follow. The feed is sorted chronologically, showing the newest posts first, and includes infinite scroll pagination. | Developed |
| UI/UX Enhancements     | The user interface includes real-time character counters, relative time for posts, instant UI updates for new posts and follow/unfollow actions without page reloads, and clear error messaging.      | Developed |
| API & Database         | A RESTful API is built with Node.js/Nest to handle all functionalities, including user actions and data retrieval. It uses a PostgreSQL database with a defined schema for users, posts, and follows. | Developed |

---

## Getting Started

### 1. Install Dependencies

Run the following command in the project root:

```bash
npm install
npm install-deps
```

### 2. Run Development Servers

Start both backend and frontend together:

```bash
npm run dev
```

- Backend (NestJS) → runs on http://localhost:4000
- Frontend (Next.js) → runs on http://localhost:3000

Run separately if needed:
npm run dev:backend # backend only
npm run dev:frontend # frontend only

### 3. Build for Production

```bash
npm run build
```

Build separately:

```bash
npm run build:backend
npm run build:frontend
```

### 4. Database Migrations

```bash
npm run migration
```

### 5. Testing

```bash
npm run test
```

6. Linting

```bash
npm run lint
```

API Documentation

The backend (NestJS) provides interactive API documentation powered by Swagger.

Once the backend is running, open:
👉 http://localhost:4000/api-docs

This page provides:

API endpoints with request/response schemas

Example payloads

Authentication setup

---

### Author

Adhi Pamungkas Wijayadi
