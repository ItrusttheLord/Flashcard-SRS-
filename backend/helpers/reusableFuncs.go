package helpers

import (
	"encoding/json"
	"gorm.io/gorm"
	"net/http"
)

func EncodeJSONResponse(w http.ResponseWriter, data interface{}, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(data)
}

func DecodeRequestBody(w http.ResponseWriter, r *http.Request, item interface{}) error {
	if err := json.NewDecoder(r.Body).Decode(item); err != nil {
		return err
	}
	return nil
}

func FetchExistingItem(w http.ResponseWriter, db *gorm.DB, id string, item interface{}) error {
	//find matchin
	if err := db.First(item, id).Error; err != nil {
		return err
	}
	return nil
}
