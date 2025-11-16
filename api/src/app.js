const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

const usuarioRoutes = require('./routes/usuario.routes.js');
const mesaRoutes = require('./routes/mesa.routes.js');
const produtoRoutes = require('./routes/produto.routes.js');
const comandaRoutes = require('./routes/comanda.routes.js');

dotenv.config();

app.use(express.json());
app.use(cors());

app.use('/usuarios', usuarioRoutes);
app.use('/mesa', mesaRoutes);
app.use('/produto', produtoRoutes);
app.use('/comanda', comandaRoutes);

module.exports = app;
