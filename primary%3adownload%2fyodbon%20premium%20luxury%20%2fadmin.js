// admin.js
const db = (k) => JSON.parse(localStorage.getItem(k)) || [];

function auth() {
    if(document.getElementById('pass').value === '0000') {
        document.getElementById('login').style.display = 'none';
        document.getElementById('dash').style.display = 'block';
        render();
    }
}

function sh(t) {
    document.getElementById('sec-w').style.display = t==='w'?'block':'none';
    document.getElementById('sec-l').style.display = t==='l'?'block':'none';
}

function addW() {
    let d = db('y_words');
    let n = document.getElementById('w-n').value;
    let m = document.getElementById('w-m').value;
    if(!n || !m) return;
    d.push({id: Date.now(), word: n, mean: m});
    localStorage.setItem('y_words', JSON.stringify(d));
    document.getElementById('w-n').value = ''; document.getElementById('w-m').value = '';
    render();
}

function addL() {
    let d = db('y_less');
    let t = document.getElementById('l-t').value;
    let c = document.getElementById('l-c').value;
    if(!t || !c) return;
    d.push({id: Date.now(), title: t, cont: c});
    localStorage.setItem('y_less', JSON.stringify(d));
    document.getElementById('l-t').value = ''; document.getElementById('l-c').value = '';
    render();
}

function del(k, id) {
    let d = db(k).filter(x => x.id !== id);
    localStorage.setItem(k, JSON.stringify(d));
    render();
}

function render() {
    const w = db('y_words');
    document.getElementById('list-w').innerHTML = w.map(x => `
        <div class="glass list-item"><span>${x.word}</span> <button class="btn-del" onclick="del('y_words', ${x.id})">Ҳазф</button></div>
    `).join('');
    
    const l = db('y_less');
    document.getElementById('list-l').innerHTML = l.map(x => `
        <div class="glass list-item"><span>${x.title}</span> <button class="btn-del" onclick="del('y_less', ${x.id})">Ҳазф</button></div>
    `).join('');
}
