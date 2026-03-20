package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// Login handles user authentication
// @Summary Login user
// @Description Authenticates a user with username and password
// @Accept  json
// @Produce  json
// @Param login body LoginRequest true "Login Credentials"
// @Success 201 {object} map[string]interface{} "Successful login"
// @Failure 401 {object} map[string]interface{} "Unauthorized"
// @Router /api/login [post]
func Login(c *gin.Context) {
	var req LoginRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	if req.Username == "admin" && req.Password == "admintest" {
		c.JSON(http.StatusCreated, gin.H{
			"message": "Login successful",
			"user":    req.Username,
			"token":   "fake-jwt-token-for-admin",
		})
		return
	}

	c.JSON(http.StatusUnauthorized, gin.H{
		"error": "Unauthorized",
		"message": "Invalid username or password",
	})
}
