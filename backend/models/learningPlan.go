package models

import (
	"gorm.io/gorm"
	"time"
)

type LearningPlan struct {
	gorm.Model
	FlashcardID     uint      `json:"flashcard_id" gorm:"not null"`
	CurrentInterval int       `json:"current_interval"`
	DifficultyLevel string    `json:"difficulty_level"`
	Rating          int       `json:"rating"`
	Repetitions     int       `json:"repetitions"`
	State           string    `json:"state"`
	ReviewDate      time.Time `json:"review_date"`
}
