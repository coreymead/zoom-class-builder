# Build stage
FROM golang:1.21-alpine as build

WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Production stage
FROM alpine:latest

WORKDIR /app

# Copy binary from build stage
COPY --from=build /app/main .
COPY --from=build /app/frontend/dist /app/frontend/dist

# Expose port 8080
EXPOSE 8080

# Run the application
CMD ["./main"] 