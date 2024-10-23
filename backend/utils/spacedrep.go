package utils

import (
	"errors"
	"time"
)

const (
	EasyInitialInterval   = 7
	MediumInitialInterval = 3
	HardInitialInterval   = 1
	EasyDifficulty        = 1.0
	MediumDifficulty      = 2.0
	HardDifficulty        = 3.0
)

// calculates next review based on the current date and interval in days.
func CalculateNextReviewDate(currDate time.Time, interval int) time.Time {
	return currDate.UTC().AddDate(0, 0, interval)
}

func SetInitialIntervalAndDifficulty(difficultyLevel string) (int, float64) {
	switch difficultyLevel {
	case "Easy":
		return EasyInitialInterval, EasyDifficulty
	case "Medium":
		return MediumInitialInterval, MediumDifficulty
	case "Hard":
		return HardInitialInterval, HardDifficulty
	default:
		return EasyInitialInterval, EasyDifficulty
	}
}

// sets the initial interval and calculates the next review date
func SetInitialIntervalAndUpdateReviewDate(difficultyLevel string) (int, time.Time, error) {
	// Get the initial interval based on difficulty
	interval, _ := SetInitialIntervalAndDifficulty(difficultyLevel)
	// Ensure interval is calculated based on difficulty level
	if interval == 0 {
		return 0, time.Time{}, errors.New("interval is 0, invalid difficulty level")
	}
	// Calculate the next review date based on the curr time and interval
	nextReviewDate := CalculateNextReviewDate(time.Now(), interval)
	return interval, nextReviewDate, nil
}
