package controllers

import (
	"backend/config"
	"backend/models"
	"encoding/json"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/gorilla/mux"
)

var flashcards []models.Flashcard
var db = config.DB
var validate = validator.New()

// Helper func to encode JSON response
func encodeJSONResponse(w http.ResponseWriter, data interface{}, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(data)
}

func GetAllCards(w http.ResponseWriter, r *http.Request) {
	//retrieve cards from database and check for errors
	if err := db.Find(&flashcards).Error; err != nil {
		http.Error(w, "Error retreiving cards", http.StatusInternalServerError)
		return
	}
	encodeJSONResponse(w, flashcards, http.StatusOK) // Encode/return cards
}

func GetCardByID(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r) //get id from the URL
	var foundCard models.Flashcard
	//no need a for loop since you can retrive the card from db
	if err := db.First(&foundCard, params["id"]).Error; err != nil {
		http.Error(w, "Flashcard not found", http.StatusNotFound)
		return
	}
	encodeJSONResponse(w, foundCard, http.StatusOK) // Return card
}

func CreateCard(w http.ResponseWriter, r *http.Request) {
	var newCard models.Flashcard
	// decode body and check for errors
	if err := json.NewDecoder(r.Body).Decode(&newCard); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close() // close body after reading it
	// validate data
	if err := validate.Struct(newCard); err != nil {
		http.Error(w, "Validation failed: "+err.Error(), http.StatusBadRequest)
		return
	} // create card and check for errors
	if err := db.Create(&newCard).Error; err != nil {
		http.Error(w, "Failed to create card", http.StatusInternalServerError)
		return
	}
	encodeJSONResponse(w, newCard, http.StatusCreated)
}

func DeleteCard(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	var foundCard models.Flashcard
	// check if id's match
	if err := db.First(&foundCard, params["id"]).Error; err != nil {
		http.Error(w, "Flashcard not found", http.StatusNotFound)
		return
	} // delete card if there are no errors
	if err := db.Delete(&foundCard).Error; err != nil {
		http.Error(w, "Failed to delete flashcard", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func UpdateCard(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	var updatedCard models.Flashcard
	if err := json.NewDecoder(r.Body).Decode(&updatedCard); err != nil {
		http.Error(w, "Invalid request Body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()
	// validate
	if err := validate.Struct(updatedCard); err != nil {
		http.Error(w, "Validation Failed: "+err.Error(), http.StatusBadRequest)
		return
	}
	// Find the existing card
	var existingCard models.Flashcard
	if err := db.First(&existingCard, params["id"]).Error; err != nil {
		http.Error(w, "Flashcard not found", http.StatusNotFound)
		return
	}
	// Update fields of the existing card
	existingCard.Question = updatedCard.Question
	existingCard.Answer = updatedCard.Answer
	existingCard.DifficultLevel = updatedCard.DifficultLevel
	existingCard.NextReviewDate = updatedCard.NextReviewDate
	existingCard.Interval = updatedCard.Interval
	// save update card
	if err := db.Save(&existingCard).Error; err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	encodeJSONResponse(w, existingCard, http.StatusOK)
}
