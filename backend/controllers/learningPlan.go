package controllers

import (
	"backend/config"
	"backend/helpers"
	"backend/models"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

func CreateLearningPlan(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	flashcardIDStr := vars["flashcardId"]
	flashcardID, err := strconv.ParseUint(flashcardIDStr, 10, 32)
	if err != nil {
		return
	}
	var plan models.LearningPlan
	if err := helpers.DecodeRequestBody(w, r, &plan); err != nil {
		return
	}
	defer r.Body.Close()
	plan.FlashcardID = uint(flashcardID)
	if err := config.DB.Create(&plan).Error; err != nil {
		return
	}
	helpers.EncodeJSONResponse(w, plan, http.StatusCreated)
}

func GetPlanByID(w http.ResponseWriter, r *http.Request) {
	var foundPlan models.LearningPlan
	if err := helpers.GetItemByIDHelper(w, r, config.DB, &foundPlan); err != nil {
		return
	}
}

func DeleteLearningPlan(w http.ResponseWriter, r *http.Request) {
	var deletePlan models.LearningPlan
	if err := helpers.DeleteItemHelper(w, r, config.DB, &deletePlan); err != nil {
		return
	}
}

func UpdateLearningPlan(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	var existingPlan models.LearningPlan
	if err := helpers.UpdateItem(w, r, config.DB, Validate, "learningPlan", params["id"], &existingPlan); err != nil {
		return
	}
}
