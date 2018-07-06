const mongoose           = require("mongoose");
const { _generateToken } = require("../../utils/func.utils")
const User               = mongoose.model(require("./users.Seed").modelName);

/**
 * Get all users in database
 * @requires authentication
 */

const getAll = (req, res) => {
    User.find().exec((err, docs) => {
        if (err) {
            return res.error(err);
        }
        res.success(docs);
    })
}

/**
 * Get user by user _id
 */

const getById = (req, res) => {

}

/**
 * After login success, it will response to client a token
 */

const afterLogin = (req, res) => {
    const user = {
        ...req.user,
        avatar: `${req.get('host')}/images/avatars/${req.user.avatar}`
    }
    res.json({
        token: _generateToken(user),
    })
}


module.exports = {
    getAll,
    afterLogin
}