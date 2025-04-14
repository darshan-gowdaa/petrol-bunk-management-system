#  Petrol Bunk Management System ⛽

The Petrol Bunk Management System is a full-stack web application designed to streamline petrol bunk operations with modern technology.
It provides a comprehensive solution for managing inventory, sales, employees, expense and reports, ensuring efficient and transparent business processes.

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

[![GitHub stars](https://img.shields.io/github/stars/darshan-gowdaa/petrol-bunk-management-system)](https://github.com/darshan-gowdaa/petrol-bunk-management-system/stargazers)

</div>

## 📸 Demo
[https://drive.google.com/file/d/17Pq3vrNtKKkriepqy_uWykRUAPAh64ey/](https://drive.google.com/file/d/17Pq3vrNtKKkriepqy_uWykRUAPAh64ey/)

## 🌟 Features

### User Management
- **Role-based Access Control**
  - Admin Dashboard
  - Staff Portal
    
- **Secure Authentication**
  - JWT-based authentication
  - Password hashing with bcrypt
  - Session management


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
  - CSV exports
  - Filtered - Custom report generation

### Frontend  
<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white" />
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" />
  <img src="https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Lucide_React-000000?style=for-the-badge&logo=lucide&logoColor=white" />
</p>

### Backend  
<p align="center">
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
  <img src="https://img.shields.io/badge/Bcrypt-00599C?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Cors-FF9933?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Dotenv-008000?style=for-the-badge" />
</p>




## 🚀 Getting Started

### ✅ Prerequisites  
<p align="center">
  
![Node.js](https://img.shields.io/badge/Node.js-14%2B-43853D?style=for-the-badge&logo=node.js&logoColor=white)  
![MongoDB](https://img.shields.io/badge/MongoDB-4.4%2B-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)  
![npm](https://img.shields.io/badge/npm-6%2B-CB3837?style=for-the-badge&logo=npm&logoColor=white)  
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)  
</p>

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

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contributing Guidelines
- Follow the existing code style
- Write meaningful commit messages


## 👥 Authors

- **Darshan Gowda G S** - [GitHub](https://github.com/darshan-gowdaa)


## 📞 Support

For support, email darshangowdaa223@gmail.com


---

<div align="center">
Made with ❤️ by DG
</div> 
