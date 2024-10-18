package controllers

import (
	"backend/config"
	"backend/helpers"
	"backend/models"
	"github.com/gorilla/mux"
	"net/http"
)

func CreateLearningPlan(w http.ResponseWriter, r *http.Request) {
	var newLearningPlan models.LearningPlan
	if _, err := helpers.CreateItemWithLearningPlan(w, r, config.DB, Validate, &newLearningPlan); err != nil {
		return
	}
	helpers.EncodeJSONResponse(w, newLearningPlan, http.StatusCreated)
}

func GetLearningPlans(w http.ResponseWriter, r *http.Request) {
	var plans []models.LearningPlan
	if err := config.DB.Find(&plans).Error; err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	helpers.EncodeJSONResponse(w, plans, http.StatusOK)
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
	if err := helpers.UpdateItem(w, r, config.DB, Validate, params, "learningPlan", params["id"], &existingPlan); err != nil {
		return
	}
}
