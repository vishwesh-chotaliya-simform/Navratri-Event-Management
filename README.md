# Navratri Event Management

A comprehensive full-stack event management application built for Navratri celebrations, featuring user registration, secure payments via Razorpay, QR-based ticketing, and admin dashboard for event management.

## 🚀 Features

### User Features

- **User Registration & Authentication** - Secure signup/login system with JWT tokens
- **Event Browsing** - View all upcoming events with detailed information
- **Ticket Booking** - Book tickets for events with integrated payment gateway
- **QR Code Tickets** - Receive QR code tickets via email after successful booking
- **My Bookings** - View all personal bookings and download tickets
- **Ticket Resend** - Resend QR code tickets if needed

### Payment Integration

- **Razorpay Integration** - Secure payment processing with Razorpay
- **Server-side Verification** - Payment verification and booking creation on backend
- **Webhook Support** - Automated booking reconciliation via Razorpay webhooks
- **Free & Paid Events** - Support for both free and paid event registrations

### Admin Features

- **Admin Dashboard** - Complete overview of all bookings and events
- **Event Management** - Create, edit, and delete events with pricing
- **Check-in System** - QR code scanner for event check-ins
- **Booking Management** - View all bookings, resend tickets, track payments
- **Role-based Access** - Secure admin-only features with authentication

### Technical Features

- **QR Code Generation** - Server-side QR code generation with booking details
- **Email Notifications** - Automated email delivery with nodemailer
- **Responsive Design** - Modern Material-UI interface with dark/light themes
- **Real-time Updates** - Live booking status and check-in management

## 🏗️ Project Structure

```
navratri_event_management/
├── backend/                    # Node.js/Express API Server
│   ├── controllers/           # Route handlers & business logic
│   │   ├── userController.js  # User, booking, payment operations
│   │   ├── eventController.js # Event CRUD operations
│   │   ├── authController.js  # User authentication logic
│   │   └── adminController.js # Admin authentication
│   ├── models/               # MongoDB/Mongoose schemas
│   │   ├── User.js          # User model with authentication
│   │   ├── Event.js         # Event model with pricing support
│   │   ├── Booking.js       # Booking model with payment metadata
│   │   └── Admin.js         # Admin model with role-based access
│   ├── routes/              # API route definitions
│   │   ├── userRoutes.js    # User and booking routes
│   │   ├── eventRoutes.js   # Event management routes
│   │   ├── authRoutes.js    # Authentication routes
│   │   └── adminRoutes.js   # Admin authentication routes
│   ├── middleware/          # Authentication & authorization
│   │   ├── auth.js         # JWT verification middleware
│   │   └── role.js         # Role-based access control
│   ├── utils/              # Helper utilities
│   │   ├── razorpay.js    # Razorpay client configuration
│   │   └── sendMail.js    # Email service for QR codes
│   ├── scripts/
│   │   └── createAdmin.js  # Admin user creation script
│   ├── .env               # Environment variables
│   ├── .example.env       # Environment template
│   └── index.js           # Server entry point with webhook
├── frontend/              # React SPA Client
│   ├── src/
│   │   ├── pages/        # React pages/components
│   │   │   ├── EventList.js      # Browse all events
│   │   │   ├── EventDetails.js   # Event details & booking with payment
│   │   │   ├── MyBookings.js     # User's booking history
│   │   │   ├── AdminDashboard.js # Admin management panel
│   │   │   ├── CheckIn.js        # QR scanner for check-ins
│   │   │   ├── Login.js          # User login
│   │   │   ├── Signup.js         # User registration
│   │   │   ├── AdminLogin.js     # Admin login
│   │   │   ├── CreateEvent.js    # Admin event creation
│   │   │   └── EditEvent.js      # Admin event editing
│   │   ├── components/   # Reusable React components
│   │   │   ├── NavBar.js        # Navigation with theme toggle
│   │   │   ├── Footer.js        # Application footer
│   │   │   └── ProtectedRoute.js # Route protection
│   │   ├── context/     # React Context
│   │   │   └── AuthContext.js   # Authentication state management
│   │   └── App.js       # Main app with routing & theming
│   ├── public/
│   │   └── index.html   # Razorpay checkout script included
│   ├── .env             # Frontend environment variables
│   ├── .example.env     # Frontend environment template
│   └── package.json     # Frontend dependencies
├── .github/
│   └── copilot-instructions.md # Development guidelines
├── .gitignore           # Git ignore patterns
├── LICENSE              # MIT License
└── README.md            # Project documentation
```

## 🛠️ Technology Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **Razorpay** - Payment gateway integration with webhook support
- **JWT** - JSON Web Tokens for authentication
- **Nodemailer** - Email service for QR code delivery
- **QRCode** - QR code generation library
- **bcrypt** - Password hashing and authentication

### Frontend

- **React** - Frontend library with hooks and context
- **Material-UI (MUI)** - Modern React component library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Framer Motion** - Animation library for smooth transitions
- **html5-qrcode** - QR code scanning with camera access
- **Context API** - State management for authentication

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or cloud service)
- Razorpay account (for payment processing)
- Gmail account (for email service)

### 1. Clone Repository

```bash
git clone <repository-url>
cd navratri_event_management
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env` file:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/navratri_event
JWT_SECRET=your_jwt_secret_key

# Email Configuration (Gmail SMTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

Create admin user:

```bash
node scripts/createAdmin.js
```

Start backend server:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env` file:

```env
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Start frontend development server:

```bash
npm start
```

### 4. Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Login**: username `admin`, password `admin123`

## 💳 Payment Flow

### 1. Order Creation

- User selects event and enters ticket quantity in EventDetails page
- Frontend calls `POST /api/users/create-order` with event details
- Backend creates Razorpay order with event metadata in notes

