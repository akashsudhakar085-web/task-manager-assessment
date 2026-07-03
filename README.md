# 📋 Task Manager Web App

A full-stack Task Manager application built with **React**, **Flask**, and **MongoDB**.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Flask](https://img.shields.io/badge/Flask-3-green) ![MongoDB](https://img.shields.io/badge/MongoDB-7-brightgreen) ![License](https://img.shields.io/badge/License-MIT-yellow)

## 🚀 Features

- **User Registration** — Sign up with name, email, and password
- **User Login** — Log in with email and password
- **Dashboard** — Welcome page with task management
- **CRUD Operations** — Create, Read, Update, and Delete tasks
- **Session Management** — Uses localStorage for simple session handling
- **Responsive Design** — Works on desktop and mobile devices

## 📁 Folder Structure

```
intern login task 1/
├── backend/
│   ├── app.py              # Flask server with all API endpoints
│   ├── requirements.txt    # Python dependencies
│   ├── .env.example        # Environment variable template
│   └── .gitignore          # Git ignore for backend
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx       # Login page component
│   │   │   ├── Register.jsx    # Registration page component
│   │   │   └── Dashboard.jsx   # Dashboard with task CRUD
│   │   ├── App.jsx             # Main app with routing logic
│   │   ├── App.css             # All styles (dark theme)
│   │   └── main.jsx            # React entry point
│   ├── index.html
│   ├── package.json
│   └── .gitignore
│
└── README.md               # This file
```

## 🛠️ Tech Stack

| Layer      | Technology     |
|------------|----------------|
| Frontend   | React 18 (Vite)|
| Backend    | Python Flask   |
| Database   | MongoDB        |
| API        | REST API       |
| HTTP Client| Fetch API      |

## 📡 API Endpoints

| Method | Endpoint            | Description              |
|--------|---------------------|--------------------------|
| GET    | `/`                 | Health check             |
| POST   | `/register`         | Register a new user      |
| POST   | `/login`            | Login existing user      |
| GET    | `/tasks/<email>`    | Get all tasks for a user |
| POST   | `/tasks`            | Create a new task        |
| PUT    | `/tasks/<task_id>`  | Update a task            |
| DELETE | `/tasks/<task_id>`  | Delete a task            |

## ⚙️ Prerequisites

Before running this project, make sure you have:

1. **Node.js** (v18 or higher) — [Download](https://nodejs.org/)
2. **Python** (v3.8 or higher) — [Download](https://python.org/)
3. **MongoDB** — Choose one option:
   - **Option A (Recommended): MongoDB Atlas (Cloud - Free)**
     1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
     2. Create a free account
     3. Create a free cluster (M0 Sandbox)
     4. Click "Connect" → "Connect your application"
     5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`)
   - **Option B: Local MongoDB**
     1. Download [MongoDB Community Server](https://www.mongodb.com/try/download/community)
     2. Install and start the MongoDB service
     3. Default connection string: `mongodb://localhost:27017/`

## 🚀 How to Run the Project

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd "intern login task 1"
```

### Step 2: Set Up the Backend

```bash
# Navigate to backend folder
cd backend

# Create a virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file from template
copy .env.example .env
# (On Mac/Linux: cp .env.example .env)

# Edit .env and add your MongoDB connection string
# MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/

# Run the Flask server
python app.py
```

The backend will start at: **http://localhost:5000**

### Step 3: Set Up the Frontend

Open a **new terminal** window:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start at: **http://localhost:5173**

## 🧪 How to Test

### 1. Test Registration
1. Open **http://localhost:5173** in your browser
2. Click "Create an account" or go to Register page
3. Fill in:
   - Name: `John Doe`
   - Email: `john@example.com`
   - Password: `123456`
4. Click "Register"
5. You should see a success message

### 2. Test Login
1. Go to the Login page
2. Enter:
   - Email: `john@example.com`
   - Password: `123456`
3. Click "Login"
4. You should be redirected to the Dashboard

### 3. Test Task CRUD

#### Create a Task
1. On the Dashboard, fill in the task form:
   - Title: `Complete Assignment`
   - Description: `Finish the React project`
   - Status: `To Do`
2. Click "Add Task"
3. The task should appear in the task list

#### View Tasks
- All your tasks are displayed on the Dashboard automatically

#### Update a Task
1. Click the "Edit" button on a task card
2. The form will be filled with the task data
3. Modify the fields (e.g., change status to "In Progress")
4. Click "Update Task"

#### Delete a Task
1. Click the "Delete" button on a task card
2. Confirm the deletion
3. The task should be removed from the list

### 4. Test Logout
1. Click the "Logout" button in the header
2. You should be redirected to the Login page
3. The localStorage should be cleared

## 🌐 Deployment on Render

### Deploy Backend on Render

1. Push your code to a **GitHub repository**

2. Go to [Render Dashboard](https://dashboard.render.com/)

3. Click **"New +"** → **"Web Service"**

4. Connect your GitHub repository

5. Configure the service:
   | Setting         | Value                          |
   |-----------------|--------------------------------|
   | Name            | `task-manager-backend`         |
   | Region          | Choose nearest                 |
   | Branch          | `main`                         |
   | Root Directory  | `backend`                      |
   | Runtime         | `Python 3`                     |
   | Build Command   | `pip install -r requirements.txt` |
   | Start Command   | `gunicorn app:app`             |

6. Add **Environment Variable**:
   - Key: `MONGO_URI`
   - Value: Your MongoDB Atlas connection string

7. Click **"Create Web Service"**

8. Wait for deployment. Note the URL (e.g., `https://task-manager-backend-xxxx.onrender.com`)

### Deploy Frontend on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)

2. Click **"New +"** → **"Static Site"**

3. Connect the same GitHub repository

4. Configure the service:
   | Setting         | Value                          |
   |-----------------|--------------------------------|
   | Name            | `task-manager-frontend`        |
   | Branch          | `main`                         |
   | Root Directory  | `frontend`                     |
   | Build Command   | `npm install && npm run build` |
   | Publish Directory | `dist`                       |

5. **IMPORTANT**: Before deploying, update the API URL in your frontend code:
   - Open `frontend/src/components/Login.jsx`
   - Open `frontend/src/components/Register.jsx`
   - Open `frontend/src/components/Dashboard.jsx`
   - Change `const API_URL = 'http://localhost:5000'` to:
   - `const API_URL = 'https://task-manager-backend-xxxx.onrender.com'`
   - (Replace with your actual Render backend URL)

6. Click **"Create Static Site"**

7. Wait for deployment. Your app will be live!

### Post-Deployment Checklist
- [ ] Backend health check returns `{"message": "Task Manager API is running"}`
- [ ] Frontend loads correctly
- [ ] Registration works
- [ ] Login works
- [ ] Task CRUD works
- [ ] CORS is properly configured for your frontend URL

## 📝 Task Schema

```json
{
  "title": "string (required)",
  "description": "string (optional)",
  "status": "string (To Do | In Progress | Done)",
  "email": "string (user's email)"
}
```

## 👤 User Schema

```json
{
  "name": "string (required)",
  "email": "string (required, unique)",
  "password": "string (required)"
}
```

## ⚠️ Important Notes

- This project uses **plain text passwords** for simplicity (assessment purpose only)
- **Do NOT use this in production** — always use password hashing (bcrypt) and JWT tokens in real projects
- Session is managed using **localStorage** (not cookies or JWT)
- CORS is enabled for **all origins** (restrict this in production)

## 📜 License

This project is created for educational/assessment purposes.
