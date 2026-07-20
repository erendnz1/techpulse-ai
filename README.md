# 🚀 TechPulse AI

> **AI-powered software technology monitoring platform** that aggregates software news, framework releases, AI developments, security vulnerabilities, and technology updates from multiple trusted sources into one intelligent dashboard.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange?style=for-the-badge)
![Groq](https://img.shields.io/badge/Groq-AI-blueviolet?style=for-the-badge)

> ## 📖 Project Overview

TechPulse AI is an AI-powered software technology monitoring platform designed for software developers, IT teams, and technology enthusiasts.

The platform automatically collects software-related news from multiple trusted sources, analyzes the content using artificial intelligence, categorizes articles, evaluates their importance and security risk, and delivers personalized updates through a modern dashboard.

Instead of visiting dozens of technology websites every day, users can monitor everything from a single platform.

The project was developed as a full-stack web application using FastAPI, Next.js, PostgreSQL, and AI-powered content analysis.

## ✨ Key Features

- 🔐 JWT Authentication
- 👤 Personalized User Preferences
- 🤖 AI-powered News Analysis
- 📰 Multi-source News Aggregation
- 🚨 Security Vulnerability Monitoring (CVE)
- 📊 Interactive Analytics Dashboard
- 📈 Statistics & Charts
- 🔔 Personalized Notifications
- 🌍 RSS Feed Integration
- ⚡ Automatic Background Scheduler
- 🌙 Dark / Light Theme
- 📱 Responsive Design

- ## 📸 Platform Preview

### Landing Page

> Screenshot will be added.

### Dashboard

> Screenshot will be added.

### News

> Screenshot will be added.

### Security

> Screenshot will be added.

### Sources

> Screenshot will be added.
>
> ## 📰 News Sources

TechPulse AI continuously monitors multiple trusted technology sources to provide comprehensive software updates.

| Category | Sources |
|----------|----------|
| 🤖 Artificial Intelligence | OpenAI, Hugging Face |
| 💻 Frameworks | React, Next.js, Laravel, .NET Blog, Node.js |
| ☁️ Cloud & DevOps | AWS, Cloudflare, Docker, Kubernetes |
| 🛠 Developer Tools | GitHub Releases, JetBrains, Dev.to |
| 🔒 Security | NVD, CVE, KVKK |
| 🌍 Technology News | NewsAPI, DonanımHaber, ShiftDelete.Net |

More sources can easily be added through the modular RSS architecture.

## 🏗️ System Architecture

```text
                ┌──────────────────────────┐
                │   News APIs / RSS Feeds  │
                │ GitHub • CVE • Dev.to    │
                │ OpenAI • AWS • React     │
                └────────────┬─────────────┘
                             │
                             ▼
                 Fetch & Aggregation Services
                             │
                             ▼
                  AI Content Analysis (Groq)
                             │
                             ▼
                    PostgreSQL Database
                             │
                ┌────────────┴────────────┐
                ▼                         ▼
          FastAPI REST API          Background Scheduler
                │
                ▼
        Next.js Frontend Dashboard
                │
                ▼
             End Users

# 8️⃣ Tech Stack

```md
## 🛠️ Tech Stack

### Backend

- FastAPI
- SQLAlchemy
- PostgreSQL
- JWT Authentication
- APScheduler
- Pydantic
- Groq API

### Frontend

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Recharts
- Framer Motion

### AI

- Groq Llama 3.3

### Database

- PostgreSQL

### Version Control

- Git
- GitHub

## 📁 Project Structure

```text
TechPulseAI
│
├── backend
│   ├── app
│   │   ├── api
│   │   ├── crud
│   │   ├── models
│   │   ├── schemas
│   │   ├── services
│   │   ├── scheduler
│   │   └── core
│   └── requirements.txt
│
├── frontend
│   ├── app
│   ├── components
│   ├── hooks
│   ├── public
│   └── package.json
│
└── README.md


---

# 🔟 Installation

```md
## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/erendnz1/techpulse-ai.git

cd techpulse-ai
Backend
cd backend

python -m venv .venv

pip install -r requirements.txt

uvicorn app.main:app --reload
Frontend
cd frontend

npm install

npm run dev

Backend will be available at:

http://localhost:8000
Frontend will be available at:

http://localhost:3000

# 1️⃣1️⃣ Environment Variables

```md
## 🔑 Environment Variables

Create a `.env` file inside the backend directory.

```env
DATABASE_URL=

SECRET_KEY=

ALGORITHM=

ACCESS_TOKEN_EXPIRE_MINUTES=

NEWS_API_KEY=

GROQ_API_KEY=

1️⃣2️⃣ API Endpoints
## 📡 API Endpoints

The backend exposes a RESTful API built with FastAPI.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Authenticate user and return JWT token |
| GET | `/dashboard` | Dashboard statistics |
| GET | `/news` | Get latest news |
| GET | `/news/{id}` | Get news details |
| POST | `/news/fetch` | Fetch and process news from all sources |
| POST | `/news/reanalyze` | Reanalyze articles using AI |
| GET | `/preferences/me` | Get user preferences |
| PUT | `/preferences/me` | Update user preferences |
| GET | `/notifications` | Get user notifications |
| PATCH | `/notifications/{id}/read` | Mark notification as read |

1️⃣3️⃣ Dashboard Features
## 📊 Dashboard Features

The dashboard provides users with real-time insights into the software ecosystem.

- 📈 Total Articles
- 🔥 Trending Technologies
- 🤖 AI Generated Summaries
- 🚨 Security Risk Monitoring
- 📊 Category Distribution
- 🌍 Source Distribution
- 🔔 Personalized Notifications
- ⚡ Latest Software Updates
- 📱 Responsive Interface

1️⃣4️⃣ AI Analysis
## 🤖 AI Analysis

Every collected article is analyzed using Groq AI.

The AI automatically generates:

- News Summary
- Category Classification
- Importance Score
- Risk Level
- Affected Technologies
- Recommended Action

This allows users to quickly understand the relevance and potential impact of each software update.

1️⃣5️⃣ Screenshots

Şimdilik şöyle bırak.

## 📸 Screenshots

### 🏠 Landing Page

<img src="screenshots/landing.png" width="100%">

---

### 📊 Dashboard

<img src="screenshots/dashboard.png" width="100%">

---

### 📰 News

<img src="screenshots/news.png" width="100%">

---

### 🚨 Security

<img src="screenshots/security.png" width="100%">

---

### ⚙️ Preferences

<img src="screenshots/preferences.png" width="100%">

---

### 📚 Sources

<img src="screenshots/sources.png" width="100%">

1️⃣6️⃣ Future Improvements
## 🚀 Future Improvements

- 📧 Email Notifications
- 📱 Mobile Application
- 🔔 Push Notifications
- 🌍 Multi-language Support
- 📄 Export Reports (PDF / Excel)
- 👥 Team Collaboration
- 📈 Advanced Trend Analytics
- 🤖 AI Trend Prediction

1️⃣7️⃣ Contributing
## 🤝 Contributing

Contributions are welcome!

If you have ideas for improvements or new features, feel free to fork the repository and submit a pull request
1️⃣8️⃣ License
## 📄 License

This project is licensed under the MIT License.
## 👨‍💻 Author

**Eren Deniz**
Computer Engineering

GitHub:
https://github.com/erendnz1

---

⭐ If you found this project useful, consider giving it a star.