### 2. Payment Processing

- Razorpay checkout modal opens with order details
- User completes payment using test/live cards
- Frontend receives payment response from Razorpay

### 3. Payment Verification

- Frontend calls `POST /api/users/verify-payment` with payment details
- Backend verifies payment signature with Razorpay
- Creates booking record with payment metadata
- Generates QR code and sends ticket via email automatically

### 4. Webhook Reconciliation

- Razorpay sends webhook to `POST /api/users/webhook`
- Backend processes payment events for backup booking creation
- Handles edge cases and ensures data consistency with idempotency checks

## 🎯 API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/admin/login` - Admin login

### Events

- `GET /api/events` - List all events (public)
- `POST /api/events` - Create event (admin only)
- `PUT /api/events/:id` - Update event (admin only)
- `DELETE /api/events/:id` - Delete event (admin only)

### Bookings & Payments

- `POST /api/users/register` - Direct booking for free events
- `POST /api/users/create-order` - Create Razorpay order for paid events
- `POST /api/users/verify-payment` - Verify payment & create booking
- `POST /api/users/webhook` - Razorpay webhook endpoint (raw body)
- `GET /api/users/my-bookings` - User's bookings (authenticated)
- `GET /api/users/bookings` - All bookings (admin only)

### Utilities

- `POST /api/users/send-qrcode` - Resend QR code ticket (authenticated)
- `POST /api/users/checkin` - Check-in user via QR scan (admin only)
- `GET /api/users/:id/qrcode` - Generate QR code for user

## 🧪 Testing

### Payment Testing

Use Razorpay test credentials:

- **Test Card**: 4111 1111 1111 1111
- **Expiry**: Any future date (e.g., 12/25)
- **CVV**: Any 3 digits (e.g., 123)
- **Name**: Any name

### QR Code Testing

- QR codes contain booking information in JSON format
- Use admin check-in page to scan and verify QR codes
- Test email delivery with real Gmail credentials
- Verify booking creation in database and admin dashboard

### Webhook Testing

- Use ngrok to expose local backend: `ngrok http 5000`
- Configure webhook URL in Razorpay dashboard: `https://your-ngrok-url.ngrok.io/api/users/webhook`
- Test payment events and verify webhook delivery in Razorpay dashboard

## 🔧 Configuration

### Razorpay Setup

1. Create account at https://razorpay.com
2. Get API keys from Settings → API Keys
3. Configure webhook URL: `https://yourdomain.com/api/users/webhook`
4. Set webhook secret in dashboard and environment variables
5. Enable required webhook events: `payment.captured`, `payment.authorized`

### Email Setup

1. Enable 2-factor authentication on Gmail account
2. Generate app-specific password in Google Account settings
3. Use app password in `EMAIL_PASS` environment variable
4. Test email delivery with QR code attachments

### Database Setup

- MongoDB connection string in `MONGO_URI`
- Supports both local MongoDB and cloud services (MongoDB Atlas)
- Compound indexes on User model for email+event uniqueness
- Booking model stores payment metadata (orderId, paymentId, amountPaid)

## 📱 Responsive Design

- **Mobile-First**: Optimized for mobile devices with touch-friendly interface
- **Material Design**: Consistent UI/UX across all screens with elevation and shadows
- **Dark/Light Mode**: Toggle between themes with persistent preference
- **Responsive Tables**: Admin dashboard tables adapt to screen sizes
- **Camera Integration**: QR scanner works on mobile devices with camera access

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication for users and admins
- **Password Hashing**: bcrypt for secure password storage with salt rounds
- **Payment Verification**: Server-side Razorpay signature verification
- **Role-Based Access**: Admin vs user permissions with middleware enforcement
- **Input Validation**: Server-side validation for all API endpoints
- **CORS Protection**: Configured for secure cross-origin requests
- **Webhook Security**: Signature verification for Razorpay webhook payloads

## 💰 Payment & Amount Handling

- **Currency**: All amounts stored in paise (smallest currency unit)
- **Display**: Frontend displays amounts in INR by dividing by 100
- **Precision**: Server-side calculations prevent floating-point errors
- **Idempotency**: Prevents duplicate bookings with order ID checks
- **Reconciliation**: Webhook provides backup booking creation

## 🚀 Production Deployment

### Environment Variables

- Remove test keys and use production Razorpay credentials
- Use strong JWT secrets and rotate regularly
- Configure production MongoDB cluster with proper security
- Set up production email service (Gmail or transactional service)

### Recommended Deployment

- **Backend**: Railway, Heroku, or DigitalOcean
- **Frontend**: Vercel, Netlify, or static hosting with CDN
- **Database**: MongoDB Atlas with proper security settings
- **Domain**: Custom domain with SSL certificate
- **Monitoring**: Set up logging and error tracking

### Security Checklist

- [ ] Rotate all development keys before production
- [ ] Enable MongoDB authentication and network restrictions
- [ ] Configure CORS for production domains only
- [ ] Set up rate limiting and DDoS protection
- [ ] Enable HTTPS for all endpoints
- [ ] Configure webhook URL with production domain

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Development Guidelines

- Follow the patterns in `.github/copilot-instructions.md`
- Use Material-UI components for consistent design
- Add proper error handling and loading states
- Test payment flows with Razorpay test mode
- Ensure responsive design on mobile devices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💬 Support

For support and questions:

- Create an issue in the repository
- Check existing documentation and API endpoints
- Review code examples in controllers and components
- Test with Razorpay test credentials before production

---

**Built with ❤️ for Navratri celebrations**

_Enjoy seamless event management with secure payments and digital ticketing!_
