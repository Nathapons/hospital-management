package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// DailyRegistration represents a single day's registration count.
type DailyRegistration struct {
	Date  string `json:"date"`
	Count int64  `json:"count"`
}

// GenderStat represents the patient count for a specific gender.
type GenderStat struct {
	Gender string `json:"gender"`
	Count  int64  `json:"count"`
}

// GetDailyRegistrations godoc
// @Summary      Daily patient registrations (last 30 days)
// @Description  Returns a list of dates with the number of patients registered on each day for the past 30 days.
// @Tags         stats
// @Produce      json
// @Success      200  {array}   DailyRegistration
// @Failure      500  {object}  map[string]string
// @Router       /api/stats/registrations [get]
func GetDailyRegistrations(c *gin.Context) {
	data := []DailyRegistration{
		{Date: "2024-03-19", Count: 120},
		{Date: "2024-03-20", Count: 150},
		{Date: "2024-03-21", Count: 80},
		{Date: "2024-03-22", Count: 210},
		{Date: "2024-03-23", Count: 175},
	}

	c.JSON(http.StatusOK, data)
}

// GetGenderStats godoc
// @Summary      Patient gender distribution
// @Description  Returns the count of male and female patients.
// @Tags         stats
// @Produce      json
// @Success      200  {array}   GenderStat
// @Failure      500  {object}  map[string]string
// @Router       /api/stats/gender [get]
func GetGenderStats(c *gin.Context) {
	var results = []GenderStat{
		{Gender: "M", Count: 10},
		{Gender: "F", Count: 20},
	}

	c.JSON(http.StatusOK, results)
}
