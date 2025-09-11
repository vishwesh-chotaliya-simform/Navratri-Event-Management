# Navratri Event Management

This is a full-stack event management application for Navratri, featuring user registration, admin dashboard, event management, QR code ticketing, and check-in.

## Structure

- `backend/` — Node.js/Express API
- `frontend/` — React/MUI client

## Setup

1. Install dependencies:
   ```sh
   cd backend && npm install
   cd ../frontend && npm install --force
   ```

2. Configure environment variables in `backend/.env`.

3. Start servers:
   ```sh
   cd backend && npm run dev
   cd ../frontend && npm start
   ```

## Features

- User registration for events
- QR code ticketing (email delivery)
- Admin dashboard for event/user management
- Secure check-in via QR scan

## License

MIT