const path          = require('path');
const logger        = require('morgan');
const bodyParser    = require('body-parser');
const cors          = require('cors');
const cookiesParser = require('cookie-parser');
const express       = require('express');
const config        = require('./index');
// Middleware
const { notFound, unAuthorized, passportAuthen, responseModified } = require('./middleware');
// Api Router
const apiRouter                                  = require('./routes');


module.exports = (app, passport) => {
    app.use(responseModified);
    passport.use(passportAuthen);
    app.use(cors()); // cross-origin for all route
    app.use(express.static(config.ROOT + '/assets'));

    // No logger for testing
    if (app.get('env') !== 'test') {
        app.use(logger('dev'));
    }
    
    app.use(cookiesParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(passport.initialize());

    app.get('/', (req, res) => {
        res.success({
            message: 'Welcome Nodejs With Mongoose'
        });
    })
    
    app.use('/api', apiRouter);
    app.use(notFound);
    
    app.use((err, req, res, next) => {
        res.error(err.message);
    })

    app.use(unAuthorized);
};
