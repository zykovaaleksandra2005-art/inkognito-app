// 1. Подключаем стили (убедись, что файлы стилей лежат в этой же папке frontend)
import './style.css'; 

// 2. Импортируем нашу функцию из Go-бэкенда, которую мы прописали в app.go
import { GetQuote } from '../wailsjs/go/main/App';

// 3. Создаем функцию, которая запрашивает цитату у Go и выводит её на экран
window.loadNewQuote = async function() {
    const quoteElement = document.getElementById('quote-text'); // Сюда будем вставлять текст
    const idElement = document.getElementById('quote-id');       // Сюда (если нужно) ID цитаты

    try {
        // Просим Go сходить в базу данных за случайной книгой/цитатой
        const data = await GetQuote(); 

        // Если элементы есть на странице — заполняем их текстом из базы данных
        if (quoteElement) quoteElement.innerText = data.quote;
        if (idElement) idElement.踏nnerText = `Цитата №${data.id}`;

    } catch (err) {
        console.error("Ой, не удалось получить цитату из базы данных:", err);
        if (quoteElement) quoteElement.innerText = "Ошибка загрузки базы данных...";
    }
}

// 4. Как только программа загрузилась — сразу показываем первую случайную цитату
document.addEventListener('DOMContentLoaded', () => {
    window.loadNewQuote();
});
