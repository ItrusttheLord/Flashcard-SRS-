package models

import (
	"gorm.io/gorm"
	"time"
)

type Flashcard struct {
	gorm.Model //this incluedes ID,CreatedAt,UpdatedAt
	//validate them to make sure they are not empty
	Question       string    `json:"question" validate:"required,min=1,max=255"`
	Answer         string    `json:"answer" validate:"required,min=1,max=255"`
	DifficultLevel string    `json:"difficult" validate:"oneof=Easy Medium Hard"`
	NextReviewDate time.Time `json:"nextReviewDate"`
	Interval       int       `json:"interval" validate:"gte=0"`
}
