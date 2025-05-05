package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/coreymead/zoom-class-builder/api/models"
	"github.com/gorilla/mux"
)

// In-memory store for courses (replace with database later)
var courses = make(map[string]models.Course)

// GetCourses returns all courses
func GetCourses(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(courses)
}

// GetCourse returns a specific course by ID
func GetCourse(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	course, exists := courses[params["id"]]
	if !exists {
		w.WriteHeader(http.StatusNotFound)
		return
	}
	json.NewEncoder(w).Encode(course)
}

// CreateCourse creates a new course
func CreateCourse(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var course models.Course
	if err := json.NewDecoder(r.Body).Decode(&course); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// Generate a simple ID (replace with UUID later)
	course.ID = time.Now().Format("20060102150405")
	course.CreatedAt = time.Now()
	course.UpdatedAt = time.Now()

	courses[course.ID] = course
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(course)
}

// UpdateCourse updates an existing course
func UpdateCourse(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	
	// Check if course exists
	existingCourse, exists := courses[params["id"]]
	if !exists {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	var course models.Course
	if err := json.NewDecoder(r.Body).Decode(&course); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// Preserve the ID and timestamps
	course.ID = existingCourse.ID
	course.CreatedAt = existingCourse.CreatedAt
	course.UpdatedAt = time.Now()

	courses[course.ID] = course
	json.NewEncoder(w).Encode(course)
}

// DeleteCourse deletes a course
func DeleteCourse(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	
	if _, exists := courses[params["id"]]; !exists {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	delete(courses, params["id"])
	w.WriteHeader(http.StatusNoContent)
} 