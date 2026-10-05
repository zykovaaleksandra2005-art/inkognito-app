package main

import (
	"context"
)

type App struct {
	ctx context.Context
}

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// GetFeedQuotes отправляет массив карточек на фронтенд
func (a *App) GetFeedQuotes() []BookQuote {
	return []BookQuote{
		{
			ID:       1,
			Text:     "Всё течёт, всё меняется. И никто не может войти в одну ищую реку дважды.",
			Color:    "purple",
			FullText: "Полный текст великой философии Гераклита о постоянном изменении мира...",
			IsLiked:  false,
		},
		{
			ID:       2,
			Text:     "Свобода ничего не стоит, если она не включает в себя свободу ошибаться.",
			Color:    "orange",
			FullText: "Полный текст Махатмы Ганди о внутренней свободе человека и его правах...",
			IsLiked:  true,
		},
		{
			ID:       3,
			Text:     "Быть или не быть, вот в чём вопрос. Достойно ль смиряться под ударами судьбы?",
			Color:    "teal",
			FullText: "Полный текст Гамлета Уильяма Шекспира. Монолог о жизни и смерти...",
			IsLiked:  false,
		},
	}
}

// ToggleLike переключает статус сердечка
func (a *App) ToggleLike(id int) bool {
	// Пока просто имитируем, что лайк успешно обработан
	return true
}
