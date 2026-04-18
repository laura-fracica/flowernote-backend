require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api/auth',      require('./routes/auth'));
app.use('/api/clientes',  require('./routes/clientes'));
app.use('/api/productos', require('./routes/productos'));
app.use('/api/ordenes',   require('./routes/ordenes'));
app.use('/api/mensajes',  require('./routes/mensajes'));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'OK' });
});

app.listen(3000, () => {
  console.log('🌸 API en http://localhost:3000');
});