package utils

import (
	"backend/config"
	"backend/models"
	"errors"
	"fmt"
	fsrs "github.com/open-spaced-repetition/go-fsrs/v3"
	"time"
)

const (
	Easy   = 2.6
	Medium = 2.5
	Hard   = 2.3
)

// calculates next review based on the current date and interval in days.
func CalculateNextReviewDate(currDate time.Time, interval int) time.Time {
	return currDate.AddDate(0, 0, interval)
}

// ///////// initializes the FSRS parameters for scheduling. (GoDoc)
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

// helper func for ^UpdateInterval//creates and schedules a card
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
		card.Difficulty = Easy
	case "medium":
		card.Difficulty = Medium
	case "hard":
		card.Difficulty = Hard
	}

	parameters := InitializeParameters()
	scheduler := parameters.NewBasicScheduler(card, now)
	schedulingInfo := scheduler.Review(fsrs.Rating(rating))

	return schedulingInfo, nil
}

// ////////////////////////////////////////////

// retrieves learning plans for a specific flashcard and date.
func GetLearningPlan(id uint, date time.Time) ([]models.LearningPlan, error) {
	var plans []models.LearningPlan
	var flashcard models.Flashcard
	// Check if the flashcard exists
	if err := config.DB.First(&flashcard, id).Error; err != nil {
		return nil, errors.New("flashcard doesn't exist")
	}
	// Format date to "MM-DD-YYYY"
	truncatedDate := date.Format("10-15-2024")
	// Query for learning plans based on flashcard ID and the exact date (ignoring the time)
	if err := config.DB.Where("flashcard_id = ? AND DATE(review_date) = ?", flashcard.ID, truncatedDate).Find(&plans).Error; err != nil {
		return nil, errors.New("error querying plans")
	}
	// If no plans are found, return an empty slice instead of an error
	if len(plans) == 0 {
		return plans, nil // Return an empty slice
	}
	return plans, nil
}
