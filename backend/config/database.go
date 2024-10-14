package config

import (
	"backend/models"
	"log"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB //stores DB connection

func ConnectDatabase() {
	db, err := gorm.Open(sqlite.Open("gorm.db"), &gorm.Config{}) //open conn
	if err != nil {
		log.Fatal(err)
	}
	DB = db //store the conn
	DB.AutoMigrate(&models.Flashcard{}, &models.Review{})
}
