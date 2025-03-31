# 🚗 Petrol Bunk Management System

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

[![GitHub pull requests](https://img.shields.io/github/issues-pr/darshan-gowdaa/petrol-bunk-management-system)](https://github.com/darshan-gowdaa/petrol-bunk-management-system/pulls)
[![GitHub stars](https://img.shields.io/github/stars/darshan-gowdaa/petrol-bunk-management-system)](https://github.com/darshan-gowdaa/petrol-bunk-management-system/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/darshan-gowdaa/petrol-bunk-management-system)](https://github.com/darshan-gowdaa/petrol-bunk-management-system/network)

</div>

A modern, full-stack web application for managing petrol bunk operations efficiently. This system helps streamline the day-to-day operations of a petrol bunk, from inventory management to sales tracking.

## 📸 Demo

<div align="center">
  <img src="demo.gif" alt="Petrol Bunk Management System Demo" width="800px">
</div>

## 🌟 Features

### User Management
- **Role-based Access Control**
  - Admin Dashboard
  - Staff Portal
- **Secure Authentication**
  - JWT-based authentication
  - Password hashing with bcrypt
  - Session management


### Inventory Management

### Sales Management


### Reporting & Analytics
- **Comprehensive Reports**
  - Sales reports
  - Inventory reports
  - Financial statements
- **Data Visualization**
  - Interactive charts
  - Performance metrics
  - Trend analysis
- **Export Capabilities**
  - PDF reports
  - Excel exports
  - Custom report generation

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern UI development
- **Vite** - Fast build tooling
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Navigation management
- **Redux Toolkit** - State management
- **Axios** - HTTP client
- **Chart.js** - Data visualization
- **Lucide-React** - Icon library


### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cors** - Cross-origin resource sharing
- **Dotenv** - Environment variables


## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm (v6 or higher) or yarn (v1.22 or higher)
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/darshan-gowdaa/petrol-bunk-management-system.git
cd petrol-bunk-management-system
```

2. Install dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory with the following variables:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string

```

4. Start the application
```bash
# From the root directory
npm start
```

This will start both the frontend and backend servers concurrently.

## 📁 Project Structure

```
petrol-bunk-management-system/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   ├── store/          # Redux store configuration
│   │   ├── utils/          # Utility functions
│   │   ├── assets/         # Static assets
│   │   └── styles/         # Global styles
│   ├── public/             # Static files
│   └── package.json        # Frontend dependencies
├── backend/                # Node.js backend application
│   ├── controllers/        # Route controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Utility functions
│   ├── config/            # Configuration files
│   └── package.json       # Backend dependencies
└── package.json           # Root package.json
```

## 🔒 Security Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Session management
  - Password hashing with bcrypt

- **API Security**
  - Rate limiting
  - Request validation
  - CORS configuration

- **Data Security**
  - Input sanitization
  - XSS protection
  - SQL injection prevention
  - Data encryption

- **Error Handling**
  - Global error handling
  - Custom error classes
  - Error logging
  - Client-friendly error messages
  - Appropriate Toasts

## 🧪 Testing

```bash
# Run frontend tests
cd frontend
npm test[

# Run backend tests
cd backend
npm test
```

## 📦 Deployment

The application can be deployed using various platforms:

### Frontend Deployment
- GitHub Pages [https://darshan-gowdaa.github.io/dashboard] (Backend wont work)

### Backend Deployment

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contributing Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add appropriate documentation
- Include tests for new features


## 👥 Authors

- **Darshan Gowda G S** - [GitHub](https://github.com/darshan-gowdaa)


## 📞 Support

For support, email darshangowdaa223@gmail.com


---

<div align="center">
Made with ❤️ by DG
</div> 
