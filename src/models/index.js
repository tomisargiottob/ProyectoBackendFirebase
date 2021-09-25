const admin = require('firebase-admin');
const Carts = require('../controllers/cart');
const Products = require('../controllers/products');

const serviceAccount = require('./proyectofinal-a5e2d-firebase-adminsdk-h0x02-9558914dcb.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'HTTPS://proyectofinal-a5e2d.firebaseio.com',
});

const db = admin.firestore();
const cart = new Carts(db);
const product = new Products(db);
console.log('Connected!');

module.exports = { cartRouter: cart.cartsRouter, productRouter: product.productsRouter };
