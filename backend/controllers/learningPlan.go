package controllers

import (
	"backend/config"
	"backend/models"
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
)

var plans []models.LearningPlan
var cardsDB = config.DB

func CreateLearningPlan(w http.ResponseWriter, r *http.Request) {
	var newPlan models.LearningPlan
	if err := json.NewDecoder(r.Body).Decode(&newPlan); err != nil {
		http.Error(w, "Invalid Request Body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()
	if err := cardsDB.Create(&newPlan).Error; err != nil {
		http.Error(w, "Failed to Create New Plan", http.StatusBadRequest)
		return
	}
	EncodeJSONResponse(w, newPlan, http.StatusCreated)
}

func GetLearningPlans(w http.ResponseWriter, r *http.Request) {
	if err := cardsDB.Find(&plans).Error; err != nil {
		http.Error(w, "Failed To retrieve cards", http.StatusInternalServerError)
	}
	EncodeJSONResponse(w, plans, http.StatusOK)
}

func UpdateLearningPlan(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	var updatedPlan models.LearningPlan
	if err := json.NewDecoder(r.Body).Decode(&updatedPlan); err != nil {
		http.Error(w, "Invalid Request Body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()
	var existingPlan models.LearningPlan
	if err := cardsDB.First(&existingPlan, params["id"]).Error; err != nil {
		http.Error(w, "Plan not found", http.StatusNotFound)
		return
	}
	existingPlan.FlashcardID = updatedPlan.FlashcardID
	existingPlan.ReviewDate = updatedPlan.ReviewDate
	existingPlan.CurrentInterval = updatedPlan.CurrentInterval
	existingPlan.DifficultyLevel = updatedPlan.DifficultyLevel
	existingPlan.Rating = updatedPlan.Rating
	existingPlan.Repetitions = updatedPlan.Repetitions
	existingPlan.State = updatedPlan.State
	if err := cardsDB.Save(&existingPlan).Error; err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	EncodeJSONResponse(w, existingPlan, http.StatusAccepted)
}
