package controllers

import (
	"backend/config"
	"backend/helpers"
	"backend/models"
	"github.com/gorilla/mux"
	"net/http"
)

func CreateReview(w http.ResponseWriter, r *http.Request) {
	var createReview models.Review
	if _, err := helpers.CreateItemWithLearningPlan(w, r, config.DB, Validate, &createReview); err != nil {
		return
	}
	helpers.EncodeJSONResponse(w, createReview, http.StatusCreated)
}

func GetReviews(w http.ResponseWriter, r *http.Request) {
	var reviews []models.Review
	if err := config.DB.Find(&reviews).Error; err != nil {
		http.Error(w, "Error retreiving cards", http.StatusInternalServerError)
		return
	}
	helpers.EncodeJSONResponse(w, reviews, http.StatusOK)
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
	if err := helpers.UpdateItem(w, r, config.DB, Validate, params, "review", params["id"], &existingReview); err != nil {
		return
	}
}
