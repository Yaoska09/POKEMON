const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const jugadores = {}; // { socketId: { jugador: 1 o 2, nombre: "..." } }


const PORT = process.env.PORT || 4000;

// Servir todos los archivos dentro de /public
app.use(express.static(path.join(__dirname, 'public')));

// Página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Manejo de sockets
io.on('connection', (socket) => {
    console.log('🎮 Nuevo entrenador conectado:', socket.id);

   socket.on('jugador-login', (datosJugador) => {
    const numJugadores = Object.keys(jugadores).length;

    if (numJugadores < 2) {
        const jugadorNum = numJugadores + 1;
        jugadores[socket.id] = { jugador: jugadorNum, nombre: datosJugador.nombre };

        socket.emit('asignar-jugador', { jugador: jugadorNum, nombre: datosJugador.nombre });

        // Notificar a todos los jugadores los nombres actuales
        const nombresActuales = Object.values(jugadores).map(j => j.nombre);
        io.emit('actualizar-nombres', nombresActuales);

        console.log(`✅ ${datosJugador.nombre} es Jugador ${jugadorNum}`);
    } else {
        socket.emit('error-login', { mensaje: 'Sala llena (máx 2 jugadores)' });
    }
});


    socket.on('disconnect', () => {
        console.log('❌ Entrenador desconectado:', socket.id);
    });
});

// Iniciar servidor
server.listen(PORT, () => {
    console.log(`⚡ Servidor Pokémon ejecutándose en: http://localhost:${PORT}`);
});
