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

## Real email notifications

Real emails are sent only by the backend. The frontend can show local website notifications for demo mode, but inbox delivery requires:

- A valid `MONGO_URI`, because the API does not start until MongoDB connects.
- Valid SMTP values: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, and `EMAIL_FROM`.
- `CLIENT_URL` matching the frontend URL, so email links open the right app.

When SMTP is missing or rejected, ticket actions still save successfully and the API returns an `emailNotification` status explaining whether email was sent, skipped, or failed.

The frontend currently uses a persisted local mock store so the app is immediately usable without a database. If the backend is unavailable, tickets are saved locally and real email cannot be sent.
