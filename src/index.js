const path = require('path');
const compression = require('compression');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');

const nunjucks = require('./utils/nunjucks.js');
const env = require('./utils/env.js');

// Modelos
const models = require('./models/index.js');

const detectPort = require('detect-port');

// Rutas
const router = require('./router.js');
const lhroute = require('./.lhroute.js');

const inTest = env.test;
const viewsPath = path.resolve(__dirname, '.', 'views');
const publicPath = path.resolve(__dirname, '.', 'public');

async function startServer(port = process.env.PORT) {
    port = port || (await detectPort(3000));
    await models.createTables();

    const app = express();

    if (!inTest) {
        app.use(morgan('dev'));
    }
    app.use(compression());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.use('/static', express.static(publicPath));

    nunjucks.init({
        express: app,
        viewsPath,
    });

    // rutas de la vista
    app.use('/', router);

    if (process.env.NODE_ENV !== 'production') {
        app.use('/lh', lhroute);
    }

    return new Promise(function (resolve) {
        const server = app.listen(port, function () {
            if (!inTest) {
                console.log(`Server listen on http://localhost:${port}`);
            }

            const originalClose = server.close.bind(server);
            server.close = async () => {
                return new Promise((resolveClose) => {
                    originalClose(resolveClose);
                });
            };

            resolve(server);
        });
    });
}

if (require.main === module) {
    startServer();
}

module.exports = {
    start: startServer,
};
