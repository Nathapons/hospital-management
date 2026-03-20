package models

import "time"

type Patient struct {
	ID           uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	FirstNameTH  string    `gorm:"column:first_name_th;not null" json:"first_name_th"`
	MiddleNameTH string    `gorm:"column:middle_name_th" json:"middle_name_th"`
	LastNameTH   string    `gorm:"column:last_name_th;not null" json:"last_name_th"`
	FirstNameEN  string    `gorm:"column:first_name_en;not null" json:"first_name_en"`
	MiddleNameEN string    `gorm:"column:middle_name_en" json:"middle_name_en"`
	LastNameEN   string    `gorm:"column:last_name_en;not null" json:"last_name_en"`
	DateOfBirth  time.Time `gorm:"column:date_of_birth;not null" json:"date_of_birth"`
	PatientHN    string    `gorm:"column:patient_hn;uniqueIndex;not null" json:"patient_hn"`
	NationalID   string    `gorm:"column:national_id;uniqueIndex;not null" json:"national_id"`
	PassportID   string    `gorm:"column:passport_id;uniqueIndex" json:"passport_id"`
	PhoneNumber  string    `gorm:"column:phone_number" json:"phone_number"`
	Email        string    `gorm:"column:email" json:"email"`
	Gender       string    `gorm:"column:gender;type:varchar(1);check:gender IN ('M','F')" json:"gender"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}
