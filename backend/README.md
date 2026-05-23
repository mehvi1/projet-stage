# PBxcom API Blueprint

This folder is a production-oriented Express and MongoDB architecture for the PBxcom support platform.

## Main endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/tickets`
- `POST /api/tickets`
- `PATCH /api/tickets/:id/status`
- `POST /api/tickets/:id/notes`

The frontend currently uses a persisted local mock store so the app is immediately usable without a database. Point `VITE_API_URL` to this API and replace store calls with `src/services/api.js` requests when the server is deployed.
