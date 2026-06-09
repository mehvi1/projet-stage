# PBxcom Delivery Checklist

## Current status

- Frontend build: passes with `npm run build`.
- Frontend lint: passes with `npm run lint`.
- Backend startup: blocked until `MONGO_URI` is replaced with a real MongoDB Atlas connection string.

## Required production services

1. MongoDB Atlas database
2. Hosted backend API
3. Vercel frontend
4. SMTP mailbox or app password for email notifications

## Recommended deployment

Use Vercel for the frontend and Render or Railway for the backend API.

### Backend service

Deploy the `backend` folder as a Node web service.

Build command:

```bash
npm install
```

Start command:

```bash
npm start
```

Required backend environment variables:

```env
PORT=5000
MONGO_URI=mongodb+srv://REAL_USER:REAL_PASSWORD@REAL_CLUSTER.mongodb.net/pbxcom?retryWrites=true&w=majority
JWT_SECRET=long-random-secret-at-least-32-characters
CLIENT_URL=https://YOUR_FRONTEND_DOMAIN
CORS_ORIGINS=https://YOUR_FRONTEND_DOMAIN
ADMIN_NAME=PBxcom
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=strong-admin-password
ADMIN_COMPANY=PBxcom
SMTP_HOST=smtp.example.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=notifications@example.com
SMTP_PASS=real-smtp-password
EMAIL_FROM="PBxcom Support <notifications@example.com>"
```

After backend deployment succeeds, open:

```text
https://YOUR_BACKEND_DOMAIN/api/health
```

Expected response:

```json
{"status":"ok","service":"pbxcom-api"}
```

Then run the admin creation command on the backend host:

```bash
npm run admin:create
```

### Frontend service

Deploy the root project to Vercel.

Build command:

```bash
npm run build
```

Output directory:

```text
dist
```

Required Vercel environment variables:

```env
VITE_API_URL=https://YOUR_BACKEND_DOMAIN/api
VITE_ENABLE_LOCAL_DEMO=false
```

Redeploy Vercel after changing these values.

## MongoDB Atlas checklist

1. Create a database user in Database Access.
2. Use that exact username and password in `MONGO_URI`.
3. URL-encode special characters in the password.
4. Add the backend host IP to Network Access, or temporarily allow `0.0.0.0/0` with a strong password.
5. Test backend startup again.

## Final client smoke test

1. Open frontend login page.
2. Login with the real admin account.
3. Create an employee account.
4. Register a client account.
5. Client creates a ticket.
6. Admin sees the ticket.
7. Admin opens the ticket and status changes to `Seen`.
8. Admin changes ticket to `In Progress`, then `Resolved`.
9. Client sees the updated status.
10. Test message replies from both sides.
11. Test one small attachment.
12. Test password reset email.
13. Test logout/login again.
14. Confirm no browser console errors.

## Important security notes

- Do not commit real `.env` files.
- Rotate any MongoDB, JWT, SMTP, or admin passwords that were shared or committed.
- Do not deliver with `VITE_ENABLE_LOCAL_DEMO=true`.
- Use a strong admin password and change it before handoff.
