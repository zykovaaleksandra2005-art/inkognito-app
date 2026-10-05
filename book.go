package main

// BookQuote описывает одну карточку цитаты для фронтенда
type BookQuote struct {
	ID       int    `json:"id"`
	Text     string `json:"text"`
	Color    string `json:"color"`     // Цвет карточки ("purple", "orange", "teal")
	FullText string `json:"full_text"` // Полный текст при клике на "Хочу читать"
	IsLiked  bool   `json:"is_liked"`  // Лайкнута цитата или нет
}
