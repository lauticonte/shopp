const fetch = require('node-fetch');

const server = require('../../src/index.js');
const fixture = require('../../fixtures/index.js');

let instance;

beforeEach(async () => {
    await fixture.insertIntoDB();
    instance = await server.start();
});

afterEach(async () => {
    await instance.close();
});

test('Deberia retornar 200 ok cuando se hace un request a la home', async () => {
    const port = instance.address().port;
    const resp = await fetch(`http://localhost:${port}/`);
    expect(resp.status).toBe(200);
});

test('Deberia utilizar bootstrap 5.2', async () => {
    const port = instance.address().port;
    const resp = await fetch(`http://localhost:${port}/`);
    const html = await resp.text();

    expect(html).toMatch('bootstrap@5.2.0');
});

test('Deberia aparecer Placard cuando hago un fetch del producto 1', async () => {
    const port = instance.address().port;
    const params = new URLSearchParams();

    params.append('productid',1);
    const resp = await fetch(`http://localhost:${port}/cart?${params}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            productid: 1,
        }),
    });
    const html = await resp.text();
    expect(html).toMatch('Placard');
});

test('Deberia retornar 200 ok cuando elimino un producto del carrito', async () => {
    const port = instance.address().port;
    const params = new URLSearchParams();

    params.append('productid',1);
    await fetch(`http://localhost:${port}/cart?${params}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            productid: 1,
        }),
    });

    params.append('productid',1);
    const resp1 = await fetch(`http://localhost:${port}/cart/delete?${params}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            productid: 1,
        }),
    });

    expect(resp1.status).toBe(200);    
});

test('Deberia mostrarme los productos con descuento', async () => {
    const port = instance.address().port;
    const resp = await fetch(`http://localhost:${port}/discount`);

    const html = await resp.text();
    expect(html).toMatch('Placard');
    expect(html).toMatch('Mesa');
    
});