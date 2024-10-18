package helpers

import (
	"backend/models"
	"backend/utils"
	"bytes"
	"encoding/json"
	"errors"
	"io"
	"log"
	"net/http"
	"reflect"
	"strconv"
	"time"

	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"
)

// resp,r->req,db->DB,val->Valid,itemID,item{}
func UpdateItemWithLearningPlan(
	w http.ResponseWriter,
	r *http.Request,
	db *gorm.DB,
	validate *validator.Validate,
	itemID string,
	item interface{},
) error {
	// Check if item is a pointer to a struct
	if reflect.ValueOf(item).Kind() != reflect.Ptr || reflect.ValueOf(item).Elem().Kind() != reflect.Struct {
		return errors.New("item must be a pointer to a struct")
	}
	// Parse itemID using helper func and check for err
	flashcardID, err := parseItemID(itemID)
	if err != nil {
		return err
	}
	// Fetch existing item by ID before decoding the new update further
	if err := db.First(item, flashcardID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("item not found")
		}
		return errors.New("error retreiving item: " + err.Error())
	}
	// Decode the updated item from the request body
	if err := json.NewDecoder(r.Body).Decode(item); err != nil {
		return errors.New("invalid request body: " + err.Error())
	}
	// Validate the item
	if err := validate.Struct(item); err != nil {
		return errors.New("validation error: " + err.Error())
	}
	// Fetch Learning Plan for the flashcard
	learningPlans, err := utils.GetLearningPlan(uint(flashcardID), time.Now())
	if err != nil {
		return errors.New("failed fetching learning plans: " + err.Error())
	}
	// Process the first learning plan if available
	if len(learningPlans) > 0 {
		setNextReviewDate(item, []models.LearningPlan{learningPlans[0]})
	}
	// Save the updated item if no err
	if err := db.Save(item).Error; err != nil {
		return errors.New("failed to update item: " + err.Error())
	}
	return nil
}

// final update generic func
func UpdateItem[T any](w http.ResponseWriter, r *http.Request, db *gorm.DB, validate *validator.Validate, params map[string]string, itemName string, itemID string, existingItem *T) error {
	body, err := io.ReadAll(r.Body) //read the body
	if err != nil {
		return errors.New("failed to read body: " + err.Error())
	}
	defer r.Body.Close() //close body after reading
	// Fetch the existing item
	if err := FetchExistingItem(w, db, itemID, existingItem); err != nil {
		return err
	}
	// reset body so we can re-read it again
	r.Body = io.NopCloser(bytes.NewBuffer(body))
	//decode the elm
	var updateItem T // "T" means it can be any type (str,int etc..)
	if err := DecodeRequestBody(w, r, &updateItem); err != nil {
		return err
	}
	// Use reflection to update fields
	vExisting := reflect.ValueOf(existingItem).Elem() // Dereference the pointer
	vUpdate := reflect.ValueOf(updateItem)

	for i := 0; i < vUpdate.NumField(); i++ {
		field := vUpdate.Field(i)
		if !field.IsZero() { // Only update non-zero fields
			vExisting.Field(i).Set(field)
		}
	}
	// Save the updated item
	if err := db.Save(existingItem).Error; err != nil {
		return err
	}
	EncodeJSONResponse(w, existingItem, http.StatusOK)
	return nil
}

// convert  itemID from string to uint
func parseItemID(itemID string) (uint64, error) {
	flashcardID, err := strconv.ParseUint(itemID, 10, 32)
	if err != nil {
		return 0, errors.New("invalid Flashcard ID")
	}
	return flashcardID, nil
}

// fetches an existing item by ID from the database.
func FetchExistingItem(w http.ResponseWriter, db *gorm.DB, id string, item interface{}) error {
	//find matchin
	if err := db.First(item, id).Error; err != nil {
		http.Error(w, "Item not found or error retrieving item", http.StatusInternalServerError)
		log.Printf("Error retrieving item: %v", err)
		return err
	}
	return nil
}

func DecodeRequestBody(w http.ResponseWriter, r *http.Request, item interface{}) error {
	if err := json.NewDecoder(r.Body).Decode(item); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		log.Printf("Invalid request body: %v", err)
		return err
	}
	return nil
}
