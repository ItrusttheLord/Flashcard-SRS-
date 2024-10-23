package controllers

import (
	"backend/config"
	"backend/helpers"
	"backend/models"
	"github.com/gorilla/mux"
	"net/http"
	"strconv"
)

// creates a new review for a specific flashcard
func CreateReview(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	flashcardIDStr := vars["flashcardId"] // Get flashcard ID from the route
	flashcardID, err := strconv.ParseUint(flashcardIDStr, 10, 32)
	if err != nil {
		return
	}
	var review models.Review
	if err := helpers.DecodeRequestBody(w, r, &review); err != nil {
		return
	}
	defer r.Body.Close()
	// Ensure the review is tied to the correct flashcard
	review.FlashcardID = uint(flashcardID)
	// create review and chech for errors
	if err := config.DB.Create(&review).Error; err != nil {
		return
	}
	helpers.EncodeJSONResponse(w, review, http.StatusCreated)
}

func GetReviewByID(w http.ResponseWriter, r *http.Request) {
	var foundReview models.Review
	if err := helpers.GetItemByIDHelper(w, r, config.DB, &foundReview); err != nil {
		return
	}
}

func DeleteReview(w http.ResponseWriter, r *http.Request) {
	var deleteReview models.Review
	if err := helpers.DeleteItemHelper(w, r, config.DB, &deleteReview); err != nil {
		return
	}
}

func UpdateReview(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	var existingReview models.Review
	if err := helpers.UpdateItem(w, r, config.DB, Validate, "review", params["id"], &existingReview); err != nil {
		return
	}
}
