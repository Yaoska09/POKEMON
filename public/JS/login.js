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
    if (jugadoresConectados == 0) {
        jugadoresConectados++;
        localStorage.setItem('jugador1', nombreJugador.toString());
        startBtn.textContent = "🎮 Esperando jugador 2 ";
        playerNameInput.value = "";
    }
    else if (jugadoresConectados == 1) {
        jugadoresConectados++;
        localStorage.setItem('jugador2', nombreJugador.toString());
        startBtn.textContent = "¡Ambos jugadores listos! Redirigiendo...";
        // Redirigir al juego después de un pequeño retraso si ambos jugadores están listos
        setTimeout(() => {
            window.location.href = '/HTML/HTML_code.html'; 
        }, 500 ); 
    }
}
// Música de fondo
const music = document.getElementById('background-music');
music.volume = 0.3;
music.play();
