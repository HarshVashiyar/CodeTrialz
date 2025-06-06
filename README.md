# Code Trialz 👨🏻‍⚖️ 

CodeTrialz is a full-stack **online judge platform** that enables users to register, solve coding challenges in multiple languages (C++, Python, JavaScript, Java), submit code for evaluation, and view detailed feedback. It also features admin verification, AI-powered suggestions for accepted solutions, and a microservices-based deployment architecture.

## 🌐 Live Demo

[https://code-trialz.harshvashiyar.in](https://code-trialz.harshvashiyar.in)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Folder Structure](#folder-structure)
<!-- - [Contributing](#contributing)
- [License](#license) -->

## 📦 Features

### 👤 Authentication & Authorization
- Secure user registration and login via **JWT** and **bcrypt**
- Roles: `user`, `admin`
- Email verification and protected routes

### 📘 Problem Management
- Upload coding problems with multiple test cases
- Problems and test cases are first **verified by admins**

### 🧑‍💻 Code Execution & Submission
- Users can run and submit code in:
  - ✅ C++
  - ✅ JavaScript
  - ✅ Java
  - ✅ Python
- Code is run in a **sandboxed Docker container**
- Submissions are evaluated against test cases

### 📚 Submissions & Leaderboard
- View personal submission history
- View accepted solutions by others
- Leaderboard and user progress

### 🤖 AI Suggestions
- On successful submissions, get **AI-generated suggestions**
  - Code improvements
  - Time and space optimizations
  - Best practices 

## 🛠️ Tech Stack

### 🧑🏻‍💻 Frontend
- [React.js](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Axios](https://www.npmjs.com/package/axios)
- [React Router](https://reactrouter.com/)
- [Sonner](https://sonner.emilkowal.ski/)

### 🔁 Backend (General APIs)

- [Node.js](https://nodejs.org/en)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) (via [Mongoose](https://www.npmjs.com/package/mongoose))
- [JWT](https://jwt.io/) Auth + [Bcrypt](https://www.npmjs.com/package/bcrypt) hashing for password security
- Email support via [Nodemailer](https://www.npmjs.com/package/nodemailer)
- [Docker](https://www.docker.com/) container on [AWS](https://aws.amazon.com/) [EC2](https://aws.amazon.com/ec2/)

### 🚚 Code Execution Microservice

- [Node.js](https://nodejs.org/en)
- [Express](https://expressjs.com/)
- 
- Separate [Docker](https://www.docker.com/) container on a different [AWS](https://aws.amazon.com/) [EC2](https://aws.amazon.com/ec2/) instance

### 🐳 Containerization & Deployment
- The project follows a microservices architecture, split into two backend services:
  - `General API Service`: Handles authentication, problem CRUD, submission history, and AI integration.
  - `Code Execution Service`: Securely executes submitted code in isolated environments for C++, Python, JavaScript, and Java.
- 🧊 Backend Deployment:
    - Both microservices are containerized using Docker.
    - Each service is deployed on a separate AWS EC2 instance for isolation and scalability.
    - Docker containers are configured to restart automatically on failure for reliability.
- 🌐 Frontend Deployment:
    - Frontend is built with React + Vite and deployed on Vercel for seamless CI/CD and global edge delivery.
- 🌍 Custom Domain & SSL:
    - A custom domain was purchased via Hostinger.
    - The domain was mapped to both the frontend (Vercel) and backend (AWS EC2 instances) using DNS A and CNAME records.
    - HTTPS/SSL was enabled for the backend APIs using Certbot and Let’s Encrypt:
    - Backend Express servers were configured to serve via HTTPS using the generated SSL certificates.

## 📸 Screenshots

| Feature | Screenshot |
|--------|------------|
| Home Page | ![home](screenshots/home_page.png) |
| Add Problem | ![add problem](screenshots/add_problem_page.png) |
| Add Test Cases | ![testcase](screenshots/add_test_cases_page.png) |
| Admin Panel | ![admin](screenshots/admin_page.png) |
| Code Editor | ![editor](screenshots/editor_page.png) |
| Profile Page | ![profile](screenshots/profile_page.png) |
| Submission History | ![submissions](screenshots/submissions_page.png) |

## 🚀 Getting Started

### 🔗 Clone & Install

```bash
# Clone repo
git clone https://github.com/HarshVashiyar/CodeTrialz.git
cd CodeTrialz

# Backend
cd server
npm install
cp .env.example .env
npm run dev

# Code Execution Service
cd CodeBackEnd
npm install
cp .env.example .env
npm run dev

# Frontend
cd ../../client
npm install
npm run dev
```

## 🌳Environemnt Variables

```
client/src/.env:
VITE_BASE_URL=https://oj-backend.harshvashiyar.in/api/
VITE_CHECK_AUTH_STATUS_URL=user/checkauth
VITE_USER_SIGNUP_URL=user/signup
VITE_USER_SIGNIN_URL=user/signin
VITE_SEND_OTP_URL=email/sendotp
VITE_VERIFY_OTP_URL=email/verifyotp
VITE_RESET_PASSWORD_URL=email/resetpassword
VITE_USER_PROFILE_URL=user/getuser
VITE_USER_UPDATE_URL=user/updateuser
VITE_USER_DELETE_URL=user/deleteuser
VITE_USER_LOGOUT_URL=user/logout
VITE_RUN_CODE_URL=code/run
VITE_ADD_PROBLEM_URL=problem/addproblem
VITE_ADD_TESTCASE_URL=problem/addtestcase
VITE_VIEW_PROBLEM_URL=problem/get
VITE_LIST_PROBLEMS_URL=problem/getall
VITE_GET_UNVERIFIED_PROBLEMS_URL=problem/getunverified
VITE_REMOVE_PROBLEMS_URL=problem/delete
VITE_VERIFY_PROBLEMS_URL=problem/verify
VITE_SUBMIT_CODE_URL=code/submit
VITE_VIEW_SUBMISSIONS_URL=user/viewsubmissions
VITE_GET_SOLUTIONS_URL=problem/getsolutions
VITE_GET_SUGGESTIONS_URL=code/suggestions

server/.env:
PORT=8090
MONGO_URI=your_mongodb_uri
JWT_SECRET_KEY=your_secret_key
ADMIN_EMAIL=your_service_email
ADMIN_EMAIL_PASSWORD=your_email_api_key
GOOGLE_API_KEY=your_gemini_api_key
CODE_BACKEND_URL=link_to_microservice_backend_ec2_instance
FRONT_END_URI=links_to_frontend_deployed_url

server/CodeBackEnd/.env:
PORT=8080
GENERAL_BACKEND_URI=link_to_general_backend_ec2_instance
```

## 📁 Folder Structure

```bash
CodeTrialz/
├── client/                     # Frontend - React + Vite
│   ├── src/
│   │   ├── pages/              # Page-level components
│   │   ├── components/         # Reusable UI components
│   │   └── contexts/           # React context for state management
│   └── .env                    # Frontend environment variables

├── server/
│   ├── CodeBackEnd/            # Microservice for code execution
│   │   ├── app.js
│   │   ├── codes/              # Stores user code temporarily
│   │   ├── inputs/             # Stores test inputs
│   │   ├── outputs/            # Stores output files
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── utilities/
│   │   ├── .env
│   │   ├── Dockerfile
│   │   └── .dockerignore

│   ├── app.js                  # Entry point for General API service
│   ├── routes/                 # Auth, problems, submissions routes
│   ├── controllers/            # Route controllers
│   ├── utilities/              # Helper functions/utilities
│   ├── models/                 # Mongoose schemas
│   ├── .env                    # General API environment variables
│   ├── Dockerfile              # Dockerfile for General API
│   └── .dockerignore
```