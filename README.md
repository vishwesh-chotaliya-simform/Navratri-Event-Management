# Navratri Event Management

A full-stack event management application for Navratri, featuring user registration, event ticketing via QR code, admin dashboard, and secure check-in.

## Project Structure

```
navratri_event_management/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── utils/
│   ├── .env
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   └── package.json
├── .gitignore
├── LICENSE
├── README.md
└── .vscode/
```

## Features

- **User Registration:** Users can register for any event and receive a QR code ticket via email instantly.
- **Event Listing:** Public listing of all upcoming events.
- **Resend Ticket:** Users can resend their QR code ticket via email if needed.
- **Admin Dashboard:** Admins can view all users and events, preview QR codes, resend tickets, create/edit/delete events, and check-in users.
- **Secure Check-In:** Admins can check-in users by scanning their QR code.
- **Role-Based Access:** Admin-only features are protected and require login.

## Getting Started

### 1. Install Dependencies

```sh
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure Environment Variables

Create `backend/.env` and add:

```
MONGO_URI=mongodb://localhost:27017/navratri_event
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password_or_app_password
JWT_SECRET=your_jwt_secret
```

### 3. Start the Servers

```sh
cd backend && npm run dev
cd ../frontend && npm start
```

- Backend runs on `http://localhost:5000`
- Frontend runs on `http://localhost:3000`

## Usage

- **Register for Events:** Visit the homepage and register for any event.
- **Resend Ticket:** Use the "Resend Ticket" page to get your QR code again.
- **Admin Login:** Log in as admin to access dashboard and management features.
- **Check-In:** Admins can scan QR codes to check-in users.

## License

MIT

---

For any issues or contributions, please open an issue or pull request.
