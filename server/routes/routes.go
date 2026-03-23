package routes

import (
	"hospital-management/server/handlers"

	"github.com/gin-gonic/gin"
)

// RegisterRoutes attaches all application routes to the given Gin engine.
func RegisterRoutes(r *gin.Engine) {
	r.POST("/api/login", handlers.Login)

	patient := r.Group("/api/patient")
	{
		patient.GET("/", handlers.Patients)
		patient.GET("/:id", handlers.SearchPatient)
		patient.POST("/", handlers.CreatePatient)
	}

	stats := r.Group("/api/stats")
	{
		stats.GET("/registrations", handlers.GetDailyRegistrations)
		stats.GET("/gender", handlers.GetGenderStats)
	}
}
