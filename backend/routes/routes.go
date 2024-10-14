package routes

import (
	"backend/controllers"
	"github.com/gorilla/mux"
)

var GetRoutes = func(router *mux.Router) {
	router.HandleFunc("/flashcards", controllers.GetAllCards).Methods("GET")
	router.HandleFunc("/flashcards/{id}", controllers.GetCardByID).Methods("GET")
	router.HandleFunc("/flashcards", controllers.CreateCard).Methods("POST")
	router.HandleFunc("/flashcards/{id}", controllers.UpdateCard).Methods("PUT")
	router.HandleFunc("/flashcards/{id}", controllers.DeleteCard).Methods("DELETE")
}
