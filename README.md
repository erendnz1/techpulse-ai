# 🚀 TechPulse AI

AI-powered software technology monitoring platform that aggregates software news, framework releases, AI developments, security vulnerabilities, and technology updates from multiple trusted sources into one intelligent dashboard.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-F55036?style=flat&logoColor=white)

---

## 📖 Project Overview

**TechPulse AI** is an AI-powered software technology monitoring platform designed for software developers, IT teams, and technology enthusiasts.

The platform automatically collects software-related news from multiple trusted sources, analyzes the content using artificial intelligence, categorizes articles, evaluates their importance and security risk, and delivers personalized updates through a modern dashboard.

Instead of visiting dozens of technology websites every day, users can monitor everything from a single platform.

The project was developed as a full-stack web application using **FastAPI**, **Next.js**, **PostgreSQL**, and AI-powered content analysis.

---

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

--
## 📸 Platform Preview

| Page | Preview |
|---|---|
| Landing Page | *Screenshot will be added.* |
| Dashboard | *Screenshot will be added.* |
| News | *Screenshot will be added.* |
| Security | *Screenshot will be added.* |
| Sources | *Screenshot will be added.* |

---
## 📰 News Sources
TechPulse AI continuously monitors multiple trusted technology sources to provide comprehensive software updates.

| Category | Sources |
|---|---|
| 🤖 Artificial Intelligence | OpenAI, Hugging Face |
| 💻 Framework | React, Next.js, Laravel, .NET Blog, Node.js |
| ☁️ Cloud & DevOps | AWS, Cloudflare, Docker, Kubernetes |
| 🛠 Developer Tools | GitHub Releases, JetBrains, Dev.to |
| 🔒 Security | NVD, CVE, KVKK |
| 🌍 Technology News | NewsAPI, DonanımHaber, ShiftDelete.Net |

More sources can easily be added through the modular RSS architecture.
---
## 🏗️ System Architecture

```
                ┌──────────────────────────┐
                │   News APIs / RSS Feeds   │
                │  GitHub • CVE • Dev.to    │
                │  OpenAI • AWS • React     │
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
```
---
## 🛠️ Tech Stack

**Backend**
- FastAPI
- SQLAlchemy
- PostgreSQL
- JWT Authentication
- APScheduler
- Pydantic
- Groq API

**Frontend**
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Recharts
- Framer Motion

**AI**
- Groq Llama 3.3

**Database**
- PostgreSQL

**Version Control**
- Git
- GitHub

---
## 📁 Project Structure

```
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
```
--
## ⚙️ Installation
### Clone the repository

```bash
git clone https://github.com/erendnz1/techpulse-ai.git
cd techpulse-ai```

### Backend
```bash
cd backend
python -m venv .venv
pip install -r requirements.txt
uvicorn app.main:app --reload
```
### Frontend
```bash
cd frontend
npm install
npm run dev
```
The backend will be available at `http://localhost:8000`
The frontend will be available at `http://localhost:3000`
---
## 🔑 Environment Variables

Create a `.env` file inside the `backend` directory:
```env
DATABASE_URL=
SECRET_KEY=
ALGORITHM=
ACCESS_TOKEN_EXPIRE_MINUTES=
NEWS_API_KEY=
GROQ_API_KEY=
```
---
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
---
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

---
## 🤖 AI Analysis
Every collected article is analyzed using Groq AI. The AI automatically generates:
- News Summary
- Category Classification
- Importance Score
- Risk Level
- Affected Technologies
- Recommended Action

This allows users to quickly understand the relevance and potential impact of each software update.
---
## 📸 Screenshots

### 🏠 Landing Page
<img src="screenshots/landing.png" width="100%">

### 📊 Dashboard
<img src="screenshots/dashboard.png" width="100%">

### 📰 News
<img src="screenshots/news.png" width="100%">

### 🚨 Security
<img src="screenshots/security.png" width="100%">

### ⚙️ Preferences
<img src="screenshots/preferences.png" width="100%">

### 📚 Sources
<img src="screenshots/sources.png" width="100%">

---
## 🚀 Future Improvements
- 📧 Email Notifications
- 📱 Mobile Application
- 🔔 Push Notifications
- 🌍 Multi-language Support
- 📄 Export Reports (PDF / Excel)
- 👥 Team Collaboration
- 📈 Advanced Trend Analytics
- 🤖 AI Trend Prediction

---
## 🤝 Contributing
Contributions are welcome! If you have ideas for improvements or new features, feel free to fork the repository and submit a pull request.
---
## 📄 License
This project is licensed under the MIT License.

---
## 👨‍💻 Author

**Eren Deniz**
Computer Engineering

GitHub: [github.com/erendnz1](https://github.com/erendnz1)
--
⭐ If you found this project useful, consider giving it a star.
