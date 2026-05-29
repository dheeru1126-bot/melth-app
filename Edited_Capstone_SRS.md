SOFTWARE REQUIREMENTS SPECIFICATION
Mental Health Support Portal

Field	Detail
Document Version	2.0 (Updated with AI Chatbot & CBT Tools)
Standard	IEEE 830-1998
Date	March 2026
Project	Mental Health Support Portal (Melth)
Target Platform	Web Application (General Public)
Diagrams Added	Section 2.7 (Architecture) · Section 6.4 (Use Case) · Section 6.5 (ER Diagram)
Status	Final — Capstone Submission

This document is prepared in accordance with IEEE Std 830-1998.

1. Introduction
1.1 Purpose
This Software Requirements Specification (SRS) document defines the complete functional and non-functional requirements for the Mental Health Support Portal, a web-based application designed to support mental well-being monitoring, provide guided Cognitive Behavioral Therapy (CBT) exercises, and offer empathetic conversational support via an AI Assistant for the general public. This document is intended for use by the project development team, academic evaluators, and any future stakeholders involved in system implementation, testing, or maintenance. It serves as the authoritative reference for system design decisions and acceptance criteria throughout the software development lifecycle.

1.2 Scope
The Mental Health Support Portal is a web-based platform that enables any member of the general public to monitor their mental health through structured self-assessment tools, track emotional patterns over time, access curated self-help resources, and interact with a highly empathetic, Woebot-inspired AI companion. The system integrates OpenAI's robust language models, constrained by CBT principles, to generate personalized conversational support and early risk alerts.

The system WILL:
•	Allow users to log daily mood, stress levels, and emotional states on an interactive visual scale
•	Engage users via a safe, CBT-informed AI Chatbot capable of cognitive restructuring and behavioral activation
•	Provide a dedicated interactive hub for structured CBT exercises (e.g., Box Breathing, Thought Records, Grounding)
•	Provide access to curated self-help resources including relaxation techniques, motivational content, and wellness tips
•	Apply AI-based contextual analysis to detect crisis keywords (e.g. self-harm) and immediately intervene with emergency lifeline numbers (988)

The system will NOT:
•	Provide any form of clinical or medical diagnosis
•	Replace licensed mental health professionals or formal therapeutic treatment
•	Handle emergency psychiatric crisis intervention directly (beyond offering external helplines)
•	Store or process data for insurance or third-party medical purposes

1.3 Definitions, Acronyms, and Abbreviations
Term	Definition
SRS	Software Requirements Specification
LLM	Large Language Model — advanced AI algorithms (e.g., OpenAI default models) used for conversational generation
CBT	Cognitive Behavioral Therapy — psycho-social intervention focusing on challenging cognitive distortions
Risk Alert	A system-generated notification or chat redirection triggered when a user's input matches crisis keywords
Self-Help Resource	Curated non-clinical content including breathing exercises, motivational articles, and wellness tips
JWT	JSON Web Token — used for stateless authentication between the React frontend and Flask backend
GDPR	General Data Protection Regulation — international data privacy standard
WCAG 2.1	Web Content Accessibility Guidelines v2.1 — web accessibility standard
API	Application Programming Interface
HTTPS	Hypertext Transfer Protocol Secure — encrypted web communication protocol
AES-256	Advanced Encryption Standard with 256-bit key — used for data-at-rest encryption
OWASP	Open Web Application Security Project — web security standards body
SQLAlchemy	Object Relational Mapper (ORM) used in Python/Flask to interact with the SQLite database

1.4 Overview
The remainder of this SRS is organized as follows: Section 2 describes the product context, features, user classes, constraints, assumptions, and system architecture diagram. Section 3 specifies all functional requirements (FR-01–FR-30). Section 4 defines non-functional requirements. Section 5 details all external interface requirements. Section 6 presents the system models including use case catalogue, UML use case diagram, and ER diagram. Section 7 contains the full glossary and references.

