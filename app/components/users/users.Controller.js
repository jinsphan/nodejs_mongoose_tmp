// Import libraries
const mongoose = require("mongoose");
const { wrap: async } = require("co");
const multer   = require('multer');


// Import from our source
const { _generateToken, modifyUser } = require("../../utils/func.utils")
const { _vldUserRegister }           = require("../../utils/validation");

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
const addOne = async (req, res) => {
    const user = new User({
        username: req.body.username,
        role: req.body.role || '2',
        fullname: req.body.fullname,
        avatar: req.file.filename
    });

    try {
        user.hashed_password = await User.encryptPassword(req.body.password);
        await user.save();
        res.success(user.toJSON());
    } catch(er) {
        res.error(er);
    }
}
/**
 *  We have 3 validations: normal form, type file and check the same username 
 */
const validateUser = (data, file) => new Promise(async (resolve, reject) => {
    const {
        isValid,
        errors
    } = _vldUserRegister(data);
    
    // Validate normal form
    if (!isValid) return reject(errors);
    
    // Validate file type of avatar 
    if (!~file.mimetype.indexOf('image')) {
        return reject("File avatar must be an image");
    }

    // Validate the same account
    const user = await User.findOne({
        username: data.username
    }).exec();

    if (user) {
        return reject({
            username: "Username is available"
        })
    }
    
    resolve();
});


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
    validateUser
}