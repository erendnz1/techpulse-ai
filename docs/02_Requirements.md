# TechPulse AI

# Software Requirements Specification (SRS)

## 1. Introduction

### 1.1 Purpose

This document defines the functional and non-functional requirements of TechPulse AI. It serves as a reference for developers, designers, testers, and stakeholders throughout the software development lifecycle.

### 1.2 Scope

TechPulse AI is an AI-powered technology monitoring platform that collects software-related news from trusted sources, summarizes content using artificial intelligence, categorizes updates, evaluates their importance, and sends personalized notifications to users based on their selected interests.

## 2. User Roles

The system consists of the following user roles:

- User
- Administrator

---

## 3. Functional Requirements

### FR-1 User Authentication

### FR-2 User Profile Management

### FR-3 Technology Preferences

### FR-4 News Collection

### FR-5 AI Analysis

### FR-6 Dashboard

### FR-7 Search & Filtering

### FR-8 Notifications

---

## 4. Non-Functional Requirements

### NFR-1 Performance

### NFR-2 Security

### NFR-3 Scalability

### NFR-4 Availability

### NFR-5 Usability


### FR-1 User Authentication

The system shall allow users to:

- Register with a valid email address.
- Log in using email and password.
- Log out securely.
- Reset forgotten passwords.
- Change their password after logging in.

---

### FR-2 User Profile Management

The system shall allow users to:

- Update personal information.
- Select their department.
- Choose technology interests.
- Manage notification preferences.
- View and edit their profile.

---

### FR-3 Technology Preferences

The system shall allow users to:

- Select one or more technology categories.
- Select specific technologies within each category.
- Update preferences at any time.

### FR-4 News Collection

The system shall:

- Collect news automatically from trusted sources.
- Prevent duplicate articles.
- Store collected articles in the database.
- Keep publication date and source information.

### FR-5 AI Analysis

For every collected article, the system shall use artificial intelligence to generate:

- A concise summary.
- Category classification.
- Importance level.
- Risk level.
- Affected technologies.
- Recommended actions.
- Estimated reading time.
- AI-generated tags.

### FR-6 Dashboard

The dashboard shall display:

- Latest news.
- Security vulnerabilities.
- Framework updates.
- AI-generated summaries.
- Personalized recommendations.

### FR-7 Search & Filtering

Users shall be able to:

- Search articles by keyword.
- Filter by technology.
- Filter by category.
- Filter by importance level.
- Filter by publication date.

### FR-8 Notifications

The system shall notify users according to their preferences.

Notification types include:

- Instant notifications.
- Daily summaries.
- Weekly summaries.

Each notification shall include:

- Title
- Summary
- Importance level
- Category
- Source
- Publication date

## 4. Non-Functional Requirements

### NFR-1 Performance

- The system should respond within two seconds.
- AI analysis should complete within thirty seconds after news collection.

---

### NFR-2 Security

- Passwords must be encrypted.
- JWT authentication shall be used.
- HTTPS shall be required in production.

---

### NFR-3 Scalability

- The system shall support future integration of additional news sources.
- The architecture shall allow independent scaling of backend services.

---

### NFR-4 Availability

- The application should be available 24/7.
- Background services should automatically recover after failures.

---

### NFR-5 Usability

- The user interface shall be simple and responsive.
- The application shall support desktop and mobile browsers.

## 5. Business Rules

- Each user shall receive notifications only for selected technologies.
- Duplicate news articles shall not be stored.
- AI analysis shall be performed only once for each article.
- Users may update their interests at any time.
- News older than one year may be archived.

## 6. Acceptance Criteria

The project will be considered successful if:

- Users can register and log in successfully.
- News is collected automatically.
- AI generates summaries correctly.
- Personalized notifications are delivered.
- Dashboard displays collected articles.
- Search and filtering work correctly.