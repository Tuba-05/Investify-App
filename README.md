# 📈 Investify - Full-Stack Financial Market Telemetry Platform

<p align="center">
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask" />
  <img src="https://img.shields.io/badge/Supabase_PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/yfinance-1F1F1F?style=for-the-badge&logo=yahoo&logoColor=red" alt="yfinance" />
  <img src="https://img.shields.io/badge/Recharts-22B5BF?style=for-the-badge&logo=chartdotjs&logoColor=white" alt="Recharts" />
  <img src="https://img.shields.io/badge/jsPDF-FF0000?style=for-the-badge&logo=adobeacrobatreader&logoColor=white" alt="jsPDF" />
</p>

**Investify** is a production-grade full-stack financial market analytics platform providing real-time stock market telemetry, dynamic market cap rankings, multi-year historical trend visualizations, automated financial report exports (PDF & CSV), and personalized user watchlists. Powered by **Supabase PostgreSQL Cloud Database**, Yahoo Finance live data pipelines, and a high-performance **5-minute in-memory TTL caching engine**.

---

## 📑 Table of Contents
1. [✨ Core Features & Innovations](#core-features)
2. [🛠️ Technology Stack](#technology-stack)
3. [📂 Folder Structure](#folder-structure)
4. [🏗️ System Architecture & Data Flow Diagrams](#system-architecture)
5. [🗄️ Database Architecture & Supabase](#database-architecture)
6. [🔌 REST API Endpoints Specification](#api-endpoints)
7. [🚀 Getting Started & Local Setup](#getting-started)
8. [🎓 Academic Context & DBMS Origin Story](#academic-context)
9. [🤝 Author & Contact](#author-contact)

---

<a id="core-features"></a>
## ✨ Core Features & Innovations

### ⚡ 1. Live Telemetry & 5-Minute Zero-Latency Memory Cache
- **Real-Time Quotes**: Fetches live share prices, market capitalizations, annual revenues, net incomes, assets, and liabilities via `yfinance`.
- **0ms Response Latency**: Implements a 5-minute (300s) server-side memory TTL cache (`STOCKLIST_CACHE_TIME`) so page transitions load instantly without network bottlenecks.

### 🏆 2. Dynamic Market Cap Re-Ranking Engine
- **Live Auto-Sorting**: Companies are dynamically ranked by real-time Market Capitalization descending (#1 NVIDIA, #2 Apple, #3 Google...).
- **60-Second Auto-Polling & Manual Refresh**: Ranks update live every 5 minutes or on demand via the **`🔄 Live Ranks`** button.

### 📊 3. Interactive Trend Visualization & Chart Sliders
- **30-Day Intraday Performance**: Dynamic Recharts slider displaying Stock Price Momentum (Open vs Close), Price Range Volatility (High vs Low), and Volume Telemetry.
- **10-Year Historical Cycle**: Multi-year trajectory sliders tracking historical price boundaries and institutional volume accumulation.

### 📄 4. One-Click PDF & CSV Financial Report Exports
- **`📄 Download PDF Report`**: Generates a branded executive financial audit PDF using `jsPDF` containing share prices, market caps, income statements, and analyst summary notes.
- **`📊 Export CSV`**: Downloads raw structured CSV spreadsheet data for offline Excel/Python analysis.

### 📰 5. Live Tech & Finance News Feed Aggregator
- Live RSS news feed carousel on the WatchList page with auto-sliding headlines, source tags, author metadata, and direct article links.

### 🛡️ 6. Session Management, Protection & User Profile Modal
- **Route Protection (`ProtectedRoute.jsx`)**: Guarded application routes (`/HmPg`, `/StockList`, `/WatchList`, `/Help`, `/AboutUs`, `/CmpFS`) preventing unauthorized access.
- **Session Persistence**: Active sessions automatically redirect returning users directly to `/HmPg`.
- **User Profile Modal**: Interactive sidebar session badge rendering user initials avatar, email badge, saved watchlist stats, and security status.

### ⏱️ 7. Live 2-Minute OTP Countdown & Email Verification
- Live 120-second MM:SS countdown timer (`⏱️ Code Valid For: 01:45`) and strict server-side 2-minute expiration logic. 6-digit OTP codes dispatched via Gmail SMTP for secure password recovery.

### 🎨 8. Premium Dark Glassmorphism UI
- Unified dark slate theme (`#0f172a`), signature world trading map background (`trading-2.png`), glowing cyan accent borders (`#1cb5ab`), high-contrast typography, and gold star watchlist badges.

---

<a id="technology-stack"></a>
## 🛠️ Technology Stack

| Layer | Technologies & Libraries |
|---|---|
| **Frontend Framework** | React 19, Vite, React Router DOM v6 |
| **UI & Styling** | Vanilla CSS3, Dark Glassmorphism, Material-UI (`@mui/x-data-grid`), Boxicons, React Icons |
| **Data Visualization** | Recharts, Chart.js, ApexCharts, Plotly.js, Framer Motion |
| **Document Export** | `jsPDF`, `html2canvas` |
| **Backend Framework** | Python 3.12, Flask, Flask-CORS, Flask-SQLAlchemy ORM |
| **Data Processing** | `yfinance`, Pandas, NumPy, Werkzeug Security, `psycopg2-binary` |
| **Database** | Supabase PostgreSQL Cloud Database |
| **Mail Dispatch** | Python `smtplib` over TLS (Gmail App Password) |

---

<a id="folder-structure"></a>
## 📂 Folder Structure

### ⚙️ Backend Structure (`/backend`)

```text
backend/
├── database/
│   └── database.py          # Supabase PostgreSQL connection & DB initializer
├── jsonfiles/
│   ├── companies.json       # Company metadata reference dataset
│   ├── last20yrs_historical_data.json
│   └── last30days_historical_data.json
├── models/
│   └── models.py            # SQLAlchemy ORM Models (User, Company, FinancialStatement, Watchlist, ForgotPassword)
├── ottp/
│   └── ottp.py              # 6-digit OTP generator & SMTP mail dispatch
├── routes/
│   ├── auth_routes.py       # Signup, Login, Password Reset, & Support Ticket API
│   ├── company_routes.py    # StockList quotes, 5-min memory cache, & company details API
│   ├── graphs.py            # 30-Day intraday & 10-Year historical Recharts graph series API
│   ├── news.py              # Live Tech & Finance RSS headlines API
│   └── watchlist.py         # User watchlist bookmarking API
├── .env                     # Supabase PostgreSQL URI & SMTP credentials
├── .env.example             # Backend environment template
└── app.py                   # Main Flask application entry point & CORS configuration
```

### 💻 Frontend Structure (`/frontend`)

```text
frontend/
├── public/                  # Public assets & icon files
├── src/
│   ├── assets/              # App images (signature trading-2.png background)
│   ├── components/
│   │   ├── AboutUs/         # About Us page & DBMS academic evolution story
│   │   ├── CmpFS/           # Financial Statements, Recharts sliders, & PDF/CSV report exports
│   │   ├── Help/            # Support center with expanded FAQs & contact ticket form
│   │   ├── HomePg/          # Interactive Home Dashboard
│   │   ├── LoginSignUp/     # Authentication page & inline glassmorphism error alerts
│   │   ├── Navbar/          # Frosted glass sidebar & User Profile Modal badge
│   │   ├── ProtectedRoute.jsx # Session route guard wrapper
│   │   ├── StockList/       # Market Cap dynamic ranking table & live search bar
│   │   ├── VeriCode/        # 6-digit OTP verification code & 2-min countdown timer
│   │   └── WatchList/       # Bookmarked stocks grid & live news carousel
│   ├── App.jsx              # Application router & protected route guard layout
│   └── main.jsx             # React 19 entry mounting point
├── package.json             # Frontend packages & build scripts (React 19, Recharts, jsPDF, MUI)
└── vite.config.js           # Vite dev server configuration & port locking (5173)
```

---

<a id="system-architecture"></a>
## 🏗️ System Architecture & Data Flow Diagrams

### 1. High-Level Full-Stack System Architecture

```text
========================================================================================
                      INVESTIFY FULL-STACK SYSTEM ARCHITECTURE
========================================================================================

                             [ 👤 User / Browser ]
                                       │
                                (Port 5173 - HTTP)
                                       ▼
                  +-----------------------------------------+
                  |      💻 React 19 Frontend (Vite)        |
                  |-----------------------------------------|
                  | • Navbar & Glassmorphic Session Modal   |
                  | • StockList (Live Market Cap Ranks)     |
                  | • CmpFS (Recharts Intraday & 10-Yr)     |
                  | • Document Exports (jsPDF & CSV)        |
                  | • WatchList & Live RSS News Carousel    |
                  | • Help Support Center & Ticket Form     |
                  | • ProtectedRoute Session Guard          |
                  +-----------------------------------------+
                                       │
                              (Port 5000 - REST API)
                                       ▼
                  +-----------------------------------------+
                  |     ⚙️ Flask REST API Server Backend    |
                  |-----------------------------------------|
                  | • Flask Blueprint Routes (Auth/Stock)   |
                  | • ⚡ 5-Minute In-Memory TTL Cache Engine |
                  | • Werkzeug Password Hashing             |
                  | • Background Thread Dispatcher          |
                  +-----------------------------------------+
                       │               │               │
     (SQLAlchemy ORM)  │               │ (Live Fetch)  │ (TLS Port 587)
                       ▼               ▼               ▼
           +-----------------------+ +--------------+ +-------------------+
           | 🗄️ Supabase PostgreSQL| | 📈 Yahoo     | | 📧 Gmail SMTP     |
           | Cloud Database        | | Finance API  | | Email Server      |
           | (Users, Companies, FS,| | (yfinance)   | | (OTP & Support  |
           | Watchlist, OTP Codes) | |              | | Ticket Dispatch)|
           +-----------------------+ +--------------+ +-------------------+
========================================================================================
```

### 2. Authentication & 2-Minute OTP Verification Sequence

```text
========================================================================================
               🔐 AUTHENTICATION & 2-MINUTE OTP PASSWORD RESET FLOW
========================================================================================

   [User]            [React Frontend]         [Flask Backend]        [Supabase DB]        [Gmail SMTP]
     │                      │                        │                     │                 │
 1.  │─── Click "Forgot" ──►│                        │                     │                 │
     │    Enter Email       │                        │                     │                 │
 2.  │                      │── POST /veri-code ────►│                     │                 │
 3.  │                      │                        │── Save Code ───────►│                 │
 4.  │                      │                        │── Dispatch Email ────────────────────►│
 5.  │                      │                        │                                       │── Send OTP ──► User Inbox
 6.  │◄── Redirect to VeriCode Page (Live 120s Timer Starts) ────────────────────────────────│
 7.  │─── Enter OTP Code ──►│                        │                     │                 │
 8.  │                      │── POST /check-code ───►│                     │                 │
     │                      │                        │                     │                 │
     │    ┌─────────────────┴────────────────────────┴─────────────────────┴──────────────┐  │
     │    │  Backend Expiration & Validity Guard:                                         │  │
     │    │  • If Now > Expired_At (2 Min Exceeded) ──► Return 400 "Code Expired"         │  │
     │    │  • If Code Valid ─────────────────────────► Return 200 OK & Flag Mode          │  │
     │    └─────────────────┬────────────────────────┬─────────────────────┬──────────────┘  │
     │                      │                        │                     │                 │
 9.  │◄── Redirect to Login Page with Success Guidance Banner ────────────────────────────│
10.  │─── Enter Email & ───►│                        │                     │                 │
     │    NEW Password      │── POST /login ────────►│                     │                 │
11.  │                      │   (ChangePassword=true)│── Update Hash ─────►│                 │
12.  │                      │◄── Return User Data ───│                     │                 │
13.  │◄── Login Successful! Redirect to Home Dashboard (/HmPg) ───────────────────────────│
========================================================================================
```

---

<a id="database-architecture"></a>
## 🗄️ Database Architecture & Supabase

Investify operates on a cloud-hosted **Supabase PostgreSQL** database with SQLAlchemy ORM mappings:

- **`companies`** (1,106 records): Stores company symbols, names, sectors, countries, market caps, and live USD prices (`price(USD)`).
- **`financial_statement`** (1,079 records): Stores annual revenue, net income, profit margin, total assets, total liabilities, equity, and telemetry report dates.
- **`users`**: Manages user credentials (hashed passwords via Werkzeug), usernames, and registration timestamps.
- **`watchlist`**: Relational mapping between user IDs and bookmarked company IDs.
- **`forgot_password_details`**: Stores generated 6-digit OTP verification codes, expiration timestamps, and request counters.

---

<a id="api-endpoints"></a>
## 🔌 REST API Endpoints Specification

### 🔐 1. Authentication & Security Endpoints (`/api/auth`)

| Method | Endpoint | Description | Sample Request Body | Sample Response |
|---|---|---|---|---|
| `POST` | `/api/auth/login` | Authenticates user credentials or updates password in reset mode | `{"email": "user@example.com", "password": "newpass123", "ChangePassword": "true"}` | `{"success": true, "user": {"id": 1, "name": "Tuba", "email": "user@example.com"}}` |
| `POST` | `/api/auth/signup` | Registers new user and hashes password in Supabase DB | `{"username": "Tuba", "email": "user@example.com", "password": "secretpass"}` | `{"success": true, "message": "User registered successfully"}` |
| `POST` | `/api/auth/veri-code-fpassword` | Generates 6-digit OTP code & dispatches email via Gmail SMTP | `{"email": "user@example.com"}` | `{"success": true, "message": "Code sent to email"}` |
| `POST` | `/api/auth/check-veri-code` | Validates 6-digit OTP code against 2-minute expiration window | `{"email": "user@example.com", "veriCode": "A9B2X7"}` | `{"success": true, "message": "Code Verified Successfully!"}` |
| `POST` | `/api/auth/submit-support-ticket` | Dispatches support ticket to admin Gmail via SMTP | `{"name": "Tuba", "email": "user@example.com", "category": "General Query", "message": "Hello!"}` | `{"success": true, "message": "Support ticket sent successfully!"}` |

---

### 📈 2. Companies & Stock Telemetry Endpoints (`/api/companies`)

| Method | Endpoint | Description | URL Parameters | Sample Response |
|---|---|---|---|---|
| `GET` | `/api/companies/companies` | Fetches live stock quotes, market caps, 5-min memory TTL cache, and rankings | None | `[{"id": 1, "symbol": "NVDA", "name": "NVIDIA", "price": 130.5, "market_cap": 3200000000000}]` |
| `GET` | `/api/companies/company/<int:id>` | Fetches company profile, income statements, assets, liabilities & logo | `id` (Company ID) | `{"id": 1, "symbol": "NVDA", "revenue": "$60.9B", "net_income": "$29.7B"}` |

---

### 📊 3. Analytics & Recharts Trend Endpoints (`/api/analytics`)

| Method | Endpoint | Description | URL Parameters | Sample Response |
|---|---|---|---|---|
| `GET` | `/api/analytics/historical-data-last-thirtyDAYS/<symbol>` | Fetches 30-Day intraday price, volume & volatility series | `symbol` (e.g. `NVDA`) | `{"dates": ["2026-07-01", ...], "close": [128.4, 130.5], "volume": [45000000, ...]}` |
| `GET` | `/api/analytics/historical-data-last-twentyYRS/<symbol>` | Fetches 10-Year historical performance cycle series | `symbol` (e.g. `AAPL`) | `{"dates": ["2016-01-01", ...], "close": [24.2, 185.0]}` |

---

### ⭐ 4. Watchlist Management Endpoints (`/api/watchlist`)

| Method | Endpoint | Description | URL Parameters | Sample Response |
|---|---|---|---|---|
| `GET` | `/api/watchlist/watchlist/<user_id>` | Fetches bookmarked companies for specified user | `user_id` | `[{"id": 1, "company_id": 10, "symbol": "AAPL"}]` |
| `POST` | `/api/watchlist/watchlist/<user_id>/<company_id>` | Adds company to user's personal watchlist | `user_id`, `company_id` | `{"success": true, "message": "Added to Watchlist"}` |
| `DELETE` | `/api/watchlist/watchlist/<user_id>/<company_id>` | Removes company from user's watchlist | `user_id`, `company_id` | `{"success": true, "message": "Removed from Watchlist"}` |

---

### 📰 5. Financial News Aggregator Endpoints (`/api/news`)

| Method | Endpoint | Description | URL Parameters | Sample Response |
|---|---|---|---|---|
| `GET` | `/api/news/fetch-daily-news` | Fetches real-time Tech & Finance RSS news headlines carousel | None | `[{"title": "NVIDIA Unveils Next-Gen AI Chip", "link": "https://...", "pubDate": "2026-08-15"}]` |

---

<a id="getting-started"></a>
## 🚀 Getting Started & Local Setup

### Prerequisites
- **Node.js**: v18+ & `npm`
- **Python**: v3.10+
- **Supabase Account / Connection String**
- **Gmail SMTP App Password** (for OTP dispatch)

---

### 1. Backend Setup (Flask REST API)

```bash
# 1. Navigate to backend
cd backend

# 2. Create virtual environment
python -m venv venv

# Windows activate:
.\venv\Scripts\activate
# Mac/Linux activate:
source venv/bin/activate

# 3. Install Python dependencies
pip install flask flask-cors flask-sqlalchemy psycopg2-binary yfinance pandas numpy requests python-dotenv

# 4. Configure .env file
cp .env.example .env
```

Edit `backend/.env`:
```env
FLASK_APP=app.py
FLASK_ENV=development
PORT=5000
SECRET_KEY=your_investify_secret_key

# Supabase PostgreSQL Connection String
DATABASE_URL=postgresql://postgres.your_ref:your_password@db.your_ref.supabase.co:6543/postgres

# SMTP Email Parameters
SMTP_SENDER_EMAIL=your_email@gmail.com
SMTP_APP_PASSWORD=your_16_char_app_password
```

Run backend server:
```bash
python app.py
```

---

### 2. Frontend Setup (React & Vite)

```bash
# 1. Navigate to frontend
cd ../frontend

# 2. Install dependencies
npm install

# 3. Launch Vite dev server
npm run dev
```

Application will run on `http://localhost:5173`.

---

<a id="academic-context"></a>
## 🎓 Academic Context & DBMS Origin Story

Investify was originally developed as an academic learning project for a **Database Management Systems (DBMS)** university course at **NED University of Engineering & Technology (NEDUET)**. The initial focus was understanding relational database design, table entity relationships, foreign key constraints, and SQL ORM queries.

Post-course, the platform underwent production-grade architectural enhancements — migrating to **Supabase PostgreSQL Cloud DB**, integrating **live Yahoo Finance telemetry**, implementing **5-minute memory caching**, developing **PDF/CSV document generators**, and crafting a signature **Glassmorphic Dark Interface**.

---

<a id="author-contact"></a>
## 🤝 Author & Contact

**Tuba Naushad**  
*Computer & Information Systems (CIS) Engineering Student @ NEDUET*

- **LinkedIn**: [Tuba Naushad Profile](https://linkedin.com/in/tuba-naushad-6a4552253)
- **Email**: [tubabintenaushad@gmail.com](mailto:tubabintenaushad@gmail.com)
- **GitHub**: [Tuba-05 / Investify-App](https://github.com/Tuba-05/Investify-App)
