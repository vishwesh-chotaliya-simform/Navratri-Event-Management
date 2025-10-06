---
applyTo: "**"
---

# GitHub Copilot Instructions for Navratri Event Management

You are working on a full-stack event management application with Node.js/Express backend and React/Material-UI frontend, featuring Razorpay payments and QR-based ticketing.

## Project Context

This is a comprehensive event booking system with:

- User registration and authentication (JWT tokens)
- Admin dashboard for event management
- Razorpay payment integration for paid events
- Server-side booking creation and QR code generation
- Email delivery of tickets via nodemailer
- QR scanner for event check-ins

## Core Coding Guidelines

### Backend Patterns

- **Payment Flow**: Always store amounts in paise (multiply INR by 100), verify Razorpay signatures server-side
- **Authentication**: Use `req.admin` for decoded JWT payload (both users and admins), include role-based middleware
- **Database**: Booking model links User and Event with payment metadata (orderId, paymentId, amountPaid)
- **QR Generation**: Server-side QR contains JSON with bookingId, email, event details for scanning validation

### Frontend Patterns

- **Material-UI**: Use consistent styling with primary (#5c6bc0) and secondary (#ff9800) colors, 16px border radius
- **Payment Integration**: Create order server-side → open Razorpay checkout → verify payment server-side
- **Authentication**: Store `userToken` for users, `token` for admins in localStorage, use AuthContext
- **Amount Display**: Divide `amountPaid` by 100 to show INR properly in UI components

### Security Requirements

- Never expose `RAZORPAY_KEY_SECRET` to frontend (only use `REACT_APP_RAZORPAY_KEY_ID`)
- Implement proper error handling with user-friendly messages
- Validate all inputs server-side and use Authorization headers
