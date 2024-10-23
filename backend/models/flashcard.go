package models

import (
	"gorm.io/gorm"
	"time"
)

type Flashcard struct {
	gorm.Model
	Question       string         `json:"question" validate:"required,min=1,max=255"`
	Answer         string         `json:"answer" validate:"required,min=1,max=255"`
	DifficultLevel string         `json:"difficult" validate:"oneof=Easy Medium Hard"`
	NextReviewDate time.Time      `json:"nextReviewDate"`
	Interval       int            `json:"interval" validate:"gte=0"`
	Rating         int            `json:"rating" validate:"min=1,max=5"`
	Reviews        []Review       `json:"reviews" gorm:"foreignKey:FlashcardID"`
	LearningPlan   []LearningPlan `json:"learning_plan" gorm:"foreignKey:FlashcardID"`
}
