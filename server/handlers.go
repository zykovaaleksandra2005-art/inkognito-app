package server

import (
	"encoding/json"
	"inkognito-app/database" // Внимание: Импорт должен быть с большой буквы I
	"net/http"
)

// HandleHome отдает главную HTML-страницу
func HandleHome(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "./web/index.html")
}

// HandleGetQuote отдает цитату в формате JSON
func HandleGetQuote(w http.ResponseWriter, r *http.Request) {
	book := database.GetRandomBook()

	response := map[string]interface{}{
		"id":    book.ID,
		"quote": book.Quote,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
