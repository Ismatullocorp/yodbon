/* admin-logic.js */
let editDictId = null;
let editLessId = null;

// 1. Гузариш байни бахшҳо
function switchAdminSec(type) {
    document.getElementById('sec-dict').style.display = type === 'dict' ? 'block' : 'none';
    document.getElementById('sec-less').style.display = type === 'less' ? 'block' : 'none';
    document.getElementById('t-dict').classList.toggle('active', type === 'dict');
    document.getElementById('t-less').classList.toggle('active', type === 'less');
}

// --- ЛУҒАТ (DICTIONARY) ---

function saveDict() {
    let words = db('y_words');
    const word = document.getElementById('d-w').value;
    const mean = document.getElementById('d-m').value;

    if(!word || !mean) return alert("Пур кунед!");

    if(editDictId) {
        // Тағйир додан
        words = words.map(w => w.id === editDictId ? {...w, word, mean} : w);
        editDictId = null;
    } else {
        // Иловаи нав
        words.push({ id: Date.now(), word, mean });
    }

    localStorage.setItem('y_words', JSON.stringify(words));
    resetDictForm();
    renderAdminLists();
}

function editDict(id) {
    const item = db('y_words').find(w => w.id === id);
    if(!item) return;
    
    editDictId = id;
    document.getElementById('d-w').value = item.word;
    document.getElementById('d-m').value = item.mean;
    document.getElementById('dict-form-title').innerText = "Таҳрири калима ✏️";
    document.getElementById('btn-dict-cancel').style.display = 'block';
    document.getElementById('d-w').focus();
}

function resetDictForm() {
    editDictId = null;
    document.getElementById('d-w').value = '';
    document.getElementById('d-m').value = '';
    document.getElementById('dict-form-title').innerText = "Иловаи Луғат";
    document.getElementById('btn-dict-cancel').style.display = 'none';
}

// --- ДАРСҲО (LESSONS) ---

function saveLess() {
    let lessons = db('y_less');
    const title = document.getElementById('l-t').value;
    const cont = document.getElementById('l-c').value;

    if(!title || !cont) return alert("Пур кунед!");

    if(editLessId) {
        lessons = lessons.map(l => l.id === editLessId ? {...l, title, cont} : l);
        editLessId = null;
    } else {
        lessons.push({ id: Date.now(), title, cont });
    }

    localStorage.setItem('y_less', JSON.stringify(lessons));
    resetLessForm();
    renderAdminLists();
}

function editLess(id) {
    const item = db('y_less').find(l => l.id === id);
    if(!item) return;

    editLessId = id;
    document.getElementById('l-t').value = item.title;
    document.getElementById('l-c').value = item.cont;
    document.getElementById('less-form-title').innerText = "Таҳрири дарс ✏️";
    document.getElementById('btn-less-cancel').style.display = 'block';
    document.getElementById('l-t').focus();
}

function resetLessForm() {
    editLessId = null;
    document.getElementById('l-t').value = '';
    document.getElementById('l-c').value = '';
    document.getElementById('less-form-title').innerText = "Иловаи Дарс";
    document.getElementById('btn-less-cancel').style.display = 'none';
}

// --- УМУМӢ (DELETE & RENDER) ---

function deleteItem(key, id) {
    if(!confirm("Оё боварӣ доред, ки нест кунед?")) return;
    let data = db(key).filter(x => x.id !== id);
    localStorage.setItem(key, JSON.stringify(data));
    renderAdminLists();
}

function renderAdminLists() {
    // Рӯйхати Луғат
    const dictList = document.getElementById('adm-dict-list');
    dictList.innerHTML = db('y_words').map(w => `
        <div class="card" style="padding:12px; margin-bottom:10px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span><b>${w.word}</b></span>
                <div class="item-actions">
                    <button class="btn-edit" onclick="editDict(${w.id})">Тағйир</button>
                    <button class="btn-del" onclick="deleteItem('y_words', ${w.id})">Нест кардан</button>
                </div>
            </div>
        </div>
    `).reverse().join('');

    // Рӯйхати Дарсҳо
    const lessList = document.getElementById('adm-less-list');
    lessList.innerHTML = db('y_less').map(l => `
        <div class="card" style="padding:12px; margin-bottom:10px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span><b>${l.title}</b></span>
                <div class="item-actions">
                    <button class="btn-edit" onclick="editLess(${l.id})">Тағйир</button>
                    <button class="btn-del" onclick="deleteItem('y_less', ${l.id})">Нест кардан</button>
                </div>
            </div>
        </div>
    `).reverse().join('');
}

window.addEventListener('DOMContentLoaded', renderAdminLists);
