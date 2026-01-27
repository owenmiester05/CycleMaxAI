package main

import (
	"encoding/json"
	"log"
	"net/http"
)
type Workout struct {
	Name string `json:"name"`
}
func main() {
    http.HandleFunc("/workout", workoutHandler)

	log.Println("Server starting on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func workoutHandler(w http.ResponseWriter, r *http.Request) {
	sample:= Workout{
		Name: "Endurance",
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(sample)
}