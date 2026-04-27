# PH Tour Management Backend

A comprehensive full-stack tour management system built with Node.js, Express, MongoDB, and TypeScript. Features include user authentication, tour bookings, payment processing with SSL Commerz, guide management, admin dashboard integration, and email notifications.

---

## 📋 Project Overview

PH Tour Management is a robust backend solution designed for managing tour operations, user bookings, payments, and administrative tasks. The system provides RESTful APIs for seamless integration with frontend applications, featuring advanced security, real-time data management, and comprehensive error handling.

---

## 🏗️ Project Structure

```
src/
├── app.ts                    # Express app configuration
├── server.ts                 # Server entry point
├── app/
│   ├── config/              # Configuration files
│   │   ├── cloudinary.config.ts    # Image upload config
│   │   ├── env.ts                  # Environment variables
│   │   ├── multer.config.ts        # File upload config
│   │   ├── passport.ts             # Authentication strategies
│   │   └── redis.config.ts         # Caching config
│   ├── errorHandlers/       # Custom error handling
│   ├── helpers/             # Utility functions for errors
│   ├── interfaces/          # TypeScript type definitions
│   ├── middlewares/         # Express middlewares
│   ├── modules/             # Feature modules
│   │   ├── auth/            # Authentication
│   │   ├── user/            # User management
│   │   ├── tour/            # Tour management
│   │   ├── booking/         # Booking system
│   │   ├── payment/         # Payment processing
│   │   ├── guide/           # Guide management
│   │   ├── division/        # Division/Region management
│   │   ├── otp/             # OTP verification
│   │   ├── sslCommerz/      # Payment gateway
│   │   └── stats/           # Analytics & statistics
│   ├── routes/              # API routes
│   └── utils/               # Utility functions
```

---

## 🛠️ Tech Stack

### Backend
- **Node.js & Express 5** – Fast, scalable server framework
- **TypeScript** – Type-safe development
- **MongoDB & Mongoose** – NoSQL database with ODM
- **JWT Authentication** – Secure token-based auth
- **Passport.js** – Multi-strategy authentication (Local, Google OAuth)
- **BcryptJS** – Password hashing & security
- **Zod** – Schema validation
- **Redis** – Caching & session management
- **Cloudinary** – Image storage & optimization
- **Nodemailer** – Email notifications
- **PDFKit** – PDF generation (invoices)
- **SSL Commerz** – Payment gateway integration
- **Helmet** – Security headers
- **CORS** – Cross-origin resource sharing
- **Morgan** – HTTP request logging
- **ESLint & TypeScript ESLint** – Code quality

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Google OAuth integration via Passport.js
- Secure password hashing with BcryptJS
- Role-based access control (Admin, User, Guide)
- OTP verification system

### 🧑‍💼 User Management
- User registration & profile management
- User role assignment
- Token management
- Session handling with Redis

### 🏖️ Tour Management
- Create, read, update, delete tours
- Tour details with pricing, duration, itinerary
- Tour availability & capacity management
- Search & filtering capabilities
- Dynamic slug generation

### 📅 Booking System
- Booking creation & management
- Booking status tracking
- Booking cancellation
- Booking history

### 💳 Payment Processing
- SSL Commerz integration
- Payment gateway verification
- Transaction tracking
- Invoice generation with PDFKit
- Unique transaction IDs

### 👨‍🏫 Guide Management
- Guide profiles & credentials
- Guide assignment to tours
- Guide availability management
- Performance tracking

### 📊 Admin Dashboard Support
- Statistics & analytics endpoints
- User activity tracking
- Revenue reports
- Booking analytics
- Payment insights

### 📧 Notifications
- Email notifications for bookings
- Payment confirmation emails
- User verification emails
- Template-based email system

### 📁 File Management
- Image uploads via Cloudinary
- Multi-file handling with Multer
- Secure file storage

### 🔍 Additional Features
- Advanced query building
- Comprehensive error handling
- Request validation middleware
- Global error handlers
- 404 route management

---

## 📦 Dependencies

### Core Dependencies
```json
{
  "express": "^5.2.1",
  "mongoose": "^9.0.1",
  "jsonwebtoken": "^9.0.3",
  "bcryptjs": "^3.0.3",
  "zod": "^4.3.5",
  "passport": "^0.7.0",
  "passport-local": "^1.0.0",
  "passport-google-oauth20": "^2.0.0",
  "redis": "^5.12.1",
  "cloudinary": "^2.9.0",
  "multer": "^2.1.0",
  "nodemailer": "^8.0.5",
  "pdfkit": "^0.18.0",
  "axios": "^1.13.5",
  "dotenv": "^17.2.3"
}
```

