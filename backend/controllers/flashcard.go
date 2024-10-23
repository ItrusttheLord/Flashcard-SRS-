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
	var newCard models.Flashcard //res,req,ptr->DB,->val,->newCard
	createdItem, err := helpers.CreateFlashcard(w, r, config.DB, Validate, &newCard)
	if err != nil {
		return
	}
	helpers.EncodeJSONResponse(w, createdItem, http.StatusCreated)
}

func GetAllCards(w http.ResponseWriter, r *http.Request) {
	var flashcards []models.Flashcard
	// Retrieve cards,reviews and learningPlans if any from DB
	if err := config.DB.Preload("Reviews").Preload("LearningPlan").Find(&flashcards).Error; err != nil {
		return
	}
	helpers.EncodeJSONResponse(w, flashcards, http.StatusOK)
}

func GetCardByID(w http.ResponseWriter, r *http.Request) {
	var foundCard models.Flashcard // res,req,ptr->DB,->foundCard
	if err := helpers.GetItemByIDHelper(w, r, config.DB, &foundCard); err != nil {
		return
	}
}

func DeleteCard(w http.ResponseWriter, r *http.Request) {
	var deleteCard models.Flashcard
	if err := helpers.DeleteItemHelper(w, r, config.DB, &deleteCard); err != nil {
		return
	}
}

func UpdateCard(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r) //get id from url
	var existingCard models.Flashcard
	if err := helpers.UpdateFlashcard(w, r, config.DB, Validate, params["id"], &existingCard); err != nil {
		return
	}
}
