const path     = require('path');
const __DEV__  = require('./env/development');
const __TEST__ = require('./env/test');

// Config for json web token
const jwtConfig = {
    KEY_JWT_SECRET: "j!n$94@n",
}

// Config for encrypt password
const bcryptConfig = {
    SALT_ROUND: 10,
}

// This is defaults config
const defaults = {
    ...jwtConfig,
    ...bcryptConfig,
    ROOT: path.join(__dirname, ".."),
}

const config = {
    development: {
        ...defaults,
        ...__DEV__
    },
    test: {
        ...defaults,
        ...__TEST__
    }
}

module.exports = config[process.env.NODE_ENV || 'development'];
