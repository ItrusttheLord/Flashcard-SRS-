package models

import (
	"gorm.io/gorm"
	"time"
)

// review for a flashcard.
type Review struct {
	// Contains unique ID, created at, updated at, and deleted at timestamp
	gorm.Model
	FlashcardID    string    `json:"flashcardID" gorm:"not null"`
	Rating         int       `json:"rating" validate:"min=1,max=5"`
	Comment        string    `json:"comment" validate:"max=500"`
	NextReviewDate time.Time `json:"nextReviewDate"`
}
