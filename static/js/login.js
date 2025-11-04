// Canvas stars
const canvas = document.getElementById('splash-canvas');
const ctx = canvas.getContext('2d');
let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;

// Création des étoiles
const stars = [];
for (let i = 0; i < 150; i++) {
    stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2
    });
}

// Animation des étoiles
function animateStars() {
    ctx.clearRect(0, 0, w, h);
    stars.forEach(s => {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0) s.x = w;
        if (s.x > w) s.x = 0;
        if (s.y < 0) s.y = h;
        if (s.y > h) s.y = 0;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,0,0,0.8)';
        ctx.fill();
    });
    requestAnimationFrame(animateStars);
}
animateStars();

// Gestion du resize
window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
});

// Splash transition
const SPLASH_TIME = 3000;
const splash = document.getElementById('splash');
const loginWrap = document.getElementById('loginWrap');

loginWrap.style.visibility = 'hidden';
loginWrap.style.opacity = '0';

window.addEventListener('load', () => {
    setTimeout(() => {
        splash.classList.add('hidden');
        setTimeout(() => {
            splash.style.display = 'none';
            loginWrap.style.visibility = 'visible';
            loginWrap.style.opacity = '1';
            document.getElementById('username').focus();
        }, 300);
    }, SPLASH_TIME);
});

// Permet de passer le splash avec la touche ESC
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && splash && !splash.classList.contains('hidden')) {
        splash.classList.add('hidden');
        setTimeout(() => {
            splash.style.display = 'none';
            loginWrap.style.visibility = 'visible';
            loginWrap.style.opacity = '1';
            document.getElementById('username').focus();
        }, 250);
    }
});
