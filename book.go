package main

// Chapter описывает одну главу или страницу книги
type Chapter struct {
	Title string `json:"title"` // Название главы (например, "Глава I")
	Text  string `json:"text"`  // Текст этой главы
}

// BookQuote описывает карточку на главном экране и саму книгу внутри
type BookQuote struct {
	ID       int       `json:"id"`
	Text     string    `json:"text"`     // Цитата для карточки
	Color    string    `json:"color"`    // Цвет карточки
	Title    string    `json:"title"`    // Название книги
	Author   string    `json:"author"`   // Автор книги
	Chapters []Chapter `json:"chapters"` // Все главы книги для чтения
	IsLiked  bool      `json:"is_liked"` // Статус лайка
}
