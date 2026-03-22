package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestLogin(t *testing.T) {
	gin.SetMode(gin.TestMode)

	t.Run("Successful Login", func(t *testing.T) {
		router := gin.Default()
		router.POST("/api/login", Login)

		loginReq := LoginRequest{
			Username: "admin",
			Password: "admintest",
		}
		jsonValue, _ := json.Marshal(loginReq)
		req, _ := http.NewRequest("POST", "/api/login", bytes.NewBuffer(jsonValue))
		req.Header.Set("Content-Type", "application/json")
		
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusCreated, w.Code)
		
		var response map[string]interface{}
		json.Unmarshal(w.Body.Bytes(), &response)
		assert.Equal(t, "Login successful", response["message"])
		assert.Equal(t, "admin", response["user"])
		assert.NotEmpty(t, response["token"])
	})

	t.Run("Invalid Payload", func(t *testing.T) {
		router := gin.Default()
		router.POST("/api/login", Login)

		req, _ := http.NewRequest("POST", "/api/login", bytes.NewBuffer([]byte(`{invalid-json}`)))
		req.Header.Set("Content-Type", "application/json")
		
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusBadRequest, w.Code)
	})

	t.Run("Unauthorized Login", func(t *testing.T) {
		router := gin.Default()
		router.POST("/api/login", Login)

		loginReq := LoginRequest{
			Username: "user",
			Password: "wrongpassword",
		}
		jsonValue, _ := json.Marshal(loginReq)
		req, _ := http.NewRequest("POST", "/api/login", bytes.NewBuffer(jsonValue))
		req.Header.Set("Content-Type", "application/json")
		
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusUnauthorized, w.Code)
	})
}