2. Overall Description
2.1 Product Perspective
The Mental Health Support Portal is a new, self-contained web-based system developed as a standalone application. It does not replace or integrate with any existing hospital management system or electronic health record (EHR) platform. The system is positioned within a broader mental health technology ecosystem as a preventive and awareness-focused tool — sitting between informal self-help and formal clinical services, filling the gap by offering structured self-monitoring, continuous AI-driven conversational companionship, and active guided CBT exercises within a single, highly accessible platform.

2.2 Product Features
Feature ID	Feature Name	Brief Description
F-01	User Registration & Authentication	Secure account creation, login, and profile management
F-02	Daily Mood & Stress Logging	Structured daily self-assessment entry via interactive UI
F-03	Emotional Trend Dashboard	Visual charts and history of logged mood data with AI-generated trend insights
F-04	AI CBT Chatbot Companion	Empathetic, real-time conversational agent enforcing CBT principles via OpenAI
F-05	Interactive CBT Exercises Hub	Guided web tools for Box Breathing, Thought Recording, Grounding, and Gratitude
F-06	Chat Crisis Detection System	Automated keyword scanning in AI chat that redirects high-risk input to the 988 Lifeline
F-07	Self-Help Resource Library	Categorized repository of relaxation, motivational, and wellness content
F-08	Admin Content Management	Admin interface for resources and platform oversight
F-09	Confidentiality & Privacy Controls	Data encryption, local SQLite database storage, clinical disclaimers

2.3 User Classes and Characteristics
2.3.1 General Public User (Primary)
Any individual aged 18 or above from the general public who registers on the portal to monitor their mental well-being. Assumed to have basic technical proficiency. Expected to log mood daily or interact with the AI assistant. Key concern: privacy and confidentiality of personal emotional data.
2.3.2 System Administrator (Secondary)
A designated portal administrator responsible for maintaining platform content and overseeing system operations. Can add, edit, and remove self-help resources and monitor anonymized usage statistics. Has no access to individual users' personal chats or mood entries.

2.4 Operating Environment
Component	Specification
Frontend	React.js SPA with Tailwind CSS — any modern browser (Chrome, Firefox, Edge, Safari)
Backend	Python 3 with Flask RESTful API
Database	SQLite (local database.db) with SQLAlchemy ORM
AI Engine	OpenAI API (gpt-3.5 or equivalent) restricted by heavy CBT prompt engineering
Hosting	Cloud platform (AWS / Heroku / Render)
Connectivity	Internet connection required for all core functions

2.5 Design and Implementation Constraints
ID	Constraint
C-01	The system must not perform, imply, or store any form of clinical medical diagnosis
C-02	All user PII and Chat logs must be stored encrypted at rest, compliant with GDPR
C-03	The AI companion must operate purely under strict internal prompt constraints (no unrestricted LLM generation allowed)
C-04	The system must function entirely within a web browser with no client-side installation required
C-05	All AI chatbot instances must display a permanent, mandatory clinical safety disclaimer before initialization
C-06	Development must be completed within a single academic semester by a small team or individual

2.6 Assumptions and Dependencies
Assumptions:
•	A-01: Users provide honest and accurate inputs; the system cannot verify self-reported data
•	A-02: Users are assumed to be 18 years of age or older; no parental consent mechanism is included
•	A-03: Users have reliable internet access and a compatible modern web browser

Dependencies:
•	D-01: Conversational AI capabilities depend on external OpenAI API availability
•	D-02: System deployment depends on cloud hosting environment availability

2.7 System Architecture
The Mental Health Support Portal follows a modern client-server architecture. The Client Layer consists of a React.js Single Page Application (SPA) that communicates with the Server Layer via a RESTful HTTPS API. The Server Layer is built on Python via Flask and contains all business logic, authentication middleware, and API endpoints. The Python backend communicates directly with the OpenAI API for LLM chatbot generation, acting as an intermediary to securely enforce CBT prompt guidelines. The Data Layer utilizes SQLite through SQLAlchemy ORM for lightweight, secure, persistent relational storage. 

