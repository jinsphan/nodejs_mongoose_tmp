'use strict';

/*
 * nodejs-mongoose-tmp
 * Copyright(c) 2018 Tinh Phan <pvtinh1996@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies
 */

require('dotenv').config();

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const config = require('./config');
const app = express();
const port = process.env.PORT || 3001;
const models = ['users'];

// Bootstrap models
models
    .map(model => path.join(config.ROOT, `app/components/${model}/${model}.Model`))
    .forEach(require);

// Bootstrap routes
require('./config/express')(app, passport);

const listen = () => {
    // When testing API, should turn off server listening
    if (app.get('env') === 'test') return;
    app.listen(port);
    console.log(`App is listening on port: ${port}`);
}

const connect = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(config.DB.MONGOOSE_URL);
        const db = mongoose.connection;
        db.on('error', () => reject('Server can not connect.'));
        db.once('open', resolve)
    })
}

connect()
    .then(listen)
    .catch((er) => {
        console.log(er);
        process.exit(1);
    })

module.exports = app;