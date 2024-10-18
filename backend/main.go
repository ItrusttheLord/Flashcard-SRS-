package main

import (
	"backend/config"
	"backend/middleware"
	"backend/models"
	"backend/routes"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

func main() {
	// Initialize the database connection
	config.ConnectDB()

	// Check if there are any flashcards in the table, and seed data if none exist	if err := seedFlashcards(config.DB); err != nil {
	if err := seedFlashcards(config.DB); err != nil {
		log.Fatalf("Failed to seed flashcards: %v", err)
	}

	router := mux.NewRouter()
	routes.GetRoutes(router)
	log.Println("Server is running on port 8000...")
	if err := http.ListenAndServe(":8000", middleware.NewLogger(router)); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

// Function to seed the flashcards table
func seedFlashcards(db *gorm.DB) error {
	var flashcards []models.Flashcard
	if err := db.Find(&flashcards).Error; err != nil {
		return err
	}

	if len(flashcards) > 0 {
		log.Println("Flashcards already exist, skipping seeding.")
		return nil
	}

	// Add your seed data here
	flashcards = []models.Flashcard{
		{Question: "What is the capital of France?", Answer: "Paris", DifficultLevel: "easy"},
		{Question: "What is 2 + 2?", Answer: "4", DifficultLevel: "easy"},
		// Add more flashcards as needed
	}

	// Seed the data
	for _, card := range flashcards {
		if err := db.Create(&card).Error; err != nil {
			log.Printf("Failed to seed flashcard: %v", err)
			return err
		}
	}

	log.Println("Flashcards seeded successfully.")
	return nil
}
