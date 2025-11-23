document.addEventListener('DOMContentLoaded', () => {
    let jugadoresConectados = 0;
    const form = document.getElementById('login-form');
    const errorMsg = document.getElementById('error-msg');
    const playerNameInput = document.getElementById('playerName');
    const playerStatus = document.getElementById('player-status');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const nombreJugador = playerNameInput.value.trim();

        if (!nombreJugador || nombreJugador.length < 2) {
            errorMsg.textContent = "⚠️ Ingresa un nombre válido (mín. 2 caracteres)";
            return;
        }

        realizarLogin(nombreJugador);
    });

    function realizarLogin(nombreJugador) {
        errorMsg.textContent = "";
        const startBtn = document.querySelector('.start-btn');
        localStorage.setItem('jugador1', nombreJugador.toString());
        startBtn.textContent = "¡ jugador listo! Redirigiendo...";
        setTimeout(() => {
            window.location.href = '/HTML/HTML_code.html';
        }, 1000);        
    }

    const music = document.getElementById('background-music');
    music.volume = 0.3;
    music.play();
});