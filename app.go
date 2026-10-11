package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"sync"
)

// Имя нашей папки с базой данных
const jsonDirName = "database"

// Старое имя файла для миграции данных
const oldJsonFileName = "data.json"

type App struct {
	ctx   context.Context
	mu    sync.Mutex
	cards []BookQuote
}

func NewApp() *App {
	return &App{}
}

// startup автоматически вызывается Wails при старте приложения
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	a.loadData() // Читаем данные из папки database при запуске
}

// Функция для пофайлового чтения данных из папки database
func (a *App) loadData() {
	a.mu.Lock()
	defer a.mu.Unlock()

	a.cards = []BookQuote{}

	// Проверяем, существует ли ещё старый общий data.json в корне проекта.
	// Если существует, мы автоматически разобьем его на 6 отдельных файлов.
	if _, err := os.Stat(oldJsonFileName); err == nil {
		fileData, err := os.ReadFile(oldJsonFileName)
		if err == nil {
			var oldCards []BookQuote
			if json.Unmarshal(fileData, &oldCards) == nil {
				// Убеждаемся, что папка database создана
				_ = os.MkdirAll(jsonDirName, 0755)

				// Сохраняем каждую карточку в её собственный JSON файл
				for _, card := range oldCards {
					cardData, _ := json.MarshalIndent(card, "", "    ")
					filePath := filepath.Join(jsonDirName, fmt.Sprintf("%d.json", card.ID))
					_ = os.WriteFile(filePath, cardData, 0644)
				}
				// Удаляем старый файл, так как данные успешно перенесены в папку database
				_ = os.Remove(oldJsonFileName)
			}
		}
	}

	// Читаем список всех файлов внутри обновленной папки database
	files, err := os.ReadDir(jsonDirName)
	if err != nil {
		return
	}

	// Проходим циклом по каждому найденному файлу
	for _, file := range files {
		// Пропускаем папки и файлы, которые не являются .json
		if file.IsDir() || !strings.HasSuffix(file.Name(), ".json") {
			continue
		}

		// Формируем путь, например: "database/1.json"
		filePath := filepath.Join(jsonDirName, file.Name())
		fileData, err := os.ReadFile(filePath)
		if err != nil {
			continue
		}

		// Десериализуем одну конкретную книгу
		var singleBook BookQuote
		if err := json.Unmarshal(fileData, &singleBook); err != nil {
			continue
		}

		// Добавляем прочитанную книгу в наш общий массив карточек
		a.cards = append(a.cards, singleBook)
	}
}

// Передаем список всех загруженных книг на фронтенд
func (a *App) GetFeedQuotes() []BookQuote {
	a.mu.Lock()
	defer a.mu.Unlock()
	return a.cards
}

// Переключаем лайк и СРАЗУ перезаписываем файл только одной измененной книги
func (a *App) ToggleLike(id int) bool {
	a.mu.Lock()
	defer a.mu.Unlock()

	for i, card := range a.cards {
		if card.ID == id {
			// Меняем статус лайка в памяти приложения
			a.cards[i].IsLiked = !a.cards[i].IsLiked

			// Превращаем измененную книгу обратно в красивый JSON
			jsonData, err := json.MarshalIndent(a.cards[i], "", "    ")
			if err != nil {
				return a.cards[i].IsLiked
			}

			// Формируем путь к её личному файлу (например, "database/1.json")
			filePath := filepath.Join(jsonDirName, fmt.Sprintf("%d.json", id))

			// Перезаписываем этот конкретный файл на диске
			_ = os.WriteFile(filePath, jsonData, 0644)

			return a.cards[i].IsLiked
		}
	}
	return false
}
