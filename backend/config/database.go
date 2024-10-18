package config

import (
	"backend/models"
	"log"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB //stores DB connection

func ConnectDB() {
	var err error
	db, err := gorm.Open(sqlite.Open("gorm.db"), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to the database: %v", err)
	}

	// Ping the database to ensure it's reachable
	sqlDB, err := db.DB()
	if err != nil {
		log.Fatalf("Could not get database object: %v", err)
	}
	if err = sqlDB.Ping(); err != nil {
		log.Fatalf("Could not ping the database: %v", err)
	}

	// Auto-migrate models
	DB = db
	if err := DB.AutoMigrate(&models.Flashcard{}, &models.Review{}, &models.LearningPlan{}); err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	log.Println("Database connected and migrated successfully")
}
