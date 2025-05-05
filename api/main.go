package main

import (
	"log"
	"net/http"
	"os"

	"github.com/coreymead/zoom-class-builder/api/handlers"
	"github.com/gorilla/mux"
)

func main() {
	router := mux.NewRouter()

	// API routes
	router.HandleFunc("/api/courses", handlers.GetCourses).Methods("GET")
	router.HandleFunc("/api/courses/{id}", handlers.GetCourse).Methods("GET")
	router.HandleFunc("/api/courses", handlers.CreateCourse).Methods("POST")
	router.HandleFunc("/api/courses/{id}", handlers.UpdateCourse).Methods("PUT")
	router.HandleFunc("/api/courses/{id}", handlers.DeleteCourse).Methods("DELETE")

	// Serve static files from the frontend build directory
	router.PathPrefix("/").Handler(http.FileServer(http.Dir("../frontend/dist")))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}

// Placeholder handlers - we'll implement these in separate files
func getCourses(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusNotImplemented)
}

func getCourse(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusNotImplemented)
}

func createCourse(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusNotImplemented)
}

func updateCourse(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusNotImplemented)
}

func deleteCourse(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusNotImplemented)
} 