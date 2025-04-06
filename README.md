# 🚗 Petrol Bunk Management System

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

[![GitHub issues](https://img.shields.io/github/issues/yourusername/petrol-bunk-management-system)](https://github.com/yourusername/petrol-bunk-management-system/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/petrol-bunk-management-system)](https://github.com/yourusername/petrol-bunk-management-system/pulls)
[![GitHub license](https://img.shields.io/github/license/yourusername/petrol-bunk-management-system)](https://github.com/yourusername/petrol-bunk-management-system/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/yourusername/petrol-bunk-management-system)](https://github.com/yourusername/petrol-bunk-management-system/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/petrol-bunk-management-system)](https://github.com/yourusername/petrol-bunk-management-system/network)

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
  - Manager Interface
  - Staff Portal
- **Secure Authentication**
  - JWT-based authentication
  - Password hashing with bcrypt
  - Session management
- **User Profiles**
  - Personal information management
  - Activity history
  - Role-specific views

### Inventory Management
- **Real-time Stock Tracking**
  - Fuel level monitoring
  - Low stock alerts
  - Stock history
- **Purchase Management**
  - Supplier management
  - Purchase orders
  - Invoice generation
- **Stock Analytics**
  - Consumption patterns
  - Stock predictions
  - Cost analysis

### Sales Management
- **Transaction Processing**
  - Multiple payment methods
  - Receipt generation
  - Transaction history
- **Sales Analytics**
  - Daily/weekly/monthly reports
  - Revenue tracking
  - Customer insights
- **Pricing Management**
  - Dynamic pricing
  - Special offers
  - Bulk discounts

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
- **React Icons** - Icon library
- **Formik & Yup** - Form handling & validation

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cors** - Cross-origin resource sharing
- **Dotenv** - Environment variables
- **Morgan** - HTTP request logger
- **Helmet** - Security headers

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm (v6 or higher) or yarn (v1.22 or higher)
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/petrol-bunk-management-system.git
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

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

# Email Configuration (Optional)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=uploads/
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
  - Role-based access control
  - Session management
  - Password hashing with bcrypt

- **API Security**
  - Rate limiting
  - Request validation
  - CORS configuration
  - Helmet security headers

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

## 🧪 Testing

```bash
# Run frontend tests
cd frontend
npm test

# Run backend tests
cd backend
npm test
```

## 📦 Deployment

The application can be deployed using various platforms:

### Frontend Deployment
- Vercel
- Netlify
- GitHub Pages

### Backend Deployment
- Heroku
- DigitalOcean
- AWS

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
- Update the README if necessary

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Darshan Gowda G S** - *Initial work* - [GitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape this project
- Special thanks to the open-source community for the amazing tools and libraries
- Icons provided by [React Icons](https://react-icons.github.io/react-icons/)
- UI components inspired by modern design systems

## 📞 Support

For support, email support@example.com or join our Slack channel.

## 🔄 Updates

- **v1.0.0** - Initial release
- **v1.1.0** - Added reporting features
- **v1.2.0** - Enhanced security features
- **v1.3.0** - Added analytics dashboard

---

<div align="center">
Made with ❤️ by Darshan Gowda G S
</div> 