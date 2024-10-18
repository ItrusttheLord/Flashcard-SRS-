package helpers

import (
	"backend/utils"
	"encoding/json"
	"errors"
	"net/http"
	"reflect"
	"time"

	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"
)

// creates a new item and updates the learning plan. response,  ptr->request, ptr->DB, ptr->Validator, item{}->card||plan||review
// Returns the item{} and an error
func CreateItemWithLearningPlan(
	w http.ResponseWriter,
	r *http.Request,
	db *gorm.DB,
	validate *validator.Validate,
	item interface{},
) (interface{}, error) {
	// Check if the item is a pointer to a struct
	if reflect.ValueOf(item).Kind() != reflect.Ptr || reflect.ValueOf(item).Elem().Kind() != reflect.Struct {
		return nil, errors.New("item must be a pointer to a struct")
	}
	// Decode request body into the item struct
	if err := json.NewDecoder(r.Body).Decode(item); err != nil {
		return nil, errors.New("invalid request body")
	}
	defer r.Body.Close() //close body after reading it

	// Validate the item after decoding
	if err := validate.Struct(item); err != nil {
		return nil, errors.New("validation failed: " + err.Error())
	}
	// Save the new item to the database
	if err := db.Create(item).Error; err != nil {
		http.Error(w, "error creating item", http.StatusInternalServerError)
		return nil, err
	}
	// After creating item now id has a valid ID, so fetch the learning plan
	flashcardID := reflect.ValueOf(item).Elem().FieldByName("ID").Uint()
	learningPlan, err := utils.GetLearningPlan(uint(flashcardID), time.Now())
	if err != nil {
		return nil, errors.New("failed to fetch learning plan: " + err.Error())
	}
	// Set the next review date using the func from reusableHelpers.go
	setNextReviewDate(item, learningPlan)
	return item, nil // Return the created item
}
