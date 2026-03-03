# 📊 AI-Powered Personal Finance Advisor (Deep Learning)

## 🧠 Project Overview

AI-Powered Personal Finance Advisor is a Full-Stack web application that uses a Deep Learning model to analyze personal financial data and predict potential savings.

The system helps users understand their spending behavior, optimize their expenses, and receive intelligent financial recommendations powered by Artificial Intelligence.

This project combines Deep Learning, Backend API development, and a modern Frontend interface.

---

## 🚀 Key Features

- 🔐 Secure User Authentication (JWT)
- 🧠 Deep Learning Prediction Model
- 📊 Expense Analysis by Category
- 🤖 AI Financial Chatbot Integration
- 🖥 Modern Responsive UI (Next.js + Tailwind)
- 🗄 SQLite Database (Django default DB)

---

## 🏗️ Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
- Django
- Django REST Framework
- JWT Authentication

### Deep Learning
- Python
- TensorFlow / Keras
- NumPy
- Pandas

### Database
- SQLite

---

## 📁 Project Structure

```
AI-Powered-Personal-Finance-Advisor/
│
├── backend/
│   ├── api/
│   ├── ml/
│   ├── config/
│   └── manage.py
│
├── frontend/
│
└── README.md

---

## ⚙️ Installation Guide (Without Docker)

### 1️⃣ Clone the Repository

git clone https://github.com/BOULATARM/AI-Powered-Personal-Finance-Advisor.git
cd AI-Powered-Personal-Finance-Advisor

### 2️⃣ Backend Setup

cd backend
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate

# Mac/Linux:
# source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

Backend will run on:
http://127.0.0.1:8000

### 3️⃣ Frontend Setup

Open a new terminal:

cd frontend
npm install
npm run dev

Frontend will run on:
http://localhost:3000

---

## 🔌 API Endpoints

### 🔐 Authentication

POST /api/auth/register/

{
  "username": "user1",
  "email": "user@email.com",
  "password": "password123"
}

POST /api/auth/login/

{
  "username": "user1",
  "password": "password123"
}

---

### 📊 Deep Learning Prediction

POST /api/predict/

{
  "Income": 5000,
  "Age": 30,
  "Dependents": 2,
  "Disposable_Income": 1500,
  "Desired_Savings": 1000,
  "Groceries": 400,
  "Transport": 300,
  "Eating_Out": 200,
  "Entertainment": 150,
  "Utilities": 250,
  "Healthcare": 100,
  "Education": 200,
  "Miscellaneous": 150,
  "Occupation": "Professional",
  "City_Tier": "Tier_1"
}

---

## 🧠 How the Deep Learning Model Works

1. User submits financial data  
2. Backend preprocesses the input  
3. Deep Learning model predicts potential savings  
4. Results are returned through REST API  
5. Frontend displays personalized financial insights  

---

## 🔐 Security

- JWT Authentication  
- Protected API endpoints  
- Backend validation  
- Environment variables for API keys  

---

## 📈 Future Improvements

- Advanced financial dashboard with charts  
- Monthly trend analysis  
- Mobile application version  
- Smart financial alerts  
- Bank API integration  

---

## 👨‍💻 Author

Developed by BOULATARM
EOF
