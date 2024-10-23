package routes

import (
	"backend/controllers"

	"github.com/gorilla/mux"
)

var GetRoutes = func(router *mux.Router) {
	// Routes for the flashcards
	router.HandleFunc("/flashcards", controllers.GetAllCards).Methods("GET")
	router.HandleFunc("/flashcards/{id}", controllers.GetCardByID).Methods("GET")
	router.HandleFunc("/flashcards", controllers.CreateCard).Methods("POST")
	router.HandleFunc("/flashcards/{id}", controllers.UpdateCard).Methods("PUT")
	router.HandleFunc("/flashcards/{id}", controllers.DeleteCard).Methods("DELETE")

	// Routes for the learning plan (associated with a specific flashcard)
	router.HandleFunc("/flashcards/{flashcardId}/learning-plans", controllers.CreateLearningPlan).Methods("POST")
	router.HandleFunc("/flashcards/learning-plans/{id}", controllers.GetPlanByID).Methods("GET")
	router.HandleFunc("/flashcards/learning-plans/{id}", controllers.UpdateLearningPlan).Methods("PUT")
	router.HandleFunc("/flashcards/learning-plans/{id}", controllers.DeleteLearningPlan).Methods("DELETE")

	// Routes for reviews (associated with a specific flashcard)
	router.HandleFunc("/flashcards/{flashcardId}/reviews", controllers.CreateReview).Methods("POST")
	router.HandleFunc("/flashcards/reviews/{id}", controllers.GetReviewByID).Methods("GET")
	router.HandleFunc("/flashcards/reviews/{id}", controllers.UpdateReview).Methods("PUT")
	router.HandleFunc("/flashcards/reviews/{id}", controllers.DeleteReview).Methods("DELETE")
}
