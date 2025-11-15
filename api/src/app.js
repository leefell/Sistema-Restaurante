const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

const usuarioRoutes = require('./routes/usuario.routes.js');
const mesaRoutes = require('./routes/mesa.routes.js');

dotenv.config();

app.use(express.json());
app.use(cors());

app.use('/usuarios', usuarioRoutes);
app.use('/mesa', mesaRoutes);

module.exports = app;
