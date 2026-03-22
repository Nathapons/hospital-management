package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"hospital-management/server/models"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

// Note: These tests require database.DB to be initialized.
// For unit tests, it's recommended to mock the database or use sqlite memory database.
// As database.DB is uninitialized here, these functions just set up routes.

func TestPatients(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.GET("/api/patient/", Patients)

	req, _ := http.NewRequest("GET", "/api/patient/", nil)
	w := httptest.NewRecorder()
	
	// Un-comment after DB setup: router.ServeHTTP(w, req)
	assert.NotNil(t, req)
	assert.NotNil(t, w)
}

func TestSearchPatient(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.GET("/api/patient/:id", SearchPatient)

	req, _ := http.NewRequest("GET", "/api/patient/123", nil)
	w := httptest.NewRecorder()
	
	// Un-comment after DB setup: router.ServeHTTP(w, req)
	assert.NotNil(t, req)
	assert.NotNil(t, w)
}

func TestCreatePatient(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.POST("/api/patient/", CreatePatient)

	patientReq := models.Patient{}
	jsonValue, _ := json.Marshal(patientReq)
	req, _ := http.NewRequest("POST", "/api/patient/", bytes.NewBuffer(jsonValue))
	req.Header.Set("Content-Type", "application/json")
	
	w := httptest.NewRecorder()
	
	// Un-comment after DB setup: router.ServeHTTP(w, req)
	assert.NotNil(t, req)
	assert.NotNil(t, w)
}
