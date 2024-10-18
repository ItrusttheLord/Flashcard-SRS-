package helpers

import (
	"github.com/gorilla/mux"
	"gorm.io/gorm"
	"net/http"
)

// //// DELETE hlper func
func DeleteItemHelper(w http.ResponseWriter, r *http.Request, db *gorm.DB, model interface{}) error {
	params := mux.Vars(r) //get url id && Check if the item exists
	if err := db.First(model, params["id"]).Error; err != nil {
		return err
	} // check for err && Delete the item if no err
	if err := db.Delete(model).Error; err != nil {
		return err
	}
	w.WriteHeader(http.StatusNoContent)
	return nil
}

// Get item by id response,r->request,db->DB,model{}->cards||review||plan
func GetItemByIDHelper(w http.ResponseWriter, r *http.Request, db *gorm.DB, model interface{}) error {
	params := mux.Vars(r) // get url id && check if item exist
	if err := db.First(model, params["id"]).Error; err != nil {
		http.Error(w, "Item Not Found", http.StatusNotFound)
		return err
	} //encode the response if it finds matching ID
	EncodeJSONResponse(w, model, http.StatusOK)
	return nil
}
