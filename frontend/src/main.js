//import './app.css';

const cardsGrid = document.getElementById('cards-grid');
const readerScreen = document.getElementById('reader-screen');
const readerTitle = document.getElementById('reader-title');
const readerAuthor = document.getElementById('reader-author');
const chapterTitle = document.getElementById('chapter-title');
const readerText = document.getElementById('reader-text');
const backBtn = document.getElementById('back-to-feed-btn');

const prevBtn = document.getElementById('prev-chapter-btn');
const nextBtn = document.getElementById('next-chapter-btn');
const chapterCounter = document.getElementById('chapter-counter');

// ЭЛЕМЕНТЫ ДЛЯ ИЗБРАННОГО И ПОИСКА
const toggleFavoritesBtn = document.getElementById('toggle-favorites-btn');
const closeFavoritesBtn = document.getElementById('close-favorites-btn');
const favoritesSidebar = document.getElementById('favorites-sidebar');
const favoritesList = document.getElementById('favorites-list');
const searchInput = document.getElementById('search-input');
const searchContainer = document.querySelector('.search-container'); // Находим контейнер поиска

let cachedQuotes = [];
let currentBook = null;        
let currentChapterIndex = 0;
let isDataLoaded = false; // Флаг, чтобы запросить данные с бэкенда ровно один раз при старте

// Проверяем, запущено ли приложение внутри Wails
const isWails = window.go && window.go.main && window.go.main.App;

async function renderCards(filterText = '') {
    try {
        // ИСПРАВЛЕНИЕ СТАРТА: Если данные ещё ни разу не загружались — железно загружаем их
        if (!isDataLoaded) {
            if (isWails) {
                cachedQuotes = await window.go.main.App.GetFeedQuotes();
            } else {
                const response = await fetch('/api/quote');
                cachedQuotes = await response.json();
            }
            isDataLoaded = true; // Помечаем, что данные успешно стянуты
        }

        cardsGrid.innerHTML = '';
        const query = filterText.toLowerCase().trim();

        // Фильтруем карточки по тексту цитаты, названию книги или автору
        const filteredQuotes = cachedQuotes.filter(quote => {
            return quote.text.toLowerCase().includes(query) || 
                   quote.title.toLowerCase().includes(query) || 
                   quote.author.toLowerCase().includes(query);
        });

        if (filteredQuotes.length === 0) {
            cardsGrid.innerHTML = '<div class="empty-search">Ничего не найдено... 🔍</div>';
            return;
        }

        filteredQuotes.forEach(quote => {
            const cardElement = document.createElement('div');
            cardElement.className = `card ${quote.color}`;
            cardElement.innerHTML = `
                <div class="card-text">"${quote.text}"</div>
                <div class="card-actions">
                    <button class="read-btn" data-id="${quote.id}">Хочу читать</button>
                    <button class="like-btn" data-id="${quote.id}">
                        ${quote.is_liked ? '❤️' : '🤍'}
                    </button>
                </div>
            `;
            cardsGrid.appendChild(cardElement);
        });

        setupEventListeners();
        renderFavorites(); 
    } catch (err) {
        console.error("Ошибка при получении карточек:", err);
    }
}

// Oтрисовка залайканных книг в боковой панели
function renderFavorites() {
    if (!favoritesList) return;
    favoritesList.innerHTML = '';
    
    const likedBooks = cachedQuotes.filter(book => book.is_liked);

    if (likedBooks.length === 0) {
        favoritesList.innerHTML = '<p class="empty-message">Здесь пока ничего нет...</p>';
        return;
    }

    likedBooks.forEach(book => {
        const favItem = document.createElement('div');
        favItem.className = 'favorites-item';
        favItem.innerHTML = `
            <div class="fav-info">
                <span class="fav-title">${book.title}</span>
                <span class="fav-author">${book.author}</span>
            </div>
            <button class="fav-read-btn" data-id="${book.id}">Читать</button>
        `;
        favoritesList.appendChild(favItem);
    });

    document.querySelectorAll('.fav-read-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            openBookReader(id);
            favoritesSidebar.classList.add('hidden'); 
        });
    });
}

