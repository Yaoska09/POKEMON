const express = require('express');
const app = express();
const path = require('path');
const playerRoutes = require('./routes/playerRoutes');

const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (solo para frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Rutas API
app.use('/api/player', playerRoutes);

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});