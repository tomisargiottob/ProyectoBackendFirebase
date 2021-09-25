const { Router } = require('express');
const { v4: uuid } = require('uuid');

class Carts {
  constructor(db) {
    this.query = db.collection('carts');
    this.productQuery = db.collection('products');
    this.cartsRouter = new Router();
    this.cartsRouter.get('', async (req, res) => {
      try {
        if (req.headers.authorization) {
          const carts = await this.query.get();
          // eslint-disable-next-line arrow-body-style
          const cartsData = carts.docs.map((cart) => {
            return {
              id: cart.id,
              products: cart.data().products,
            };
          });
          res.status(200).send(cartsData);
        } else {
          res.status(401).send({ code: 401, message: 'user not authorized' });
        }
      } catch (err) {
        res.status(500).send({ code: 500, message: err.message });
      }
    });
    this.cartsRouter.get('/:id', async (req, res) => {
      const { id } = req.params;
      try {
        const doc = this.query.doc(id);
        const item = await doc.get();
        const foundCart = item.data();
        if (foundCart) {
          foundCart.id = item.id;
          res.status(200).send(foundCart);
        } else {
          res.status(404).send({ code: 404, message: `There is no cart with the id ${id}` });
        }
      } catch (err) {
        res.status(500).send({ code: 500, message: err.message });
      }
    });
    this.cartsRouter.post('', async (req, res) => {
      const cart = req.body;
      cart.products = [];
      try {
        const id = uuid();
        const doc = this.query.doc(`${id}`);
        await doc.create(cart);
        cart.id = id;
        res.status(200).send({ cart });
      } catch (err) {
        res.status(500).send({ message: err.message });
      }
    });
    this.cartsRouter.delete('/:id', async (req, res) => {
      const { id } = req.params;
      try {
        if (req.headers.authorization) {
          const doc = this.query.doc(id);
          const cart = await doc.delete();
          if (cart) {
            res.status(200).send({ cart });
          } else {
            res.status(404).send({ code: 404, message: `Cart with id ${id} does not exist` });
          }
        } else {
          res.status(401).send({ code: 401, message: 'user not authorized' });
        }
      } catch (err) {
        res.status(500).send({ code: 500, message: err.message });
      }
    });
    this.cartsRouter.get('/:id/products', async (req, res) => {
      const { id } = req.params;
      try {
        const doc = this.query.doc(id);
        const foundCart = await doc.get();
        if (foundCart) {
          res.status(200).send({ products: foundCart.data().products });
        } else {
          res.status(404).send({ code: 404, message: `There is no cart with the id ${id}` });
        }
      } catch (err) {
        res.status(500).send({ code: 500, message: err.message });
      }
    });
    this.cartsRouter.post('/:id/products/:idProd', async (req, res) => {
      const { id, idProd } = req.params;
      const { amount } = req.body;
      try {
        const doc = this.query.doc(id);
        const foundCart = await doc.get();
        if (foundCart) {
          const foundCartData = foundCart.data();
          foundCartData.id = foundCart.id;
          // eslint-disable-next-line
          let product = foundCartData.products.find((element) => element.id == idProd);
          if (!product) {
            const doc2 = this.productQuery.doc(idProd);
            const item2 = await doc2.get();
            product = item2.data();
            product.id = item2.id;
            product.amount = amount;
            foundCartData.products.push(product);
          } else {
            product.amount += amount;
          }
          await doc.update(foundCartData);
          res.status(200).send({ cart: foundCartData });
        } else {
          res.status(404).send({ code: 404, message: `There is no cart with the id ${id}` });
        }
      } catch (err) {
        res.status(500).send({ code: 500, message: err.message });
      }
    });
    this.cartsRouter.put('/:id/products/:idProd', async (req, res) => {
      const { id, idProd } = req.params;
      const { amount } = req.body;
      try {
        const doc = this.query.doc(id);
        const foundCart = await doc.get();
        if (foundCart) {
          const foundCartData = foundCart.data();
          foundCartData.id = foundCart.id;
          // eslint-disable-next-line
          const product = foundCartData.products.find((element) => element.id == idProd);
          if (product) {
            product.amount = amount;
            await doc.update(foundCartData);
            res.status(200).send({ foundCartData });
          } else {
            res.status(404).send({ code: 404, message: `There is no product with the id ${idProd} in the cart` });
          }
        } else {
          res.status(404).send({ code: 404, message: `There is no cart with the id ${id}` });
        }
      } catch (err) {
        res.status(500).send({ code: 500, message: err.message });
      }
    });
    this.cartsRouter.delete('/:id/products/:idProd', async (req, res) => {
      const { id, idProd } = req.params;
      try {
        const doc = this.query.doc(id);
        const foundCart = await doc.get();
        if (foundCart) {
          const foundCartData = foundCart.data();
          foundCartData.id = foundCart.id;
          // eslint-disable-next-line
          foundCartData.products = foundCartData.products.filter((product) => product.id != idProd);
          await doc.update(foundCartData);
          res.status(200).send({ cart: foundCartData });
        } else {
          res.status(404).send({ code: 404, message: `There is no cart with the id ${id}` });
        }
      } catch (err) {
        res.status(500).send({ code: 500, message: err.message });
      }
    });
  }
}

module.exports = Carts;
