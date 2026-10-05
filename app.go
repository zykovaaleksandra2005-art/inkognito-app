package main

import (
	"context"
	"inkognito-app/database" // Подключаем твою базу данных
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts.
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Создаем структуру, которую поймет JavaScript на фронтенде
type QuoteResponse struct {
	ID    int    `json:"id"`
	Quote string `json:"quote"`
}

// Наш новый мост для получения цитаты напрямую из базы
func (a *App) GetQuote() QuoteResponse {
	// Вызываем твою оригинальную функцию из пакета database
	book := database.GetRandomBook()

	// Заворачиваем данные и отдаем их прямо в интерфейс
	return QuoteResponse{
		ID:    book.ID,
		Quote: book.Quote,
	}
}
