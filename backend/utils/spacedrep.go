package utils

import (
	"backend/config"
	"backend/models"
	"encoding/json"
	"errors"
	"fmt"
	fsrs "github.com/open-spaced-repetition/go-fsrs/v3"
	"net/http"
	"time"
)

func CalculateNextReviewDate(currDate time.Time, interval int) time.Time {
	return currDate.AddDate(0, 0, interval)
}

// ///////////////////////////////////////////// got this from goDoc
func InitializeParameters() fsrs.Parameters {
	parameters := fsrs.Parameters{
		RequestRetention: 0.9,
		MaximumInterval:  365,
		W:                fsrs.Weights{},
		Decay:            0.1,
		Factor:           1.5,
		EnableShortTerm:  true,
		EnableFuzz:       false,
	}
	return parameters
}

func UpdateInterval(difficultyLevel string, rating, interval int) (int, error) {
	// Validate the inputs
	if difficultyLevel != "easy" && difficultyLevel != "medium" && difficultyLevel != "hard" {
		return 0, errors.New("please enter a valid difficulty level (easy, medium, or hard)")
	}
	if rating < 1 || rating > 5 {
		return 0, errors.New("make sure to enter a valid rating between 1-5")
	}
	if interval < 0 {
		return 0, errors.New("the interval cannot be a negative value")
	}

	schedulingInfo, err := createAndScheduleCard(difficultyLevel, interval, rating)
	if err != nil {
		return 0, err
	}
	// Calculate due date and next interval
	dueDate := schedulingInfo.Card.Due
	currentTime := time.Now()
	if dueDate.After(currentTime) { //convert to days
		nextInterval := int(dueDate.Sub(currentTime).Hours() / 24)
		return nextInterval, nil
	} else {
		return 0, fmt.Errorf("the review date is in the past")
	}
}

// helper func for ^UpdateInterval
func createAndScheduleCard(difficultyLevel string, interval int, rating int) (fsrs.SchedulingInfo, error) {
	now := time.Now() // from GoDoc
	card := fsrs.Card{
		Due:           now.AddDate(0, 0, interval),
		Stability:     0.0,
		Difficulty:    0.0,
		ElapsedDays:   0,
		ScheduledDays: uint64(interval),
		Reps:          1,
		Lapses:        0,
		State:         fsrs.New,
		LastReview:    now,
	}

	switch difficultyLevel {
	case "easy":
		card.Difficulty = 2.6 // For easy
	case "medium":
		card.Difficulty = 2.5 // For medium
	case "hard":
		card.Difficulty = 2.3 // For hard
	}

	parameters := InitializeParameters()
	scheduler := parameters.NewBasicScheduler(card, now)
	schedulingInfo := scheduler.Review(fsrs.Rating(rating))

	return schedulingInfo, nil
}

// ////////////////////////////////////////////
var db = config.DB
var flashcards []models.Flashcard

func GetLearningPlan() []models.Flashcard {}
