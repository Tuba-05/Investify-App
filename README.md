Investify project ke liye complete, enhanced **README.md** file (architecture tree aur details ke sath) ye hai:

```markdown
# 📈 Investify

<p align="center">
  <img src="https://img.shields.io/badge/React.js-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=mui&logoColor=white" alt="Material-UI" />
  <img src="https://img.shields.io/badge/yfinance-1F1F1F?style=for-the-badge&logo=yahoo&logoColor=red" alt="yfinance" />
</p>

Investify is a full-stack financial web application providing real-time stock market insights, comprehensive company data, historical financial statements, and personalized user watchlists.

---

## 📑 Table of Contents
1. [Key Features](#-key-features)
2. [Technologies Used](#%EF%B8%8F-technologies-used)
3. [Folder Structure](#-folder-structure)
4. [Getting Started & Local Setup](#-getting-started--local-setup)
5. [Interface Preview](#-interface-preview)
6. [Key Takeaways](#-key-takeaways)
7. [Author](#-author)

---

## ✨ Key Features

- **Secure Authentication:** User signup, login, and password reset verified via **OTP (One-Time Password)** email integration.
- **Live Market Data:** Integrates external APIs and `yfinance` to fetch real-time stock rates, historical charts, and statements.
- **Interactive Visualization:** Dynamic stock graphs showcasing **30-day performance** and **long-term trends** using Recharts.
- **Personalized Watchlist:** Custom stock list management per user stored in a relational schema.
- **Data Pipelines:** Scheduled background tasks to parse and refresh stock telemetry data.

---

## 🛠️ Technologies Used

- **Backend:** Flask, Flask-SQLAlchemy (PostgreSQL ORM), Werkzeug Security, SMTP (`smtplib` for OTPs), `yfinance`, Pandas, NumPy
- **Frontend:** React, React Router, Material-UI (`@mui/x-data-grid`), Recharts, Framer Motion, Lottie React, React Icons
- **Database:** PostgreSQL
- **Dev Tools:** VS Code, Git/GitHub, Postman

---

## 📂 Folder Structure

```text
Investify/
├── backend/                  # Flask Backend Application
│   ├── database/             # DB initialization and schemas
│   ├── jsonfiles/            # Static JSON files / configuration
│   ├── logs/                 # System and error logs
│   ├── models/               # SQLAlchemy models (User, Stocks, Watchlist)
│   ├── ottp/                 # OTP verification and email dispatch logic
│   ├── routes/               # API blueprint routes (Auth, Stocks, Watchlist)
│   ├── tests/                # Server-side testing scripts
│   ├── testsamples/          # Sample tests mock data
│   ├── txt_files/            # Text resources
│   ├── updates/              # Background scheduler / cron scripts
│   └── app.py                # Flask main entry application
├── frontend/                 # React Frontend Application (Vite)
│   ├── public/               # Public assets folder
│   ├── src/                  # React components, pages & state management
│   ├── eslint.config.js      # Linter configurations
│   ├── index.html            # Core entry HTML
│   ├── package-lock.json
│   ├── package.json          # Frontend scripts & modules dependencies
│   └── vite.config.js        # Vite configurations
├── Investify Web App.docx    # Project documentation file
├── .gitignore
└── README.md                 # Main README file
```

---

## 🚀 Getting Started & Local Setup

### Prerequisites
- Python 3.8+
- Node.js (v16+)
- PostgreSQL Database
- SMTP credentials (Gmail App Password) for sending OTP emails

### 🖥️ 1. Backend Setup (Flask)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   # On Windows
   python -m venv venv
   .\venv\Scripts\activate

   # On macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up environment variables for PostgreSQL connection and SMTP parameters.
5. Launch the backend server:
   ```bash
   python app.py
   ```

### 💻 2. Frontend Setup (React/Vite)

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install the node packages:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

---

## 📸 Interface Preview

<p align="center">
  <i>(UI will be diaplayed soon)</i>
</p>

---

## 🧠 Key Takeaways
Developing Investify provided hands-on experience in:
* **RESTful Design:** Building clean REST API patterns using Flask Blueprints.
* **Component Optimization:** Crafting modular React states and hooks for asynchronous data loading.
* **Data Processing:** Operating on market records using Pandas and NumPy.
* **Database Optimization:** Managing custom Watchlist relational tables in PostgreSQL via SQLAlchemy ORM.

---

## 🎓 Academic Context
This project was developed as part of the **Computer & Information Systems Engineering** curriculum at **NED University of Engineering and Technology** to demonstrate:
* Full-stack application architecture.
* Real-world data integration with live APIs.
* Relational database planning.

---

## 🤝 Author

<p align="left">
  <b>Tuba Naushad</b><br>
  <i>CIS Engineering Student @ NEDUET</i>
</p>

<p align="left">
  <a href="https://linkedin.com/in/tuba-naushad-6a4552253" target="_blank">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
  &nbsp;
  <a href="mailto:tubabintenaushad@gmail.com">
    <img src="https://img.shields.io/badge/Email-D14836?style=flat-square&logo=gmail&logoColor=white" alt="Email" />
  </a>
</p>
```