All layers communicate exclusively over HTTPS (TLS 1.2+). User data and chat history are explicitly scoped individually per user and never cross-pollinated into the broader AI model.

3. Functional Requirements
3.1 User Authentication and Account Management
FR-01 — User Registration
The system shall allow any member of the general public to create an account by providing a unique email address, password, and full name. The system shall validate email format and enforce minimum password complexity. 

FR-02 — User Login and Logout
The system shall authenticate registered users via email and password using JSON Web Tokens (JWT). The system shall provide a secure logout function that terminates the active session on the client side immediately.

FR-03 — User Profile Management
The system shall allow authenticated users to view their basic profile details. Users may request account deletion, triggering removal of their SQLite relational records.

3.2 Mood and Stress Logging
FR-04 — Daily Mood Log Entry
The system shall allow authenticated users to submit mood log entries. Each entry shall capture: Mood state (Happy, Neutral, Sad, Anxious, Angry) and an optional free-text note. 

FR-05 — Mood Log History Access
The system shall allow users to view their historical mood entries on a dedicated dashboard, mapping their qualitative moods to quantitative scores for visualization.

3.3 Emotional Trend Dashboard
FR-06 — Trend Visualization
The system shall display an interactive dashboard presenting the user's mood scores as continuous Line/Area charts over recent log periods.

FR-07 — Summary Statistics & AI Insights
The system shall compute and display an average "Wellness Score" and an active "Melth Insight" bar that analyzes the user's recent mood logs to identify streaks and provide personalized guidance labels.

3.4 AI Chatbot and Crisis Management
FR-08 — AI Conversational Interaction
The system shall provide an interactive Chat interface styled with soft, premium UI elements. The user inputs text, and the system queries the internal AI Service via Flask.

FR-09 — CBT-Restricted AI Generation
The backend AI Service shall append strict Cognitive Behavioral Therapy parameters to all OpenAI requests, guaranteeing that the AI responds empathetically, never provides medical advice, and prompts users with actionable reframing or grounding techniques.

FR-10 — Real-Time Crisis Detection
Before sending user input to the AI model, the system must scan the message locally using regex keywords (e.g., suicide, self-harm, end it). If detected, the system immediately returns a predefined safety response providing the 988 Crisis Lifeline, overriding AI generation.

FR-11 — Pre-Chat Disclaimer
The system shall force the user to acknowledge a clinical safety disclaimer modal explicitly stating "Melth is an AI companion, not a licensed therapist" before activating the chat interface.

3.5 Guided CBT Exercises
FR-12 — Box Breathing Module
The system shall provide an interactive Box Breathing module utilizing CSS animations to guide the user visually through 4-second inhalation, optimal hold, and exhalation cycles.

FR-13 — Thought Record Journal
The system shall provide a structured input form guiding users to challenge cognitive distortions by mapping: The Situation, Automatic Thoughts, and Rational Counter-Statements.

FR-14 — Grounding Method (5-4-3-2-1)
The system shall display an interactive checklist driving users through the 5-4-3-2-1 sensory grounding technique for acute anxiety mitigation.

FR-15 — Gratitude Entry
The system shall allow users to log positive daily reflections in a private Gratitude Journal interface.

3.6 Self-Help Resource Library
FR-16 — Resource Library Access
The system shall provide access to categorized self-help resources covering sub-topics like Work Stress and Sleep Meditation. 

4. Non-Functional Requirements
4.1 Performance Requirements
ID	Requirement	Target
NFR-01	Standard page load time	≤ 3 seconds
NFR-02	AI Chat response generation	≤ 5 seconds (dependent on OpenAI)
NFR-03	Database read/write (SQLite)	≤ 1 second

4.2 Security Requirements
ID	Requirement
NFR-04	All client-server communication encrypted using TLS 1.2 or higher (HTTPS).
NFR-05	Passwords hashed using bcrypt via Flask-Bcrypt. No plaintext storage.
NFR-06	Sessions authorized via JWT tokens passed as Bearer Headers.
NFR-07	OpenAI API keys securely stored in local environment variables (.env); never exposed to the React frontend.
NFR-08	SQL injection prevented via SQLAlchemy ORM parameterization.

