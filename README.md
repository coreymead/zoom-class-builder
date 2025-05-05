# Zoom Class Builder

A full-stack application for managing Zoom meetings and courses, with integration capabilities for Learning Management Systems (LMS).

## Features

- Course management with CRUD operations
- Zoom meeting integration (planned)
- LMS integration (planned)
- Modern React frontend with Material-UI
- Go backend API
- Docker containerization

## Project Structure

```
.
├── api/                 # Go backend API
│   ├── handlers/       # HTTP request handlers
│   ├── models/         # Data models
│   └── main.go         # Application entry point
├── frontend/           # React frontend
│   ├── src/           # Source code
│   ├── public/        # Static files
│   └── package.json   # Frontend dependencies
├── docker-compose.yml  # Docker orchestration
└── README.md          # Project documentation
```

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local frontend development)
- Go 1.21+ (for local backend development)

## Getting Started

### Using Docker (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/coreymead/zoom-class-builder.git
   cd zoom-class-builder
   ```

2. Build and start the containers:
   ```bash
   docker-compose up --build
   ```

3. Access the application:
   - Frontend: http://localhost
   - API: http://localhost:8080/api

### Local Development

#### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

#### Backend

1. Navigate to the API directory:
   ```bash
   cd api
   ```

2. Install dependencies:
   ```bash
   go mod tidy
   ```

3. Start the server:
   ```bash
   go run main.go
   ```

## API Documentation

### Courses

- `GET /api/courses` - Get all courses
- `GET /api/courses/{id}` - Get a specific course
- `POST /api/courses` - Create a new course
- `PUT /api/courses/{id}` - Update a course
- `DELETE /api/courses/{id}` - Delete a course

## Development

### Frontend
- React with TypeScript
- Material-UI for components
- React Router for navigation
- Vite for building

### Backend
- Go
- Gorilla Mux for routing
- Standard library for HTTP handling

## Future Improvements

- Add database integration
- Implement Zoom API integration
- Add LMS integration
- Add authentication and authorization
- Add input validation
- Add proper error handling
- Add logging
- Add testing

## License

MIT License 