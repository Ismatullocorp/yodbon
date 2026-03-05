// script.js

// --- 1. ТАНЗИМОТИ РЕҶАИ РАНГ ---
const themes = ['theme-day', 'theme-night', 'theme-book'];
const themeIcons = ['☀️ Рӯз', '🌙 Шаб', '📖 Китоб'];

function initTheme() {
    let savedThemeIndex = localStorage.getItem('yodbon_theme') || 1;
    document.body.className = themes[savedThemeIndex];
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) themeBtn.innerText = themeIcons[savedThemeIndex];
}

function cycleTheme() {
    let currentIndex = parseInt(localStorage.getItem('yodbon_theme') || 1);
    let nextIndex = (currentIndex + 1) % themes.length;
    localStorage.setItem('yodbon_theme', nextIndex);
    initTheme();
}

// --- ПАЙВАСТШАВӢ БО БАЗАИ АДМИН ---
function getDB(key) { return JSON.parse(localStorage.getItem(key)) || []; }

// --- 2. ПАНДҲО ---
function initQuotes() {
    const quoteEl = document.getElementById('quote-text');
    if (!quoteEl) return;
    
    let quotes = getDB('yodbon_db_quotes');
    if (quotes.length === 0) quotes = ["Ҳоло ягон панд илова нашудааст."];
    
    let index = 0;
    quoteEl.innerText = quotes[index];
    
    setInterval(() => {
        quoteEl.style.opacity = 0;
        setTimeout(() => {
            index = (index + 1) % quotes.length;
            quoteEl.innerText = quotes[index];
            quoteEl.style.opacity = 1;
        }, 400);
    }, 5000);
}

// --- 3. ЛУҒАТ ВА ҶУСТУҶӮ ---
function getFavorites() { return JSON.parse(localStorage.getItem('yodbon_favs')) || []; }

function toggleFav(id) {
    let favs = getFavorites();
    if (favs.includes(id)) favs = favs.filter(favId => favId !== id);
    else favs.push(id);
    localStorage.setItem('yodbon_favs', JSON.stringify(favs));
    
    // Пас аз пахш луғатро бо назардошти матни ҷустуҷӯшуда аз нав месозем
    const searchInput = document.getElementById('search-input');
    if (document.getElementById('dict-container')) {
        initDictionary(searchInput ? searchInput.value : '');
    }
    if (document.getElementById('profile-container')) initProfile();
}

// Функсияи Ҷустуҷӯ
function searchWords() {
    const searchText = document.getElementById('search-input').value.toLowerCase();
    initDictionary(searchText);
}

function initDictionary(filterText = '') {
    const container = document.getElementById('dict-container');
    if (!container) return;
    
    const wordsDB = getDB('yodbon_db_words');
    const favs = getFavorites();
    container.innerHTML = '';
    
    // Филтр кардани калимаҳо аз рӯи ҷустуҷӯ
    const filteredWords = wordsDB.filter(item => 
        item.word.toLowerCase().includes(filterText) || 
        item.meaning.toLowerCase().includes(filterText)
    );
    
    if (filteredWords.length === 0) {
        container.innerHTML = '<p style="text-align:center; opacity:0.6; margin-top:20px;">Калима ёфт нашуд.</p>';
        return;
    }
    
    filteredWords.forEach(item => {
        const isFav = favs.includes(item.id);
        container.innerHTML += `
            <div class="list-item glass-panel">
                <div class="item-text">
                    <h4>${item.word}</h4>
                    <p>${item.meaning}</p>
                </div>
                <button class="action-btn ${isFav ? 'active-heart' : ''}" onclick="toggleFav(${item.id})">
                    ${isFav ? '❤️' : '♡'}
                </button>
            </div>
        `;
    });
}

// --- 4. ПРОФИЛ ---
function initProfile() {
    const container = document.getElementById('profile-container');
    const statsEl = document.getElementById('profile-stats');
    if (!container) return;
    
    const wordsDB = getDB('yodbon_db_words');
    const favs = getFavorites();
    
    const savedWords = wordsDB.filter(item => favs.includes(item.id));
    if(statsEl) statsEl.innerText = `${savedWords.length} Ганҷ`;
    
    container.innerHTML = '';
    if (savedWords.length === 0) {
        container.innerHTML = '<p style="text-align:center; opacity:0.6;">Шумо ҳанӯз калимае захира накардаед.</p>';
        return;
    }
    
    savedWords.forEach(item => {
        container.innerHTML += `
            <div class="list-item glass-panel">
                <div class="item-text">
                    <h4>${item.word}</h4>
                    <p>${item.meaning}</p>
                </div>
                <button class="action-btn active-heart" onclick="toggleFav(${item.id})">❤️</button>
            </div>
        `;
    });
}

// --- 5. ДАРСҲО ---
function getCompleted() { return JSON.parse(localStorage.getItem('yodbon_user_lessons')) || []; }

function toggleLesson(id) {
    let completed = getCompleted();
    if (completed.includes(id)) completed = completed.filter(lId => lId !== id);
    else completed.push(id);
    localStorage.setItem('yodbon_user_lessons', JSON.stringify(completed));
    if (document.getElementById('lessons-container')) initLessons();
}

function initLessons() {
    const container = document.getElementById('lessons-container');
    const statsEl = document.getElementById('lesson-stats');
    if (!container) return;
    
    const lessonsDB = getDB('yodbon_db_lessons');
    const completed = getCompleted();
    
    if(statsEl) statsEl.innerText = `${completed.length}/${lessonsDB.length} иҷро шуд`;
    
    container.innerHTML = '';
    if (lessonsDB.length === 0) {
        container.innerHTML = '<p style="text-align:center; opacity:0.6;">Дарсҳо илова нашудаанд.</p>';
        return;
    }

    lessonsDB.forEach(l => {
        const isDone = completed.includes(l.id);
        container.innerHTML += `
            <div class="list-item glass-panel">
                <div class="item-text">
                    <h4>${l.title}</h4>
                    <p>${isDone ? 'Муваффақона анҷом ёфт' : 'Омода ба оғоз'}</p>
                </div>
                <button class="action-btn ${isDone ? 'active-check' : ''}" onclick="toggleLesson(${l.id})">
                    ${isDone ? '✔️' : '⭕'}
                </button>
            </div>
        `;
    });
}

// --- 6. МЕНЮИ ИЛОВАГӢ ---
function openMenu() { document.getElementById('popup-menu').style.display = 'flex'; }
function closeMenu() { document.getElementById('popup-menu').style.display = 'none'; }

// --- ОҒОЗИ КОРИ БАРНОМА ---
window.onload = () => {
    // Насби пойгоҳи ибтидоӣ агар холӣ бошад
    if (!localStorage.getItem('yodbon_db_words')) {
        localStorage.setItem('yodbon_db_quotes', JSON.stringify(["Илм чашмаи дониш аст.", "Ганҷ дар вайронаҳост."]));
        localStorage.setItem('yodbon_db_words', JSON.stringify([
            { id: 1, word: "Ганҷ", meaning: "Сарват, хазина" },
            { id: 2, word: "Хирад", meaning: "Ақл, дониш" },
            { id: 3, word: "Оина", meaning: "Шиша, зарфи аксбинӣ" }
        ]));
        localStorage.setItem('yodbon_db_lessons', JSON.stringify([{ id: 1, title: "Дарси Муқаддимавӣ" }]));
    }
    
    initTheme();
    initQuotes();
    initDictionary();
    initProfile();
    initLessons();
};
