package database

import (
	"fmt"
	"log"
	"os"

	"hospital-management/server/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

// ConnectDB opens a PostgreSQL connection using the DATABASE_URL environment variable
// and runs AutoMigrate on the Patient model.
func ConnectDB() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatal("DATABASE_URL environment variable is not set")
	}

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	fmt.Println("✅  Database connection established")

	if err := DB.AutoMigrate(&models.Patient{}); err != nil {
		log.Fatalf("AutoMigrate failed: %v", err)
	}

	fmt.Println("✅  AutoMigrate completed")
}
