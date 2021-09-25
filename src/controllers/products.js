const { Router } = require('express');
const { v4: uuid } = require('uuid');

class Products {
  constructor(db) {
    this.query = db.collection('products');
    this.productsRouter = new Router();
    this.productsRouter.get('', async (req, res) => {
      try {
        const todosProductos = await this.query.get();
        // eslint-disable-next-line arrow-body-style
        const productData = todosProductos.docs.map((product) => {
          return {
            id: product.id,
            name: product.data().name,
            description: product.data().description,
            code: product.data().code,
            thumbnail: product.data().thumbnail,
            price: product.data().price,
            stock: product.data().stock,
          };
        });
        res.status(200).send(productData);
      } catch (err) {
        res.status(500).send({ message: err.message });
      }
    });
    this.productsRouter.get('/:id', async (req, res) => {
      const { id } = req.params;
      try {
        const doc = this.query.doc(id);
        const item = await doc.get();
        const foundProduct = item.data();
        if (foundProduct) {
          foundProduct.id = item.id;
          res.status(200).send(foundProduct);
        } else {
          res.status(404).send({ code: 404, message: `Product with id ${id} does not exist` });
        }
      } catch (err) {
        res.status(500).send({ message: err.message });
      }
    });
    this.productsRouter.post('', async (req, res) => {
      const product = req.body;
      if (req.headers.authorization) {
        try {
          const id = uuid();
          const doc = this.query.doc(`${id}`);
          await doc.create(product);
          product.id = id;
          res.status(200).send({ product });
        } catch (err) {
          res.status(500).send({ message: err.message });
        }
      } else {
        res.status(401).send({ code: 401, message: 'user not authorized' });
      }
    });
    this.productsRouter.put('/:id', async (req, res) => {
      const { id } = req.params;
      const data = req.body;
      try {
        if (req.headers.authorization) {
          const doc = this.query.doc(id);
          const product = await doc.update(data);
          if (product) {
            data.id = id;
            res.status(200).send({ data });
          } else {
            res.status(404).send({ code: 404, message: `Product with id ${id} does not exist` });
          }
        } else {
          res.status(401).send({ code: 401, message: 'user not authorized' });
        }
      } catch (err) {
        res.status(500).send({ code: 500, message: err.message });
      }
    });
    this.productsRouter.delete('/:id', async (req, res) => {
      const { id } = req.params;
      try {
        if (req.headers.authorization) {
          const doc = this.query.doc(id);
          const product = await doc.delete();
          if (product) {
            res.status(200).send({ product });
          } else {
            res.status(404).send({ code: 404, message: `Product with id ${id} does not exist` });
          }
        } else {
          res.status(401).send({ code: 401, message: 'user not authorized' });
        }
      } catch (err) {
        res.status(404).send({ code: 500, message: err.message });
      }
    });
  }
}

module.exports = Products;
