# PBxcom API Blueprint

This folder is a production-oriented Express and MongoDB architecture for the PBxcom support platform.

## Main endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/tickets`
- `POST /api/tickets`
- `PATCH /api/tickets/:id/status`
- `POST /api/tickets/:id/notes`

## Create the real admin account

Copy `.env.example` to `.env`, fill `MONGO_URI`, `JWT_SECRET`, and the `ADMIN_*` values, then run:

```bash
npm run admin:create
```

This creates or updates one real admin in MongoDB. Clients should register normally from the frontend, so fake clients and fake tickets are not needed.

The frontend currently uses a persisted local mock store so the app is immediately usable without a database. Point `VITE_API_URL` to this API and replace store calls with `src/services/api.js` requests when the server is deployed.
