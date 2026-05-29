# Melth Platform Architecture & Codebase Guide

This document provides a comprehensive overview of the Melth mental health platform's codebase. It explains the core functions, important links (routes and endpoints), how each component works, and how the frontend and backend are interconnected.

## Table of Contents
1. [System Overview](#system-overview)
2. [Frontend Architecture (React + Vite)](#frontend-architecture)
3. [Backend Architecture (Flask)](#backend-architecture)
4. [Data Flow & Interconnectivity](#data-flow--interconnectivity)

---

## 1. System Overview
Melth is a full-stack mental health support application consisting of:
- **Frontend**: A React SPA (Single Page Application) built with Vite, styled with TailwindCSS, and using React Router for navigation.
- **Backend**: A Python Flask RESTful API that handles authentication, database operations (via SQLAlchemy), and AI integrations.
- **Database**: SQL-based database accessed through SQLAlchemy ORM.
- **AI Core**: Google Gemini integration coupled with multi-layered prompt engineering (Triage, Empathy, CBT).

---

## 2. Frontend Architecture
**Directory**: `mental-health-portal/src/`

The frontend is responsible for the user interface, state management, and interacting with the backend APIs.

### Important Links (Routes)
Defined in `App.jsx`, the frontend routes map directly to components:
- **Public Routes:**
  - `/` -> `Home.jsx`: The landing page.
  - `/login` & `/signup` -> `Login.jsx` / `Signup.jsx`: User authentication pages.
  - `/about`, `/emergency`, `/resources` -> Informational pages accessible without login.
- **Protected Routes:** (Wrapped in `ProtectedRoute` component to enforce authentication)
  - `/dashboard` -> `Dashboard.jsx`: Main user overview.
  - `/mood-tracker` -> `MoodTracker.jsx`: Component to log and view mood history.
  - `/ai-support` -> `Chatbot.jsx`: The conversational interface for AI therapy/support.
  - `/journal`, `/counseling`, `/exercises` -> Core feature pages.

### Key Functions & Services
1. **`services/api.js`**
   - **How it works**: Uses Axios to create a global API client. It configures the `baseURL` to point to the backend.
   - **Interconnection**: It contains an **Axios Interceptor** that automatically attaches the JWT token (stored in `localStorage`) to the `Authorization` header of every outgoing request. If the backend returns a `401 Unauthorized` response, it automatically logs the user out and redirects them to `/login`.
   - **Functions**: `login()`, `register()`, `saveMood()`, `chatWithAI()`, etc.

2. **`context/AuthContext.jsx`**
   - **How it works**: Manages the global authentication state of the application. It provides `user` state and boolean `isAuthenticated`.
   - **Functions**: `login(token, userData)` and `logout()`. It stores the JWT in the browser's `localStorage` so the user stays logged in across refreshes.

3. **`components/ProtectedRoute/ProtectedRoute.jsx`**
   - **How it works**: A wrapper component that checks `AuthContext`. If `isAuthenticated` is false, it intercepts the routing and redirects the user to `/login`.

---

## 3. Backend Architecture
**Directory**: `backend/`

The backend is a RESTful API built with Flask, using Blueprints to modularize the routes.

### Important Links (API Endpoints)
Registered in `app/__init__.py` using Flask Blueprints:
- **Auth (`/api/auth`)**: Handled by `app/routes/auth.py`
  - `POST /login`: Authenticates a user and returns a JWT token.
  - `POST /register`: Creates a new user in the DB.
- **Chat (`/api/chat`)**: Handled by `app/routes/chat.py`
  - `POST /chat`: Receives user messages, validates the JWT, and communicates with the AI service.
- **Mood (`/api/mood`)**: Handled by `app/routes/mood.py`
  - `POST /mood`: Saves a daily mood log.
  - `GET /moods`: Retrieves the mood history for the authenticated user.
- **Other Modules**: `/api/resources`, `/api/exercises`, `/api/appointments`, `/api/journal`.

### Key Functions & Services
1. **`run.py`**
   - **How it works**: The entry point of the backend. It calls `create_app()` to initialize the server, runs `db.create_all()` to ensure database tables exist, and creates a default admin user on startup.

2. **`app/__init__.py` (Application Factory)**
   - **How it works**: Centralizes the configuration. It initializes all Flask extensions: `SQLAlchemy` (Database), `flask_jwt_extended` (Auth), `flask_bcrypt` (Password Hashing), `CORS` (Cross-Origin Resource Sharing), and `Flask-Limiter` (Rate Limiting).

3. **`app/models/` (Database Schema)**
   - Contains SQLAlchemy models (`User`, `Mood`, `Chat`, etc.).
   - **Interconnection**: These models map directly to SQL tables and are imported by the routes to query and save data.

4. **`app/services/ai_service.py`**
   - **How it works**: The central engine for the platform's AI capabilities.
   - **Functions**: It receives user text from the `chat_bp` route and sends it to the configured LLM (Google Gemini). It applies multi-layered system prompts (checking for crisis/triage, applying empathetic responses, and utilizing Cognitive Behavioral Therapy patterns).

---

## 4. Data Flow & Interconnectivity

To understand how all these pieces fit together, here is the step-by-step lifecycle of a core feature: **Using the AI Chatbot**.

1. **User Interaction (Frontend)**: The user types a message in the `Chatbot.jsx` interface on the frontend and hits send.
2. **API Call (Frontend)**: `Chatbot.jsx` calls `chatWithAI({ message: "..." })` from `api.js`.
3. **Request Interception**: The Axios interceptor in `api.js` grabs the JWT token from `localStorage` and attaches it to the HTTP header (`Authorization: Bearer <token>`).
4. **Backend Routing**: The request hits the Flask server. `app/__init__.py` routes the `/api/chat` request to the `chat_bp` Blueprint in `app/routes/chat.py`.
5. **Authentication & Processing (Backend)**:
   - The route uses `@jwt_required()` to ensure the token is valid.
   - It extracts the `user_id` from the token.
   - It calls `ai_service.py` and passes the user's message.
6. **AI Generation (Backend Service)**: `ai_service.py` processes the prompt, queries the Gemini LLM, structures the response with empathy/CBT principles, and returns the response string.
7. **Database Storage**: `chat.py` saves both the user's message and the AI's response to the database using the `Chat` model.
8. **Response to Client**: The backend sends a 200 OK JSON response containing the AI's reply back to the frontend.
9. **UI Update**: `Chatbot.jsx` receives the API response and updates the React state to display the AI's message in the chat window.

This identical decoupled architecture (React Component -> Axios Service -> Flask Route -> Database/Service) is utilized for Authentication, Mood Tracking, Journaling, and all other features in the Melth platform.
