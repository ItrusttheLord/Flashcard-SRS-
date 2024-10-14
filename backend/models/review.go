package models

import (
	"gorm.io/gorm"
)

// review for a flashcard.
type Review struct {
	// Contains unique ID, created at, updated at, and deleted at timestamp
	gorm.Model
	// The ID of the associated flashcard (required).
	FlashcardID string `json:"flashcardID" gorm:"not null"`
	// Rating given to the flashcard (1 to 5).
	Rating int `json:"rating" validate:"min=1,max=5"`
	// Optional comments regarding the review (max 500 characters).
	Comment string `json:"comment" validate:"max=500"`
}
