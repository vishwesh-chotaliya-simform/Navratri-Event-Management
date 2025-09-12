# Copilot Instructions for Navratri Event Management

## Project Overview

Full-stack event management for Navratri: user registration, event ticketing via QR code, admin dashboard, and secure check-in. Node.js/Express backend, React/MUI frontend.

## Architecture & Data Flow

- **Backend (`backend/`)**
  - REST API (Express), MongoDB (Mongoose models)
  - Models: `User` (compound index: email+event), `Event`, `Admin`
  - Controllers: `userController.js`, `eventController.js`, `adminController.js`
  - Middleware: `auth.js` (JWT), `role.js` (role-based access)
  - QR code generation (`qrcode`), email delivery (`nodemailer`)
- **Frontend (`frontend/`)**
  - React + Material UI (theme-based, modern design)
  - Pages: `Registration.js`, `EventList.js`, `CheckIn.js`, `AdminDashboard.js`, etc.
  - QR code scanning: `html5-qrcode` (see `CheckIn.js`)
  - Role-based UI: Admin features gated by JWT

## Developer Workflows

- **Install dependencies:**
  - `cd backend && npm install`
  - `cd ../frontend && npm install`
- **Start servers:**
  - Backend: `npm run dev` (port 5000)
  - Frontend: `npm start` (port 3000)
- **Environment setup:**
  - Create `backend/.env` (see `README.md` for required variables)
- **Debugging:**
  - Frontend: browser devtools
  - Backend: inspect logs, use Postman/cURL for API

## Key Patterns & Conventions

- **User registration:**
  - POST `/api/users/register` with event ID; triggers QR code email
  - Duplicate registration for same event blocked (compound index)
- **QR code logic:**
  - QR code encodes `PASS:<email>`
  - Check-in via QR scan (see `CheckIn.js`), POST `/api/users/checkin`
- **Admin dashboard:**
  - View users/events, preview QR, resend ticket, manage events
  - Event name links to details; QR preview does not send email
- **Error handling:**
  - Persistent error messages in check-in; only cleared on explicit user action
- **Role-based access:**
  - Admin-only routes require JWT and role check

## Integration Points

- **Email:** Gmail SMTP via `nodemailer` (`utils/sendMail.js`)
- **QR Code:** Generated with `qrcode` (backend), scanned with `html5-qrcode` (frontend)
- **MongoDB:** Models in `backend/models/`, compound index for user/event uniqueness

## Examples

- Register user: `userController.registerUser`, `Registration.js`
- Check-in user: `userController.checkInUser`, `CheckIn.js`
- Admin event management: `eventController.js`, `AdminDashboard.js`

## File References

- Backend: `controllers/`, `models/`, `routes/`, `middleware/`, `utils/sendMail.js`
- Frontend: `src/pages/`, especially `CheckIn.js`, `AdminDashboard.js`

---

For questions or unclear patterns, review `README.md` or ask for clarification.

## Examples

- **Register user:** See `userController.registerUser` and `Registration.js`.
- **Check-in user:** See `userController.checkInUser` and `CheckIn.js`.
- **Admin event management:** See `eventController.js`, `AdminDashboard.js`.

## File References

- Backend: `controllers/`, `models/`, `routes/`, `middleware/`, `utils/sendMail.js`
- Frontend: `src/pages/`, especially `CheckIn.js`, `AdminDashboard.js`

---

For questions or unclear patterns, review `README.md` or ask for clarification.
