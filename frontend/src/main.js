import './app.css';

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

let cachedQuotes = [];
let currentBook = null;        
let currentChapterIndex = 0;   

async function renderCards() {
    try {
        cachedQuotes = await window.go.main.App.GetFeedQuotes();
        cardsGrid.innerHTML = '';

        cachedQuotes.forEach(quote => {
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
    } catch (err) {
        console.error("Ошибка при получении карточек:", err);
    }
}

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

function setupEventListeners() {
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            const nowLiked = await window.go.main.App.ToggleLike(id);
            e.target.innerText = nowLiked ? '❤️' : '🤍';
            const quote = cachedQuotes.find(q => q.id === id);
            if (quote) quote.is_liked = nowLiked;
        });
    });

    document.querySelectorAll('.read-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            currentBook = cachedQuotes.find(q => q.id === id);
            
            if (currentBook) {
                currentChapterIndex = 0; 
                
                readerTitle.innerText = currentBook.title;
                readerAuthor.innerText = currentBook.author;

                updateReaderContent();

                cardsGrid.classList.add('hidden');
                readerScreen.classList.remove('hidden');
            }
        });
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
});

document.addEventListener('DOMContentLoaded', renderCards);
