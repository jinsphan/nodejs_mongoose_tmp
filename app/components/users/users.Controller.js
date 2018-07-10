// Import libraries
const mongoose = require("mongoose");
const { wrap: async } = require("co");
const multer   = require('multer');


// Import from our source
const { _generateToken, modifyUser } = require("../../utils/func.utils")
const User = mongoose.model(require("./users.Seed").modelName);

// Varibable
// const storage = multer.memoryStorage();
// const upload = multer({storage: storage}).single('file');

/**
 * Load user data when route have _id param
 */

const load = async (req, res, next, _id) => {
    try {
        const options = {
            criteria: {
                _id,
            }
        }
        req.profile = await User.load(options);
        if (!req.profile) return next(new Error("User not found"));
    } catch (er) {
        return next(er);
    }
    next();
}

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

const getOneById = (req, res) => {
    res.success(modifyUser(req.profile.toJSON()));
}

/**
 * Create new user
 */
const addOne = (req, res) => {
    res.success("OK");
}
const validateForm = (data, file) => {
    
    console.log(username, password, fullname);
}

/**
 * After login success, it will response to client a token
 */

const afterLogin = (req, res) => {
    const data = {
        token:  _generateToken(modifyUser(req.user))
    }
    res.success(data);
}


module.exports = {
    getAll,
    afterLogin,
    getOneById,
    addOne,
    load,
    validateForm
}