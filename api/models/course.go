package models

import (
	"time"
)

// Course represents a course in the system
type Course struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	StartDate   time.Time `json:"startDate"`
	EndDate     time.Time `json:"endDate"`
	ZoomMeeting *ZoomMeeting `json:"zoomMeeting,omitempty"`
	LMSInfo     *LMSInfo     `json:"lmsInfo,omitempty"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// ZoomMeeting contains Zoom-specific meeting information
type ZoomMeeting struct {
	MeetingID    string    `json:"meetingId"`
	JoinURL      string    `json:"joinUrl"`
	StartTime    time.Time `json:"startTime"`
	Duration     int       `json:"duration"` // in minutes
	Topic        string    `json:"topic"`
	Password     string    `json:"password,omitempty"`
	Settings     ZoomSettings `json:"settings"`
}

// ZoomSettings contains Zoom meeting settings
type ZoomSettings struct {
	HostVideo        bool `json:"hostVideo"`
	ParticipantVideo bool `json:"participantVideo"`
	JoinBeforeHost   bool `json:"joinBeforeHost"`
	MuteUponEntry    bool `json:"muteUponEntry"`
	WaitingRoom      bool `json:"waitingRoom"`
}

// LMSInfo contains LMS-specific course information
type LMSInfo struct {
	LMSID        string `json:"lmsId"`
	CourseCode   string `json:"courseCode"`
	Section      string `json:"section"`
	Term         string `json:"term"`
	InstructorID string `json:"instructorId"`
} 