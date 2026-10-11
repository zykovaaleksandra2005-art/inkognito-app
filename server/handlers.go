package server

import (
	"encoding/json"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

// Путь к нашей новой пофайловой базе данных
const jsonDirName = "database"

// Копия структуры книги, чтобы сервер понимал формат данных.
// Имена полей и теги строго совпадают с book.go и твоими JSON-файлами.
type Chapter struct {
	Title string `json:"title"`
	Text  string `json:"text"`
}

type BookQuote struct {
	ID       int       `json:"id"`
	Text     string    `json:"text"`
	Color    string    `json:"color"`
	Title    string    `json:"title"`
	Author   string    `json:"author"`
	IsLiked  bool      `json:"is_liked"`
	Chapters []Chapter `json:"chapters"`
}

// HandleHome отдает главную HTML-страницу для сайта
func HandleHome(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "./frontend/index.html")
}

// HandleGetQuote возвращает ВСЕ карточки для сайта в формате JSON
func HandleGetQuote(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	files, err := os.ReadDir(jsonDirName)
	if err != nil {
		http.Error(w, "Не удалось прочитать базу данных", http.StatusInternalServerError)
		return
	}

	var allBooks []BookQuote
	for _, file := range files {
		if file.IsDir() || !strings.HasSuffix(file.Name(), ".json") {
			continue
		}

		filePath := filepath.Join(jsonDirName, file.Name())
		fileData, err := os.ReadFile(filePath)
		if err != nil {
			continue
		}

		var singleBook BookQuote
		if err := json.Unmarshal(fileData, &singleBook); err == nil {
			allBooks = append(allBooks, singleBook)
		}
	}

	// Отдаем массив всех карточек прямо на сайт
	json.NewEncoder(w).Encode(allBooks)
}
