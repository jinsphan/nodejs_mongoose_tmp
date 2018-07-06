const path          = require('path');
const logger        = require('morgan');
const bodyParser    = require('body-parser');
const cors          = require('cors');
const cookiesParser = require('cookie-parser');
const express       = require('express');
const config        = require('./index');
// Middleware
const { notFound, unAuthorized, passportAuthen } = require('./middleware');
// Api Router
const apiRouter                                  = require('./routes');


module.exports = (app, passport) => {
    passport.use(passportAuthen);
    app.use(cors()); // cross-origin for all route
    app.use(express.static(config.ROOT + '/assets'));

    // No logger for testing
    if (app.get('env') !== 'test') {
        app.use(logger('dev'));
    }
    
    app.use(cookiesParser());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json())
    app.use(passport.initialize());
    
    app.get('/', (req, res) => {
        res.status(200).json({
            message: 'Welcome Nodejs With Mongoose'
        })
    })
    
    app.use('/api', apiRouter);
    app.use(notFound);
    app.use(unAuthorized);
};