4.3 Usability Requirements
ID	Requirement
NFR-09	Responsive design supporting desktop, tablet, and mobile viewports seamlessly.
NFR-10	Aesthetic consistency: Soft pastel color palettes, large border radii, prominent drop-shadows matching a "premium clinical" aesthetic.
NFR-11	WCAG 2.1 Level AA color contrast compatibility for all text on pastel backgrounds.

4.4 Reliability and Availability Requirements
ID	Requirement
NFR-12	Target system uptime: 99.5%. 
NFR-13	If OpenAI API connection fails, the chatbot must gracefully revert to a pre-defined rule-based CBT fallback response without crashing.

5. External Interface Requirements
5.1 User Interface Requirements
ID	Requirement
UIR-01	Built with React.js as SPA; styling via Tailwind CSS and native CSS3 for exercise animations.
UIR-02	Persistent top navigation with links to standard protected routes (Dashboard, Exercises, AI Support, Resources).
UIR-03	Consistent smooth micro-animations applied via Lucide icons and Tailwind `animate-in` transitions.

5.2 Software Interface Requirements
ID	Requirement
SIR-01	Frontend: React.js SPA (Vite build). Compatible with modern Chrome, Firefox, Edge.
SIR-02	Backend: Python 3 with Flask HTTP REST API.
SIR-03	Database: SQLite local file (database.db) using SQLAlchemy integration.
SIR-04	External AI Integration: OpenAI REST API utilizing `gpt-3.5-turbo` or equivalent configured endpoint.

5.3 Communication Interface Requirements
ID	Requirement
CIR-01	React frontend communicates with Flask backend strictly via Axios/JSON over port-based mapping or proxies.
CIR-02	All API datasets exchanged as application/json envelopes.
CIR-03	CORS restricted via Flask-CORS to whitelist only the local or matched production React origin.

6. System Models
6.1 Actors
Actor ID	Actor	Type	Description
A-01	General User	Primary	Registered member using the portal for active web-based mental well-being support
A-02	System Administrator	Primary	Designated admin maintaining general application health
A-03	OpenAI Platform	External	Cloud-based LLM engine returning empathetic dialogue
A-04	Crisis Algorithm	Internal	Local regex service intervening during critical danger inputs

6.2 Selected Use Case Descriptions
UC-01 — Interact with AI CBT Chatbot
Actor(s)	General User, OpenAI Platform, Crisis Algorithm
Preconditions	User has registered, logged in, and agreed to the clinical disclaimer modal
Main Flow	User types a message detailing emotional distress. The system intercepts the message and passes it to the Crisis Algorithm. Finding no high-risk flags, the system appends the hidden CBT system prompt and forwards the payload to OpenAI. OpenAI generates an empathetic, CBT-focused response safely. The React UI renders the response inside a rounded chat bubble.
Alternate Flow	The Crisis Algorithm flags terms like "end it". The system ceases the OpenAI request immediately, overriding the generation to return the 988 Suicide & Crisis Lifeline contact info instead.

7. Appendix
7.1 Glossary (Selected Key Terms)
Term	Definition
CBT	Cognitive Behavioral Therapy — psycho-social intervention.
Flask	Lightweight Python framework managing REST operations.
JWT	JSON Web Token — stateless auth standard.
OpenAI	Major AI provider utilized for the Chatbot functionality.
ORM	Object-Relational Mapping (e.g. SQLAlchemy) to secure DB interactions.
SQLite	Serverless SQL engine managing the local structured relational databases.
Tailwind CSS	Utility-first CSS framework enabling the highly customized, rounded, pastel Woebot-inspired aesthetic logic of the portal.

Prepared in accordance with IEEE Std 830-1998 | Status: Final Capstone Edit | March 2026
