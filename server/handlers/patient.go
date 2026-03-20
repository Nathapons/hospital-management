package handlers

import (
	"net/http"

	"hospital-management/server/database"
	"hospital-management/server/models"

	"github.com/gin-gonic/gin"
)

// Patients godoc
// @Summary      List all patients
// @Description  Retrieve a list of all patient records stored in the database.
// @Tags         patient
// @Accept       json
// @Produce      json
// @Success      200  {array}   models.Patient
// @Failure      500  {object}  map[string]string  "Internal server error"
// @Router       /api/patient/ [get]
func Patients(c *gin.Context) {
	var patients []models.Patient

	result := database.DB.Find(&patients)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to fetch patients",
		})
		return
	}

	c.JSON(http.StatusOK, patients)
}

// SearchPatient godoc
// @Summary      Search patient by national ID or passport ID
// @Description  Search patient by national ID or passport ID
// @Tags         patients
// @Accept       json
// @Produce      json
// @Param        id   path      string  true  "Patient ID"
// @Success      200  {object}  models.Patient
// @Failure      404  {object}  map[string]string  "Patient not found"
// @Router       /api/patient/{id} [get]
func SearchPatient(c *gin.Context) {
	id := c.Param("id")

	var patient models.Patient
	result := database.DB.
		Where("national_id = ? OR passport_id = ?", id, id).
		First(&patient)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "patient not found",
		})
		return
	}

	c.JSON(http.StatusOK, patient)
}

// CreatePatient godoc
// @Summary      Create a new patient
// @Description  Create a new patient
// @Tags         patients
// @Accept       json
// @Produce      json
// @Param        patient  body      models.Patient  true  "Patient data"
// @Success      201      {object}  models.Patient
// @Failure      400      {object}  map[string]string  "Invalid request body"
// @Failure      500      {object}  map[string]string  "Internal server error"
// @Router       /api/patient/ [post]
func CreatePatient(c *gin.Context) {
	var patient models.Patient
	if err := c.ShouldBindJSON(&patient); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid request body",
		})
		return
	}

	result := database.DB.Create(&patient)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to create patient",
		})
		return
	}

	c.JSON(http.StatusCreated, patient)
}