# TodoAllDay
GoalTracker was the internal project name during development

**GoalTracker** is a personal goal and task tracking web application. It helps you manage your daily, weekly, monthly, and yearly goals all from a centralized dashboard.

TodoAllDay was built to solve a personal need for a centralized productivity dashboard that could manage both short-term tasks and long-term goals. Along the way, it evolved into a full-stack application showcasing frontend architecture, REST API development, authentication, recurring task scheduling, state management, database design, deployment, and production maintenance.

One of the most technically interesting aspects of the application is its custom recurring task engine. Rather than storing every future occurrence in the database, recurring tasks are generated virtually and only persisted when modified by the user.

The app is built using a **React frontend**, **Django backend**, and a **PostgreSQL database**, with a Python virtual environment used to manage backend dependencies cleanly. 

TodoAllDay is publicly deployed at todoallday.com, with the React frontend hosted on Vercel and the Django backend and PostgreSQL database hosted on Render. 

Visitors can explore the application using the built-in demo account without creating their own profile, try it here! [todoallday.com] (https://todoallday.com) Please do give Render at least 30 seconds spin up after the first login attempt 

## Highlights

- Calendar-based task management
- Goal tracking with due dates
- Powerful recurring task engine
- Individual recurring task editing
- Secure authentication
- Responsive design
- Live demo available

## Tech Stack

Frontend
- React
- Vite
- Material UI
- Tailwind CSS

Backend
- Django
- Django REST Framework

Database
- PostgreSQL

Deployment
- Vercel
- Render

Authentication
- JWT

## Screenshots

### Dashboard and Home page
<img width="512" height="281" alt="Screenshot 2026-07-11 at 2 36 22 PM" src="https://github.com/user-attachments/assets/71165fc9-5d89-48dd-b27d-c387394a03c7" />

### Click expandable to-do list, recurring tasks, and goals
<img width="512" height="281" alt="Screenshot 2026-07-11 at 2 37 04 PM" src="https://github.com/user-attachments/assets/5e344d33-27de-48df-b8f7-edebe7fcb57f" />

### Creation modal for recurring tasks
<img width="512" height="281" alt="Screenshot 2026-07-11 at 2 37 32 PM" src="https://github.com/user-attachments/assets/86cb62fc-2a79-4f0b-a7e5-75effb70f279" />

## Features

- Track your tasks from a monthly calendar style view
- Visually mark tasks complete as they are accomplished
- Goal management with due dates
- Recurring task creation set for dates of your choosing
- One-time task creation
- Daily task list
- Authentication
- Responsive design
- A Demo account for public use and testing
- Dark theme

## Architecture

TodoAllDay follows a React frontend + Django REST backend architecture.

The frontend manages application state using Context and Reducers while communicating with the backend through a REST API.

Recurring tasks are generated virtually rather than pre-populating the database with every occurrence. Individual occurrences become persistent Task Instances only when modified by the user, significantly reducing storage requirements while still allowing per-instance edits and completion tracking.

## Techincal Challenges

- Recurring Task Architecture

One of the largest engineering challenges was designing the recurring tasks.

Instead of storing every future occurrence in the database, recurring tasks generate virtual instances on demand. Only edited or completed occurrences are persisted as Task Instances, allowing the application to efficiently support years of recurring tasks without unnecessary database growth.
  
- Handling edits to individual recurring occurrences

A key design challenge involved determining how individual recurring occurrences should behave after being modified.

The final decision was to create a system that in which when a virtual task is interacted with or edited by the user, it is made real. This means that it then stands alone from the related virtual tasks of its parents situated throughout the rest of the to-do list. 
  
- Production deployment, CORS, CSRF, migrations, and environment variables


  
- Safari-specific scrolling behavior

Safari handles overscroll behavior differently than Chromium-based browsers, which resulted in noticeable scrolling stutter when reaching the top or bottom of the page. The issue was resolved by implementing appropriate CSS overscroll behavior while preserving the experience across browsers.

---

## Getting Started

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Python 3](https://www.python.org/)
- [pip](https://pip.pypa.io/en/stable/)
- [Virtualenv](https://virtualenv.pypa.io/en/latest/)

---

### 1. Clone the repository

git clone https://github.com/yourusername/GoalTracker.git
cd GoalTracker

### 2. Set up the Python environment (backend)
cd backend
python -m venv venv

source venv/bin/activate  # macOS/Linux
venv\Scripts\activate    # Windows

pip install -r requirements.txt  # Install backend dependencies
python manage.py runserver


### 3. Set up React frontend

cd frontend
npm install
npm run dev

## Future Improvements

- Further polish on UI with the addition of transition animations
- A more detailed and intutive tracking of goals


