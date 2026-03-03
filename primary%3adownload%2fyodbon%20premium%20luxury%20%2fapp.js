const db = (k) => JSON.parse(localStorage.getItem(k)) || [];

function applyTheme() {
    const t = localStorage.getItem('y_t') || "0";
    const icon = document.getElementById('t-icon');
    
    if(t === "1") {
        document.documentElement.className = "theme-day";
        if(icon) icon.innerText = "☀️";
    } else {
        document.documentElement.className = "theme-night";
        if(icon) icon.innerText = "🌙";
    }
}

function toggleTheme() {
    const current = localStorage.getItem('y_t') || "0";
    localStorage.setItem('y_t', current === "1" ? "0" : "1");
    applyTheme();
}

function logoControl() {
    window.clicks = (window.clicks || 0) + 1;
    if(window.clicks >= 5) location.href = 'admin.html';
    setTimeout(() => window.clicks = 0, 2000);
}
