const express = require('express');
const path = require('path');
const swaggerUI = require('swagger-ui-express');
const log = require('simple-node-logger').createSimpleLogger({
  timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS',
});
// eslint-disable-next-line no-unused-vars
const { productRouter, cartRouter } = require('./models/index');
const swaggerDocument = require('./docs/apidocs.json');

log.setLevel('debug');
const PORT = 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/', (req, res) => {
  res.sendFile(path.join(__dirname, './files/index.html'));
});

app.listen(PORT, () => {
  log.info(`Server up and listening on: http://localhost:${PORT}`);
});

app.on('error', (err) => {
  log.fatal(err);
});
