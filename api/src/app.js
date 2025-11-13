const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

const usuarioRoutes = require('./routes/usuario.routes.js');

dotenv.config();

app.use(express.json());
app.use(cors());

app.use('/usuarios', usuarioRoutes);

module.exports = app;