### Development Dependencies
```json
{
  "typescript": "^5.9.3",
  "ts-node-dev": "^2.0.0",
  "eslint": "^9.39.2",
  "typescript-eslint": "^8.50.1"
}
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18 or higher
- **npm** or **yarn**
- **MongoDB** (local or Atlas)
- **Redis** server (for caching)
- **Cloudinary account** (for image uploads)
- **SSL Commerz account** (for payments)
- **Google OAuth credentials** (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/codermdshakil/ph-tour-management-backend.git
   cd ph-tour-management-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Server
   NODE_ENV=development
   PORT=5000
   
   # Database
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ph-tour-management
   
   # JWT
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=7d
   
   # Redis
   REDIS_URL=redis://localhost:6379
   
   # Cloudinary
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Email (Nodemailer)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   
   # SSL Commerz
   SSLCOMMERZ_STORE_ID=your_store_id
   SSLCOMMERZ_STORE_PASSWORD=your_store_password
   SSLCOMMERZ_API_URL=https://sandbox.sslcommerz.com/gwprocess/v4/api.php
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
   
   # Admin Email
   ADMIN_EMAIL=admin@phtourmanagement.com
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   Server runs at: **http://localhost:5000**

---

## 🔨 Available Scripts

```bash
# Development server with auto-reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Run tests (currently not configured)
npm test
```

---

## 📚 API Documentation

### Authentication Routes
- `POST /api/auth/register` – User registration
- `POST /api/auth/login` – User login
- `POST /api/auth/logout` – User logout
- `GET /api/auth/google` – Google OAuth login
- `GET /api/auth/google/callback` – Google OAuth callback

### User Routes
- `GET /api/users` – Get all users (Admin)
- `GET /api/users/:id` – Get user details
- `PUT /api/users/:id` – Update user profile
- `DELETE /api/users/:id` – Delete user (Admin)

### Tour Routes
- `GET /api/tours` – Get all tours
- `GET /api/tours/:id` – Get tour details
- `POST /api/tours` – Create tour (Admin)
- `PUT /api/tours/:id` – Update tour (Admin)
- `DELETE /api/tours/:id` – Delete tour (Admin)

### Booking Routes
- `GET /api/bookings` – Get user's bookings
- `POST /api/bookings` – Create booking
- `PUT /api/bookings/:id` – Update booking
- `DELETE /api/bookings/:id` – Cancel booking

### Payment Routes
- `POST /api/payments/initiate` – Initiate payment
- `POST /api/payments/verify` – Verify payment
- `GET /api/payments/:id` – Get payment details

### Guide Routes
- `GET /api/guides` – Get all guides
- `GET /api/guides/:id` – Get guide details
- `POST /api/guides` – Create guide (Admin)
- `PUT /api/guides/:id` – Update guide (Admin)

### Stats Routes
- `GET /api/stats/dashboard` – Dashboard statistics
- `GET /api/stats/bookings` – Booking statistics
- `GET /api/stats/revenue` – Revenue reports

---

## 🔒 Security Features

- ✅ JWT token-based authentication
- ✅ Password hashing with BcryptJS
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Environment variable protection
- ✅ Input validation with Zod
- ✅ Role-based access control
- ✅ Rate limiting ready
- ✅ Secure password reset via OTP

---

## 🗂️ Folder Structure Explanation

| Folder | Purpose |
|--------|---------|
| `config/` | Configuration files for external services |
| `errorHandlers/` | Custom error classes and handlers |
| `helpers/` | Utility functions for error transformation |
| `interfaces/` | TypeScript type definitions & interfaces |
| `middlewares/` | Express middleware functions |
| `modules/` | Feature-based module structure |
| `routes/` | API route definitions |
| `utils/` | Helper functions (JWT, email, PDF, etc.) |

---

## 🧪 Error Handling

The system implements comprehensive error handling:
- **Zod validation errors** – Transformed into readable responses
- **Duplicate key errors** – Handled at database level
- **Cast errors** – MongoDB validation errors
- **Global error middleware** – Centralized error handling
- **Custom AppError** – Standardized error format

---

## 📮 Email Notifications

Automated emails for:
- User registration confirmation
- Booking confirmation
- Payment receipt
- OTP verification
- Password reset

---

## 💾 Caching Strategy

- Redis caching for frequently accessed data
- Session management
- Token blacklisting

---

## 🚢 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Configuration
Ensure all environment variables are properly set in production environment.

### Database
- Use MongoDB Atlas for managed database
- Set appropriate connection strings

### Server Hosting
- Deploy on Vercel, Heroku, Railway, or DigitalOcean
- Set environment variables in hosting platform

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License – see LICENSE file for details.

---

## 📧 Support & Contact

- **Repository**: [ph-tour-management-backend](https://github.com/codermdshakil/ph-tour-management-backend)
- **Issues**: [GitHub Issues](https://github.com/codermdshakil/ph-tour-management-backend/issues)
- **Author**: [codermdshakil](https://github.com/codermdshakil)

---

## 🎯 Roadmap

- [ ] Unit & integration testing
- [ ] API documentation with Swagger
- [ ] WebSocket support for real-time updates
- [ ] Advanced analytics dashboard
- [ ] Multi-currency support
- [ ] SMS notifications
- [ ] Mobile app API versioning
- [ ] Rate limiting & throttling

---

## 📝 Changelog

### Version 1.0.0
- Initial release
- Core features: Tours, Bookings, Payments, User Management
- Authentication with JWT & Google OAuth
- Email notifications
- Admin dashboard support

---

**Last Updated**: 2026  
**Status**: Active Development ✅
