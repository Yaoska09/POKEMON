//require('dotenv').config();
const express = require('express');
const multer = require('multer');

const app = express();
const path = require('path');
//const loginRoutes = require('./routes/loginRoutes');


const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (solo para frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Rutas API
//app.use('/api/login', loginRoutes);


// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Manejo de errores (incluye errores de Multer)
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});