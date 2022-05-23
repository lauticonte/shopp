const Sequelize = require('sequelize');

const db = require('../db.js');

/**
 * Modelo de producto del carrito.
 *
 *
 */
const CartProduct = db.define(
    'CartProduct',
    {
        // Atributos
        quantity: {
            type: Sequelize.NUMBER,
            allowNull: false,
        },
    },
    { tableName: 'CartProduct' }
);

const increaseQuantity = (
    cartId,
    productId
) => CartProduct.findOne({ where: { cartId: cartId, productId: productId } }).then((cartProduct) => {
    if (cartProduct != null)
        return cartProduct.update({quantity: cartProduct.quantity + 1})
    return null
})

const decreaseQuantity = (
    cartId,
    productId
) => CartProduct.findOne({ where: { cartId: cartId, productId: productId } }).then((cartProduct) => {
    if (cartProduct != null && cartProduct.quantity > 1)
        return cartProduct.update({quantity: cartProduct.quantity - 1})
    return null
})

/**
 * Obtiene la cantidad del mismo producto dentro de un carrito.
 * Parámetro id: id a buscar en la base de datos.
 * Parámetro productId: id del producto a buscar.
 *
 */
 const getQuantity = (
    cartId,
    productId
) => {
    return CartProduct.findOne({ where: { cartId: cartId, productId: productId } }).then((cartProduct) => {
        if (cartProduct != null)
            return cartProduct.quantity;
        return null;
    })
}

const CartProductModel = {
    CartProduct: CartProduct,
    increaseQuantity: increaseQuantity,
    decreaseQuantity: decreaseQuantity,
    getQuantity: getQuantity
};

module.exports = CartProductModel;
