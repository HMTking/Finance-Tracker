# Finance Tracker

A comprehensive personal finance tracking application built with the MySQL, Express.js, React, Node.js. This modern application provides complete financial management with authentication, transaction tracking, analytics, and intuitive data visualization.

## 🌐 Live Demo

🔗 **[View Live Application](https://personal-finance-tracker-by-dattpatel.onrender.com/)**

> Note: The live demo may take a moment to load as it's hosted on a free tier service.

## 🚀 Features

### Authentication & User Management

- Secure user registration and login with JWT authentication
- Protected routes and middleware
- Comprehensive profile management
- Password encryption with bcrypt

### Transaction Management

- Full CRUD operations for financial transactions
- Income and expense categorization
- Advanced filtering and search capabilities
- Rich transaction details (notes, tags, location, receipts)
- Real-time balance calculations and updates

### Category System

- Custom category creation with colors and icons
- Pre-built default categories for immediate use
- Category-based analytics and filtering
- Income/expense type organization

### Analytics & Insights

- Comprehensive financial dashboard
- Visual charts for income vs expense analysis
- Category breakdown with spending patterns
- Time-based analytics (weekly, monthly, yearly)
- Financial trends and insights

### Modern Interface

- Fully responsive design optimized for all devices
- Clean, intuitive user interface
- Real-time updates and feedback
- Toast notifications for user actions
- Advanced form validation and error handling

## 🛠 Technology Stack

### Backend

- **Node.js**: JavaScript runtime environment
- **Express.js**: Fast, unopinionated web framework
- **MySQL**: Reliable relational database management
- **Sequelize**: Promise-based ORM for Node.js
- **JWT**: Secure JSON Web Token authentication
- **bcryptjs**: Password hashing and security
- **Helmet**: Security headers and protection
- **Morgan**: HTTP request logging middleware
- **CORS**: Cross-origin resource sharing configuration

### Frontend

- **React 18**: Modern frontend library with hooks
- **React Router**: Declarative routing for React
- **React Query**: Powerful data synchronization
- **React Hook Form**: Performant forms with validation
- **Axios**: Promise-based HTTP client
- **React Hot Toast**: Beautiful notification system
- **Chart.js**: Flexible charting library
- **Date-fns**: Modern date utility library

## 📁 Project Structure

```
finance-tracker/
├── backend/
│   ├── config/               # Database and app configuration
│   │   ├── database.js
│   │   └── config.js
│   ├── controllers/          # Business logic handlers
│   │   ├── authController.js
│   │   ├── transactionController.js
│   │   └── categoryController.js
│   ├── middleware/           # Custom middleware functions
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/               # Sequelize database models
│   │   ├── index.js
│   │   ├── User.js
│   │   ├── Transaction.js
│   │   └── Category.js
│   ├── routes/               # API endpoint definitions
│   │   ├── auth.js
│   │   ├── transactions.js
│   │   └── categories.js
│   ├── migrations/           # Database schema migrations
│   ├── seeders/              # Database seed data
│   ├── server.js             # Application entry point
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   │   ├── Navbar.js
│   │   │   ├── LoadingSpinner.js
│   │   │   └── TransactionForm.js
│   │   ├── context/          # React context providers
│   │   │   └── AuthContext.js
│   │   ├── hooks/            # Custom React hooks
│   │   │   ├── useTransactions.js
│   │   │   └── useCategories.js
│   │   ├── pages/            # Main page components
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Transactions.js
│   │   │   ├── Categories.js
│   │   │   ├── Analytics.js
│   │   │   └── Profile.js
│   │   ├── utils/            # Utility functions
│   │   │   ├── api.js
│   │   │   └── helpers.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
│
├── README.md
└── TECHNICAL_DOC.md
```

## 🔧 Quick Start

For detailed setup instructions, see our **[Getting Started Guide](./GETTING_STARTED.md)**.

### Prerequisites

- Node.js (v14 or higher)
- MySQL Server (v8.0 or higher)
- npm or yarn package manager

### Quick Setup

```bash
# Clone and setup backend
cd backend
npm install
cp .env.example .env
# Edit .env with your MySQL credentials
npm run dev

# Setup frontend (in new terminal)
cd frontend
npm install
npm start
```

Visit `http://localhost:3000` to access the application.

## 🌟 Key Features Explained

### Database Architecture

- **MySQL**: Robust relational database with ACID compliance
- **Sequelize ORM**: Type-safe database operations with migrations
- **Foreign Key Constraints**: Data integrity and referential consistency
- **Indexing**: Optimized query performance for large datasets

### Authentication System

1. User registration with encrypted passwords
2. JWT token generation and validation
3. Middleware-protected routes
4. Session management and token refresh

### Real-time Balance Management

- Automatic balance calculations on transaction changes
- Precise decimal handling for financial accuracy
- Transaction history with audit trail
- Category-wise spending analysis

### Data Visualization

- Interactive charts powered by Chart.js
- Category-wise expense breakdown
- Income vs expense trends
- Monthly and yearly financial summaries

## 📊 API Endpoints

### Authentication Routes

- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Authenticate user login
- `GET /api/auth/me` - Retrieve user profile
- `PUT /api/auth/profile` - Update user information

### Transaction Management

- `GET /api/transactions` - List transactions with filtering
- `POST /api/transactions` - Create new transaction
- `GET /api/transactions/:id` - Get specific transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Remove transaction
- `GET /api/transactions/stats` - Financial statistics

### Category Management

- `GET /api/categories` - List all categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Remove category
- `POST /api/categories/defaults` - Initialize default categories

## �️ Database Schema

### Users Table

- Unique user identification and authentication
- Profile information and preferences
- Balance tracking and currency settings

### Categories Table

- Customizable income/expense categories
- Visual styling with colors and icons
- User-specific and default system categories

### Transactions Table

- Complete financial transaction records
- Rich metadata (notes, tags, location)
- Foreign key relationships for data integrity

## 🔒 Security Implementation

- **Password Security**: bcrypt hashing with salt rounds
- **JWT Authentication**: Stateless token-based auth
- **CORS Protection**: Controlled cross-origin requests
- **Input Validation**: Comprehensive data sanitization
- **SQL Injection Prevention**: Sequelize ORM protection
- **Security Headers**: Helmet.js middleware protection

## 📱 Responsive Design

- **Mobile-First**: Optimized for smartphone usage
- **Progressive Enhancement**: Works across all device types
- **Touch Interface**: Finger-friendly interaction design
- **Performance**: Optimized loading and rendering

## 🚀 Development Commands

```bash
# Backend Development
npm run dev              # Start development server with nodemon
npm run start           # Start production server
npm run db:setup        # Initialize database and run migrations
npm run db:migrate      # Run database migrations
npm run db:seed         # Populate default data
npm run db:reset        # Reset database (drop, create, migrate, seed)

# Frontend Development
npm start               # Start React development server
npm run build          # Create production build
npm test               # Run test suite
```

## 🤝 Contributing

This project demonstrates modern full-stack development practices including:

- RESTful API design principles
- Secure authentication patterns
- Responsive web design
- Database normalization
- Error handling strategies
- Performance optimization

---

> Built with modern web technologies to showcase professional-grade application development using the MERN stack with MySQL.
