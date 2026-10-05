import './style.css'; // Подключаем наши неоновые стили
// Импортируем сгенерированные Wails функции нашего моста
import { GetFeedQuotes, ToggleLike } from '../wailsjs/go/main/App';

// Функция, которая отрисовывает карточки на экране
async function renderFeed() {
    const grid = document.getElementById('cards-grid');
    if (!grid) return;

    try {
        // 1. Запрашиваем у Go-бэкенда массив наших карточек
        const quotes = await GetFeedQuotes();

        // Очищаем контейнер от старых надписей перед загрузкой
        grid.innerHTML = '';

        // 2. Проходимся циклом по каждой цитате и генерируем HTML-код
        quotes.forEach(quote => {
            const card = document.createElement('div');
            // Добавляем класс базовой карточки и класс цвета (purple, orange, teal)
            card.className = `quote-card ${quote.color}`;

            // Формируем внутренности карточки: текст, кнопку и сердечко
            card.innerHTML = `
                <div class="quote-text">
                    ${quote.text}
                </div>
                <div class="card-footer">
                    <button class="read-btn" onclick="openBook('${quote.full_text}')">Хочу читать</button>
                    <span class="like-icon" onclick="handleLike(event, ${quote.id}, this)">
                        ${quote.is_liked ? '❤️' : '🤍'}
                    </span>
                </div>
            `;

            grid.appendChild(card);
        });

    } catch (err) {
        console.error("Не удалось загрузить ленту цитат:", err);
        grid.innerHTML = `<div style="color: white; padding: 20px;">Ошибка загрузки бэкенда...</div>`;
    }
}

// Глобальная функция для обработки клика по лайку
window.handleLike = async function(event, id, element) {
    event.stopPropagation(); // Чтобы клик по лайку не открывал всю книгу
    try {
        const success = await ToggleLike(id);
        if (success) {
            // Переключаем сердечко на экране (простая визуальная логика)
            if (element.innerText === '🤍') {
                element.innerText = '❤️';
            } else {
                element.innerText = '🤍';
            }
        }
    } catch (err) {
        console.error("Ошибка при переключении лайка:", err);
    }
}

// Глобальная функция для кнопки "Хочу читать"
window.openBook = function(fullText) {
    // Пока просто выводим текст в обычном всплывающем окне
    // В будущем Девочка №1 сделает для этого красивое модальное окно поверх экрана
    alert(fullText);
}

// Как только HTML загрузился — запускаем рендеринг карточек
document.addEventListener('DOMContentLoaded', () => {
    renderFeed();
});
