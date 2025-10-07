// Datos de ejemplo (puedes reemplazar por base de datos después)
const validUser = "Ash";
const validPassword = "pikachu";

const form = document.getElementById('login-form');
const errorMsg = document.getElementById('error-msg');

form.addEventListener('submit', function(e){
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if(username === validUser && password === validPassword){
        // Usuario correcto, redirigir al juego
        window.location.href = '../HTML/index.html';
    } else {
        errorMsg.textContent = "Usuario o contraseña incorrectos 😢";
    }
});

// Reproducir música de fondo automáticamente
const music = document.getElementById('background-music');
music.volume = 0.5; // volumen al 50%
music.play().catch(() => {
    // Si el navegador bloquea autoplay, no pasa nada
});
window.addEventListener('load', () => {
    const poke1 = document.getElementById('login-pokemon1');
    const poke2 = document.getElementById('login-pokemon2');

    // Animación al cargar
    setTimeout(() => {
        poke1.classList.add('centered');
        poke2.classList.add('centered2');
    }, 200); // pequeño retraso para que se vea más bonito
});
