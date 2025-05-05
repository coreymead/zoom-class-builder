# Zoom Class Builder API

This is the backend API for the Zoom Class Builder application. It provides endpoints for managing courses and integrating with Zoom and LMS systems.

## Features

- Course management (CRUD operations)
- Zoom meeting integration (planned)
- LMS integration (planned)

## Setup

1. Install Go (version 1.16 or later)
2. Clone the repository
3. Install dependencies:
   ```bash
   go mod tidy
   ```
4. Run the server:
   ```bash
   go run main.go
   ```

## API Endpoints

### Courses

- `GET /api/courses` - Get all courses
- `GET /api/courses/{id}` - Get a specific course
- `POST /api/courses` - Create a new course
- `PUT /api/courses/{id}` - Update a course
- `DELETE /api/courses/{id}` - Delete a course

## Development

The API is built using:
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