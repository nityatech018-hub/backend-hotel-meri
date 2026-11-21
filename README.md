# Hotel Meri & Residency — Backend API (Node.js + Express + MySQL)

This is the standalone Node.js, Express, and MySQL backend for Hotel Meri & Residency.

## Folder Structure
```
backend/
├── config/
│   └── db.js                 # MySQL connection pool (mysql2/promise)
├── controllers/
│   ├── authController.js     # Guest & Staff authentication
│   ├── bookingController.js  # Reservations, Check-in, Check-out, Payments
│   ├── categoryController.js # Room categories & pricing
│   ├── roomController.js     # Room status management
│   └── settingController.js  # Hotel settings & tax rates
├── routes/
│   ├── authRoutes.js         # /api/auth/*
│   ├── bookingRoutes.js      # /api/bookings/*
│   ├── categoryRoutes.js     # /api/categories/*
│   ├── roomRoutes.js         # /api/rooms/*
│   └── settingRoutes.js      # /api/settings/*
├── sql/
│   └── schema.sql            # Complete MySQL DDL & initial seed data
├── .env                      # Database credentials and port
├── package.json              # Express, mysql2, cors, dotenv
└── server.js                 # Express server entry point
```

---

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Database
Update `.env` with your MySQL connection credentials:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=hotel_meri
```

### 3. Initialize MySQL Database
Open your MySQL terminal or GUI (MySQL Workbench / phpMyAdmin) and import `sql/schema.sql`:
```bash
mysql -u root -p < sql/schema.sql
```

### 4. Run the Server
```bash
# Development (with nodemon auto-reload)
npm run dev

# Production
npm start
```
The server will start at `http://localhost:5000`.
Health check: `http://localhost:5000/api/health`
