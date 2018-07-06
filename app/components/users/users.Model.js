const join     = require('path').join;
const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');
const Schema   = mongoose.Schema;
const {
    SALT_ROUND
} = require('../../../config');

const UserSchema = new Schema({
    username: { type: String, default: '' },
    hashed_password: { type: String, default: '' },
    fullname: { type: String, default: '' },
    avatar: { type: String, default: '' },
    role: { type: Number, default: 2 }
})

UserSchema
    .virtual('password')
    .set(function(password) {
        this.encryptPassword(password)
            .then(hash => this.hashed_password = hash)
            .catch(console.log);
    })

/**
 * Methods
 */

UserSchema.methods = {
    encryptPassword: function (password) {
        return bcrypt.hash(password, SALT_ROUND);
    },

    /**
     * Authenticate - check if the passwords are the same
     * @param {String} plainText
     * @return {Promise}
     * @api private
     */

    authenticate: function(plainText) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(plainText, this.hashed_password, (err, res) => {
                if (err) reject({ message: 'Has error when compare password' })
                else if (!res) reject({ message: 'Invalid password' });
                else resolve();
            });
        })
    }
}

/**
 * Statics
 */

UserSchema.statics = {
    /**
     * Load
     * @param { Ocject } options
     * @param { Function } cb
     * @api private
     */

    load: function(options, cb) {
        options.select = options.select || "username fullname";
        return this.findOne(options.criteria)
            .select(options.select)
            .exec(cb)
    }
}

mongoose.model('User', UserSchema);