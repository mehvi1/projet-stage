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
- For Gmail, set `EMAIL_PROVIDER=gmail`, put the Gmail address in `SMTP_USER`, and use a Gmail app password in `SMTP_PASS`.
- `CLIENT_URL` matching the frontend URL, so email links open the right app.

When SMTP is missing or rejected, ticket actions still save successfully and the API returns an `emailNotification` status explaining whether email was sent, skipped, or failed.

The frontend can still run a local demo only when `VITE_ENABLE_LOCAL_DEMO=true`. For real multi-computer work, keep the backend API and MongoDB running so tickets, status changes, files, and notifications are shared through the database.
