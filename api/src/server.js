const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

app.get('/', (req, res) => {
    res.send('API no ar!');
});
