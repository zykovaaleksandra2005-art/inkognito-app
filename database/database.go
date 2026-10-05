package database

// Book описывает книгу
type Book struct {
	ID     int
	Quote  string
	Title  string
	Author string
}

// GetRandomBook возвращает тестовую книгу
func GetRandomBook() Book {
	return Book{
		ID:     1,
		Quote:  "Мы привыкли выбирать книги по красивой обложке. Это приложение предлагает выбирать книгу «вслепую» — только по её душе...",
		Title:  "Маленький принц",
		Author: "Антуан де Сент-Экзюпери",
	}
}
