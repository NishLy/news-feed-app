# News Feed App Monorepo

This is a monorepo for the **News Feed App**, containing both the backend (NestJS) and frontend (Next.js) applications.

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
