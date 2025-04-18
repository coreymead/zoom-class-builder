# Zoom Class Builder

A React application for managing courses, allowing users to create, update, view, and delete classes/courses. The application also manages users within courses with different roles.

## Features

- View a list of all courses
- Create new courses
- View detailed information about each course
- Edit course details
- Delete courses
- Add users to courses with specific roles (student, teacher, TA, admin)
- Update user roles
- Remove users from courses

## Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page components for different routes
│   ├── services/        # Service layer for data operations
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Main application component with routing
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## Setup

1. Make sure you have Node.js installed (version 14.x or later recommended)
2. Install dependencies:

```sh
cd frontend
npm install
# or
yarn
```

3. Start the development server:

```sh
npm run dev
# or
yarn dev
```

4. The application will be available at http://localhost:5173

## Technologies Used

- React 18
- TypeScript
- React Router for navigation
- Vite for build tooling and development server

## Data Model

- **Course**: Represents a class with properties like id, name, description, and a list of users
- **User**: Represents a participant in a course with properties like id, name, and role
- **UserRole**: Can be 'student', 'teacher', 'TA', or 'admin'

## Note

This is a frontend-only application with mock data stored in memory. In a real application, you would connect this to a backend API. 