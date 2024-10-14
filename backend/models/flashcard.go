package models

import (
	"gorm.io/gorm"
	"time"
)

type Flashcard struct {
	gorm.Model               //this incluedes ID,CreatedAt,UpdatedAt
	Question       string    `json:"question" validate:"required,min=1,max=255"` //validate them to make sure they are not empty
	Answer         string    `json:"answer" validate:"required,min=1,max=255"`
	DifficultLevel string    `json:"difficultLevel" validate:"oneof=easy medium hard"`
	NextReviewDate time.Time `json:"nextReviewDate"`
	Interval       int       `json:"interval" validate:"gte=0"`
}
