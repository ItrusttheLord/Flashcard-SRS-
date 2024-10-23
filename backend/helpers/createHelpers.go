package helpers

import (
	"backend/models"
	"backend/utils"
	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"
	"net/http"
)

func CreateFlashcard(
	w http.ResponseWriter,
	r *http.Request,
	db *gorm.DB,
	validate *validator.Validate,
	flashcard *models.Flashcard,
) (interface{}, error) {
	// Decode request body into the flashcard struct
	if err := DecodeRequestBody(w, r, flashcard); err != nil {
		return nil, err
	}
	defer r.Body.Close() // Close body after reading it
	// Validate the flashcard after decoding
	if err := validate.Struct(flashcard); err != nil {
		return nil, err
	} // Set initial intvl and next rev date based on the difficulty level
	nextInterval, nextReviewDate, err := utils.SetInitialIntervalAndUpdateReviewDate(flashcard.DifficultLevel)
	if err != nil {
		return nil, err
	} // Update the flashcard with the new values
	flashcard.Interval = nextInterval
	flashcard.NextReviewDate = nextReviewDate
	// Save the new flashcard to the database
	if err := db.Create(flashcard).Error; err != nil {
		return nil, err
	}
	return flashcard, nil // Return the created flashcard
}
