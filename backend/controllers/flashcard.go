package controllers

import (
	"backend/config"
	"backend/helpers"
	"backend/models"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/gorilla/mux"
)

// (USING THis VARIABLE BELOW IN THE review and learningPlan)
var Validate = validator.New()

func CreateCard(w http.ResponseWriter, r *http.Request) {
	var newCard models.Flashcard
	if _, err := helpers.CreateItemWithLearningPlan(w, r, config.DB, Validate, &newCard); err != nil {
		return
	}
	// enocode the json response
	helpers.EncodeJSONResponse(w, newCard, http.StatusCreated)
}

func GetAllCards(w http.ResponseWriter, r *http.Request) {
	var flashcards []models.Flashcard
	//retrieve cards from database and check for errors
	if err := config.DB.Find(&flashcards).Error; err != nil {
		http.Error(w, "Error retreiving cards", http.StatusInternalServerError)
		return
	}
	helpers.EncodeJSONResponse(w, flashcards, http.StatusOK)
}

func GetCardByID(w http.ResponseWriter, r *http.Request) {
	var foundCard models.Flashcard // call the hlpr func and check for err
	if err := helpers.GetItemByIDHelper(w, r, config.DB, &foundCard); err != nil {
		return
	}
}

func DeleteCard(w http.ResponseWriter, r *http.Request) {
	var deleteCard models.Flashcard // call hlper func and check for err
	if err := helpers.DeleteItemHelper(w, r, config.DB, &deleteCard); err != nil {
		return
	}
}

func UpdateCard(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	var existingCard models.Flashcard
	if err := helpers.UpdateItem(w, r, config.DB, Validate, params, "flashcard", params["id"], &existingCard); err != nil {
		return
	}
}
