package routes

import (
	"backend/controllers"
	"github.com/gorilla/mux"
)

var GetRoutes = func(router *mux.Router) {
	// routes for the flashcards
	router.HandleFunc("/flashcards", controllers.GetAllCards).Methods("GET")
	router.HandleFunc("/flashcards/{id}", controllers.GetCardByID).Methods("GET")
	router.HandleFunc("/flashcards", controllers.CreateCard).Methods("POST")
	router.HandleFunc("/flashcards/{id}", controllers.UpdateCard).Methods("PUT")
	router.HandleFunc("/flashcards/{id}", controllers.DeleteCard).Methods("DELETE")

	// routes for the learning plan
	router.HandleFunc("/flashcards//learning-plan", controllers.CreateLearningPlan).Methods("POST")
	router.HandleFunc("/flashcards/learning-plan", controllers.GetLearningPlans).Methods("GET")
	router.HandleFunc("/flashcards/learning-plan/{id}", controllers.UpdateLearningPlan).Methods("PUT")
	router.HandleFunc("/flashcards/learning-plan/{id}", controllers.DeleteLearningPlan).Methods("DELETE")

	// Routes for get Reviews
	router.HandleFunc("/flashcards/reviews", controllers.GetReviews).Methods("GET")
	router.HandleFunc("/flashcards/reviews", controllers.CreateReview).Methods("POST")
	router.HandleFunc("/flashcards/reviews/{id}", controllers.GetReviewByID).Methods("GET")
	router.HandleFunc("/flashcards/reviews/{id}", controllers.UpdateReview).Methods("PUT")
	router.HandleFunc("/flashcards/reviews/{id}", controllers.DeleteReview).Methods("DELETE")
}
