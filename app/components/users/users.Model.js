const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');
const Schema   = mongoose.Schema;
const {
    SALT_ROUND
} = require('../../../config');
const { wrap: async } = require("co");

const UserSchema = new Schema({
    username: { type: String, default: '' },
    hashed_password: { type: String, default: '' },
    fullname: { type: String, default: '' },
    avatar: { type: String, default: '' },
    role: { type: Number, default: 2 }
})

UserSchema
    .virtual('password')
    .get(function () {
        return this.hashed_password;
    })

/**
 * Methods
 */

UserSchema.methods = {
    /**
     * Authenticate - check if the passwords are the same
     * @param {String} plainText
     * @return {Boolean}
     * @api private
     */

    authenticate: async function (plainText) {
        const isCorrectPassword =  await bcrypt.compare(plainText, this.hashed_password);
        return isCorrectPassword;
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
        options.select = options.select || "username fullname avatar role _id";
        return this.findOne(options.criteria)
            .select(options.select)
            .exec(cb)
    },
    /**
     * Encrypt password
     * @param { plainText } password
     * @api private
     */
    
    encryptPassword: async function (password) {
        const hashed_password =  await bcrypt.hash(password, SALT_ROUND);
        return hashed_password;
    },
}

mongoose.model('User', UserSchema);