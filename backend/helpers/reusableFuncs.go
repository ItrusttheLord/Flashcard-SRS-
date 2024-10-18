package helpers

import (
	"backend/models"
	"backend/utils"
	"encoding/json"
	"log"
	"net/http"
	"reflect"
	"time"
)

// ////////////////// Helper func to encode JSON response
func EncodeJSONResponse(w http.ResponseWriter, data interface{}, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(data)
}

// ///// helper func to set the next review date
func setNextReviewDate(item interface{}, learningPlan []models.LearningPlan) {
	// Check if learningPlan is empty
	if len(learningPlan) == 0 {
		return
	}
	// Use reflection to access fields
	itemValue := reflect.ValueOf(item).Elem()
	// Get the rating
	ratingField := itemValue.FieldByName("Rating")
	if !ratingField.IsValid() || ratingField.Kind() != reflect.Int {
		return
	}
	rating := ratingField.Int()
	// Calculate the next interval && check for err
	nextInterval, err := utils.UpdateInterval("medium", int(rating), int(learningPlan[0].CurrentInterval))
	if err != nil {
		return
	}
	// Calculate the next review date
	nextReviewDate := utils.CalculateNextReviewDate(time.Now(), nextInterval)
	// Set the next review date in the item
	nextReviewField := itemValue.FieldByName("NextReviewDate")
	if nextReviewField.IsValid() && nextReviewField.CanSet() && nextReviewField.Kind() == reflect.Struct {
		nextReviewField.Set(reflect.ValueOf(nextReviewDate))
	} else {
		log.Println("Item does not have a valid NextReviewDate field or cannot be set")
	}
}