// Открытие читалки
function openBookReader(id) {
    currentBook = cachedQuotes.find(q => q.id === id);
    
    if (currentBook) {
        currentChapterIndex = 0; 
        
        readerTitle.innerText = currentBook.title;
        readerAuthor.innerText = currentBook.author;

        updateReaderContent();

        // Прячем сетку карточек и показываем читалку
        cardsGrid.classList.add('hidden');
        readerScreen.classList.remove('hidden');

        // НОВОЕ: Прячем поиск и кнопку избранного в режиме чтения книги
        if (searchContainer) searchContainer.classList.add('hidden');
        if (toggleFavoritesBtn) toggleFavoritesBtn.classList.add('hidden');
    }
}

// Обновление контента внутри экрана чтения
function updateReaderContent() {
    if (!currentBook || !currentBook.chapters || currentBook.chapters.length === 0) return;

    const chapter = currentBook.chapters[currentChapterIndex];
    
    chapterTitle.innerText = chapter.title;
    readerText.innerText = chapter.text;
    
    chapterCounter.innerText = `Глава ${currentChapterIndex + 1} из ${currentBook.chapters.length}`;

    prevBtn.disabled = currentChapterIndex === 0;
    nextBtn.disabled = currentChapterIndex === currentBook.chapters.length - 1;

    window.scrollTo(0, 0);
}

// Настройка слушателей для динамических кнопок лайков и чтения
function setupEventListeners() {
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            let nowLiked = false;

            if (isWails) {
                nowLiked = await window.go.main.App.ToggleLike(id);
            } else {
                const quote = cachedQuotes.find(q => q.id === id);
                if (quote) {
                    quote.is_liked = !quote.is_liked;
                    nowLiked = quote.is_liked;
                }
            }

            e.target.innerText = nowLiked ? '❤️' : '🤍';
            const quote = cachedQuotes.find(q => q.id === id);
            if (quote) quote.is_liked = nowLiked;

            renderFavorites(); 
        });
    });

    document.querySelectorAll('.read-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            openBookReader(id);
        });
    });
}

// Динамический поиск при вводе текста
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        if (!readerScreen.classList.contains('hidden')) {
            readerScreen.classList.add('hidden');
            cardsGrid.classList.remove('hidden');
        }
        renderCards(e.target.value);
    });
}

// Слушатели событий для открытия и закрытия боковой панели
if (toggleFavoritesBtn) {
    toggleFavoritesBtn.addEventListener('click', () => {
        favoritesSidebar.classList.toggle('hidden');
    });
}

if (closeFavoritesBtn) {
    closeFavoritesBtn.addEventListener('click', () => {
        favoritesSidebar.classList.add('hidden');
    });
}

prevBtn.addEventListener('click', () => {
    if (currentChapterIndex > 0) {
        currentChapterIndex--;
        updateReaderContent();
    }
});

nextBtn.addEventListener('click', () => {
    if (currentBook && currentChapterIndex < currentBook.chapters.length - 1) {
        currentChapterIndex++;
        updateReaderContent();
    }
});

backBtn.addEventListener('click', () => {
    readerScreen.classList.add('hidden');
    cardsGrid.classList.remove('hidden');

    // НОВОЕ: Возвращаем поиск и кнопку избранного на место при выходе в меню
    if (searchContainer) searchContainer.classList.remove('hidden');
    if (toggleFavoritesBtn) toggleFavoritesBtn.classList.remove('hidden');
});

// Функция умного старта приложения
function initApp() {
    // 1. Делаем первый мгновенный запуск
    renderCards().then(() => {
        // 2. Если бэкенд Wails не успел проснуться и карточек на экране нет (длина cachedQuotes равна 0)
        if (cachedQuotes.length === 0) {
            // Мягко повторяем попытку через 300 миллисекунд, когда Go точно инициализируется
            setTimeout(async () => {
                isDataLoaded = false; // Сбрасываем флаг, чтобы принудительно обновить данные
                await renderCards();
            }, 300);
        }
    });
}

// Запускаем наше приложение через функцию умного старта
document.addEventListener('DOMContentLoaded', initApp);

