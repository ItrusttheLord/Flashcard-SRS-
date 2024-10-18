package models

import "time"

type LearningPlan struct {
	FlashcardID     uint      `json:"flashcard_id"`
	ReviewDate      time.Time `json:"review_date"`
	CurrentInterval int       `json:"current_interval"`
	DifficultyLevel string    `json:"difficulty_level"`
	Rating          int       `json:"rating"`
	Repetitions     int       `json:"repetitions"`
	State           string    `json:"state"`
}
