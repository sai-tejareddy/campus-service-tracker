# Campus Service Tracker

Campus Service Tracker is a small full-stack application for students to raise campus service requests and follow their progress.

It is intentionally built as a learning project: the backend and frontend are separated, the API is easy to trace, and the features are small enough to explain in an interview.

## Repository history

This is a synthetic sandbox project. Its initial commit history is for demonstration and does not represent the actual dates or sequence of development.

## Features

- Student registration and JWT login
- Staff seed account for testing support workflows
- Create and view service requests
- Search by title or description
- Filter by status and priority
- Update request status and priority
- Staff support queue with status ownership
- Request details with comments and follow-up conversation
- Pagination
- Request ownership checks
- Validation and consistent API errors
- Responsive React dashboard with loading, empty, and error states

## Project structure

```text
campus-service-tracker/
├── backend/    Spring Boot, JPA, H2, Spring Security, JWT
└── frontend/   React, Vite, React Router, Axios, plain CSS
```

## Run the backend

Requirements: Java 17 and Maven 3.9+.

```bash
cd backend
mvn spring-boot:run
```

The backend starts at `http://localhost:8080`. The default development database is an H2 file under `backend/data`.

Seed staff account:

```text
Email: staff@campus.local
Password: staff123
```

Use a different password outside local development.

## Run the frontend

Requirements: Node.js 18+.

```bash
cd frontend
npm install
npm run dev
```

The frontend starts at `http://localhost:5174` for the local development run and proxies `/api` requests to the backend.

## Deploy to Railway

This repository deploys as two Railway services from the same Git repository; Docker is not required.

1. Create a Railway project and add two services from this repository.
2. For the **backend** service, set **Root Directory** to `/backend`. Generate a public domain, attach a volume at `/data`, then set these variables:

   ```text
   DATA_DIR=/data
   JWT_SECRET=<a unique secret of at least 32 characters>
   FRONTEND_URL=<the public frontend URL>
   ```

3. For the **frontend** service, set **Root Directory** to `/frontend`, generate a public domain, and set:

   ```text
   VITE_API_URL=<the public backend URL>/api
   ```

4. Redeploy the frontend after adding `VITE_API_URL`; Vite injects this value during its build. Update `FRONTEND_URL` with the exact frontend URL if its Railway domain changes.

The Railway configuration files pin the native Railpack build and production start commands for each service. See Railway's [monorepo deployment guide](https://docs.railway.com/deployments/monorepo) for the service setup.

## Validate the project

```bash
cd backend
mvn test

cd ../frontend
npm run build
npm run lint
```

## API flow

```text
React form
  -> Axios request with Bearer token
  -> Spring Security JWT filter
  -> Controller validation
  -> Service ownership/business rules
  -> JPA repository
  -> H2 database
  -> DTO response
```

## Learning checklist

The candidate should be able to explain:

1. Why DTOs are used instead of returning entities directly.
2. How a JWT is created, sent, verified, and used to build a security context.
3. How request ownership prevents one student from reading another student's request.
4. How optional search and filter parameters become a paginated database query.
5. Why React state is split between authentication, filters, form data, and API results.
6. How loading, empty, validation, and API failure states are represented in the UI.
7. How the design could change for a larger dataset or multiple campuses.
8. Why students cannot change status while staff can move requests through the lifecycle.
9. How comments are scoped to a request and protected by the same visibility rule.
