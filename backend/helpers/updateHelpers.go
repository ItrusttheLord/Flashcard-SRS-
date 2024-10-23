package helpers

import (
	"backend/models"
	"backend/utils"
	"bytes"
	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"
	"io"
	"net/http"
	"reflect"
)

func UpdateFlashcard(
	w http.ResponseWriter,
	r *http.Request,
	db *gorm.DB,
	validate *validator.Validate,
	itemID string,
	flashcard *models.Flashcard,
) error {
	// Fetch the existing flashcard
	if err := FetchExistingItem(w, db, itemID, flashcard); err != nil {
		return err
	} // Decode the updated item from the request body
	if err := DecodeRequestBody(w, r, flashcard); err != nil {
		return err
	} // Validate the updated flashcard
	if err := validate.Struct(flashcard); err != nil {
		return err
	} //update interval and review date
	nextInterval, nextReviewDate, err := utils.SetInitialIntervalAndUpdateReviewDate(flashcard.DifficultLevel)
	if err != nil {
		return err
	} // Update the flashcard with the new values
	flashcard.Interval = nextInterval
	flashcard.NextReviewDate = nextReviewDate
	// Save the new flashcard to the database
	if err := db.Save(flashcard).Error; err != nil {
		return err
	}
	return nil
}

// generic func  updates an existing item of any type
func UpdateItem[T any](w http.ResponseWriter, r *http.Request, db *gorm.DB, validate *validator.Validate, itemName string, itemID string, existingItem *T) error {
	body, err := io.ReadAll(r.Body) //read the body
	if err != nil {
		return err
	}
	defer r.Body.Close()

	if err := FetchExistingItem(w, db, itemID, existingItem); err != nil {
		return err
	} // reset body so we can re-read it again
	r.Body = io.NopCloser(bytes.NewBuffer(body))
	//decode the elm
	var updateItem T // "T" means it can be any type
	if err := DecodeRequestBody(w, r, &updateItem); err != nil {
		return err
	} // Use reflection to update fields
	vExisting := reflect.ValueOf(existingItem).Elem() // Dereference the pointer
	vUpdate := reflect.ValueOf(updateItem)
	// use a for loop to update all the fields
	for i := 0; i < vUpdate.NumField(); i++ {
		field := vUpdate.Field(i)
		if !field.IsZero() { // Only update non-zero fields
			vExisting.Field(i).Set(field)
		}
	} // Save the updated item
	if err := db.Save(existingItem).Error; err != nil {
		return err
	}
	EncodeJSONResponse(w, existingItem, http.StatusOK)
	return nil
}
